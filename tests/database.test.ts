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

// Verifies shared demo routing, tenant relationships and browser access restrictions.
test('creator datasets stay isolated while logins share the demo source', async () => {
  const database = new PGlite()
  await database.exec('create role anon; create role authenticated; create role service_role;')
  await database.exec(await readFile(new URL('../supabase/migrations/001_initial.sql', import.meta.url), 'utf8'))
  await database.exec(
    await readFile(new URL('../supabase/migrations/20261027161608_shared_audience_data.sql', import.meta.url), 'utf8')
  )
  await database.exec(await readFile(new URL('../supabase/seed.sql', import.meta.url), 'utf8'))
  await database.exec(await readFile(new URL('../supabase/seed.sql', import.meta.url), 'utf8'))

  const demoCreatorId = '00000000-0000-4000-8000-000000000001'
  const otherCreatorId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  const snapshot = await database.query<{ dataset: { posts: unknown[]; comments: unknown[]; fans: unknown[] } }>(
    'select get_audience_dataset($1) as dataset',
    [demoCreatorId]
  )

  assert.equal(snapshot.rows[0].dataset.posts.length, 18)
  assert.equal(snapshot.rows[0].dataset.comments.length, 360)
  assert.equal(snapshot.rows[0].dataset.fans.length, 96)
  assert.equal(
    (
      await database.query<{ count: number }>(
        'select jsonb_array_length(insights) as count from audience_preview_results'
      )
    ).rows[0].count,
    9
  )

  await database.exec(
    "insert into app_users(fanvue_id,username,display_name) values ('one','one','One'),('two','two','Two')"
  )
  const accounts = await database.query<{ audience_creator_id: string }>('select audience_creator_id from app_users')
  assert.deepEqual(
    accounts.rows.map(account => account.audience_creator_id),
    [demoCreatorId, demoCreatorId]
  )

  await database.query(
    "insert into audience_creators(id,display_name,dataset_version) values ($1,'Other creator','v1')",
    [otherCreatorId]
  )
  await database.query(
    "insert into audience_posts select $1,id,'Other title',caption,published_at,thumbnail,format from audience_posts where creator_id=$2 and id='post-01'",
    [otherCreatorId, demoCreatorId]
  )
  await assert.rejects(
    database.query(
      "insert into audience_comments(creator_id,id,post_id,fan_id,text,created_at) values ($1,'cross-creator','post-01','fan-001','Invalid reference',now())",
      [otherCreatorId]
    ),
    /foreign key/
  )

  const otherSnapshot = await database.query<{ dataset: { posts: { title: string }[]; comments: unknown[] } }>(
    'select get_audience_dataset($1) as dataset',
    [otherCreatorId]
  )
  assert.equal(otherSnapshot.rows[0].dataset.posts.length, 1)
  assert.equal(otherSnapshot.rows[0].dataset.posts[0].title, 'Other title')
  assert.equal(otherSnapshot.rows[0].dataset.comments.length, 0)

  await database.exec('set role anon')
  await assert.rejects(database.query('select * from audience_comments'), /permission denied/)
  await assert.rejects(database.query('select get_audience_dataset($1)', [demoCreatorId]), /permission denied/)
  await database.exec('reset role; set role authenticated')
  await assert.rejects(database.query('select * from audience_posts'), /permission denied/)
  await database.exec('reset role')
  await database.exec("delete from app_users where fanvue_id='one'")
  assert.equal((await database.query('select * from audience_comments')).rows.length, 360)
  assert.equal((await database.query('select * from app_users')).rows.length, 1)
  await database.close()
})

// Removes only the retired analysis schedule and preserves saved results and unrelated schedules.
test('immediate analysis migration retires the worker without deleting saved analysis', async () => {
  const database = new PGlite()
  await database.exec('create role anon; create role authenticated; create role service_role;')
  await database.exec(await readFile(new URL('../supabase/migrations/001_initial.sql', import.meta.url), 'utf8'))
  await database.exec(`
    create schema cron;
    create table cron.job (jobid integer, jobname text);
    create function cron.unschedule(identifier integer) returns boolean language sql as $$
      with removed as (delete from cron.job where jobid = identifier returning *)
      select exists(select 1 from removed);
    $$;
    insert into cron.job values (1, 'creator-insights-analysis'), (2, 'unrelated-maintenance');
    insert into app_users(id, fanvue_id, username, display_name)
    values ('11111111-1111-4111-8111-111111111111', 'creator', 'creator', 'Creator');
    insert into analysis_jobs(user_id, cache_key, dataset_version, status, result)
    values ('11111111-1111-4111-8111-111111111111', 'saved', 'sample', 'complete', '{"insights": []}');
  `)

  const migration = await readFile(
    new URL('../supabase/migrations/20261030125942_immediate_analysis.sql', import.meta.url),
    'utf8'
  )
  await database.exec(migration)
  await database.exec(migration)
  assert.deepEqual((await database.query('select jobname from cron.job')).rows, [{ jobname: 'unrelated-maintenance' }])
  assert.equal((await database.query('select result from analysis_jobs')).rows.length, 1)
  assert.equal(
    (
      await database.query<{ worker: string | null }>(
        "select to_regprocedure('public.claim_analysis_job(uuid)') as worker"
      )
    ).rows[0].worker,
    null
  )

  await database.exec('drop schema cron cascade')
  await database.exec(migration)
  await database.close()
})
