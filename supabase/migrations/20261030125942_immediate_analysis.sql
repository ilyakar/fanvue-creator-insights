-- Retires scheduled analysis while preserving saved results and direct-request locking.

do $$
begin
  -- Local databases without Cron still support the immediate request flow.
  if to_regclass('cron.job') is not null then
    perform cron.unschedule(jobid)
    from cron.job
    where jobname = 'creator-insights-analysis';
  end if;
end;
$$;

drop function if exists public.verify_analysis_worker_secret(text);
drop function if exists public.claim_analysis_job(uuid);
