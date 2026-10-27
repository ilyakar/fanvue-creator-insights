/* ------------------------------------------------------------
Exercises migration, access controls, job recovery and distributed refresh locking in real Postgres.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

// Exercises migration, access controls, job recovery and distributed refresh locking in real Postgres.
test('private database schema, durable jobs and refresh leases', async () => {
  const database = new PGlite()
  await database.exec('create role anon; create role authenticated; create role service_role;')
  await database.exec(await readFile(new URL('../supabase/migrations/001_initial.sql', import.meta.url), 'utf8'))
  const firstUser = '11111111-1111-4111-8111-111111111111'
  const secondUser = '22222222-2222-4222-8222-222222222222'
  const firstLease = '33333333-3333-4333-8333-333333333333'
  const secondLease = '44444444-4444-4444-8444-444444444444'

  await database.query(
    "insert into app_users(id,fanvue_id,username,display_name) values ($1::uuid,$1::text,'one','One'), ($2::uuid,$2::text,'two','Two')",
    [firstUser, secondUser]
  )

  await database.query(
    "insert into analysis_jobs(user_id,cache_key,dataset_version) values ($1,'first','v1'),($2,'second','v1')",
    [firstUser, secondUser]
  )

  const firstClaim = await database.query<{ id: string; attempts: number; status: string }>(
    'select * from claim_analysis_job($1)',
    [firstLease]
  )

  const secondClaim = await database.query<{ id: string }>('select * from claim_analysis_job($1)', [secondLease])
  assert.equal(firstClaim.rows[0].status, 'analysing')
  assert.equal(firstClaim.rows[0].attempts, 1)
  assert.notEqual(firstClaim.rows[0].id, secondClaim.rows[0].id)
  assert.equal((await database.query('select * from claim_analysis_job($1)', [secondLease])).rows.length, 0)

  await database.query("update analysis_jobs set lease_until = now() - interval '1 minute' where id = $1", [
    firstClaim.rows[0].id
  ])

  const recovered = await database.query<{ id: string; attempts: number }>('select * from claim_analysis_job($1)', [
    secondLease
  ])

  assert.equal(recovered.rows[0].id, firstClaim.rows[0].id)
  assert.equal(recovered.rows[0].attempts, 2)

  await database.query(
    "insert into fanvue_connections(user_id,access_token,refresh_token,expires_at) values ($1,'encrypted','encrypted',now() - interval '1 minute')",
    [firstUser]
  )

  assert.equal(
    (await database.query<{ claimed: boolean }>("select claim_fanvue_refresh($1,'lease-one') as claimed", [firstUser]))
      .rows[0].claimed,
    true
  )

  assert.equal(
    (await database.query<{ claimed: boolean }>("select claim_fanvue_refresh($1,'lease-two') as claimed", [firstUser]))
      .rows[0].claimed,
    false
  )

  await database.exec('set role anon')
  await assert.rejects(database.query('select * from app_users'), /permission denied/)
  await database.exec('reset role; set role authenticated')
  await assert.rejects(database.query('select * from analysis_jobs'), /permission denied/)
  await database.exec('reset role')
  await database.query('delete from app_users where id = $1', [firstUser])
  assert.equal((await database.query('select * from fanvue_connections where user_id=$1', [firstUser])).rows.length, 0)
  assert.equal((await database.query('select * from analysis_jobs where user_id=$1', [firstUser])).rows.length, 0)
  await database.close()
})
