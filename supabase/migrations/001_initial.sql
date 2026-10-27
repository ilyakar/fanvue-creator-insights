-- Defines private accounts, encrypted connections, sessions and durable analysis runs.

create table public.app_users (
  id uuid primary key default gen_random_uuid(),
  fanvue_id text not null unique,
  username text not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.fanvue_connections (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scopes text not null default '',
  needs_reconnect boolean not null default false,
  refresh_lease text,
  refresh_lease_until timestamptz
);

create table public.app_sessions (
  token_hash text primary key,
  user_id uuid not null references public.app_users(id) on delete cascade,
  expires_at timestamptz not null
);

create index on public.app_sessions (user_id);

create table public.oauth_attempts (
  state_hash text primary key,
  verifier text not null,
  expires_at timestamptz not null
);

create table public.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  cache_key text not null,
  dataset_version text not null,
  status text not null default 'queued'
    check (status in ('queued', 'analysing', 'validating', 'complete', 'failed')),
  result jsonb,
  error text,
  attempts integer not null default 0,
  lease_token uuid,
  lease_until timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, cache_key)
);

create index on public.analysis_jobs (status, created_at);

-- Browser roles receive no policies; private records are accessed through the server.
alter table public.app_users enable row level security;
alter table public.fanvue_connections enable row level security;
alter table public.app_sessions enable row level security;
alter table public.oauth_attempts enable row level security;
alter table public.analysis_jobs enable row level security;

revoke all on
  public.app_users,
  public.fanvue_connections,
  public.app_sessions,
  public.oauth_attempts,
  public.analysis_jobs
from anon, authenticated;

grant all on
  public.app_users,
  public.fanvue_connections,
  public.app_sessions,
  public.oauth_attempts,
  public.analysis_jobs
to service_role;

-- Claims one analysis run and recovers abandoned leases without duplicating work.
create function public.claim_analysis_job(worker_lease uuid)
returns setof public.analysis_jobs
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- Stop recovering a repeatedly interrupted run once its attempt limit is reached.
  update public.analysis_jobs
  set
    status = 'failed',
    error = 'Analysis was interrupted. Please retry.',
    lease_token = null,
    lease_until = null
  where
    status in ('analysing', 'validating')
    and lease_until < now()
    and attempts >= 3;

  -- Lock one available run so another worker cannot claim it concurrently.
  return query
  update public.analysis_jobs
  set
    status = 'analysing',
    attempts = attempts + 1,
    lease_token = worker_lease,
    lease_until = now() + interval '10 minutes'
  where id = (
    select id
    from public.analysis_jobs
    where
      status = 'queued'
      or (
        status in ('analysing', 'validating')
        and lease_until < now()
        and attempts < 3
      )
    order by created_at
    for update skip locked
    limit 1
  )
  returning *;
end;
$$;

-- Claims refresh rights only when the account token is due for renewal.
create function public.claim_fanvue_refresh(
  account_identifier uuid,
  lease_identifier text
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  affected integer;

begin
  -- A live lease prevents two requests from spending the same refresh token.
  update public.fanvue_connections
  set
    refresh_lease = lease_identifier,
    refresh_lease_until = now() + interval '1 minute'
  where
    user_id = account_identifier
    and not needs_reconnect
    and expires_at < now() + interval '60 seconds'
    and (refresh_lease_until is null or refresh_lease_until < now());

  get diagnostics affected = row_count;

  return affected = 1;
end;
$$;

-- The same server-only access boundary applies to the operational functions.
revoke all on function public.claim_analysis_job(uuid) from public, anon, authenticated;
revoke all on function public.claim_fanvue_refresh(uuid, text) from public, anon, authenticated;

grant execute on function public.claim_analysis_job(uuid) to service_role;
grant execute on function public.claim_fanvue_refresh(uuid, text) to service_role;
