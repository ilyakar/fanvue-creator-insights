-- Schedules recoverable analysis work using a private Vault secret.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Generate the scheduler credential inside Vault so it never appears in configuration files.
select vault.create_secret(
  replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  'creator_insights_worker_secret'
)
where not exists (select 1 from vault.secrets where name = 'creator_insights_worker_secret');

-- Only the trusted application server can check the scheduler's credential.
create function public.verify_analysis_worker_secret(supplied_secret text)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select coalesce((
    select decrypted_secret = supplied_secret
    from vault.decrypted_secrets
    where name = 'creator_insights_worker_secret'
    limit 1
  ), false);
$$;

revoke all on function public.verify_analysis_worker_secret(text) from public, anon, authenticated;
grant execute on function public.verify_analysis_worker_secret(text) to service_role;

-- Wake the worker only when a queued or abandoned job needs attention.
select cron.schedule(
  'creator-insights-analysis',
  '* * * * *',
  $schedule$
    select net.http_post(
      url := 'https://fanvue-creator-insights.vercel.app/api/internal/analysis-worker',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets where name = 'creator_insights_worker_secret' limit 1
        )
      ),
      body := '{}'::jsonb
    )
    where exists (
      select 1 from public.analysis_jobs
      where status = 'queued'
        or (status in ('analysing', 'validating') and lease_until < now())
    );
  $schedule$
);
