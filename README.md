<!-- ------------------------------------------------------------
Introduces Creator Insights and explains local setup and essential checks.
--------------------------------------------------------------- -->

# ✳ Creator Insights

A Next.js app that turns sample comments into audience insights, with post-level themes and supporting evidence.

Creator Insights is independent of Fanvue. Sign-in uses real Fanvue OAuth and analysis uses OpenAI, but all posts, fans and comments are fictional. The app does not import your Fanvue content or access private messages.

[Live site](https://fanvue-creator-insights.vercel.app)

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The landing page works without credentials.

## Configure sign-in and analysis

1. Copy `.env.example` to `.env.local` and fill in its six server-only values. Generate `TOKEN_ENCRYPTION_KEY` with `openssl rand -hex 32` and keep it stable across deployments.
2. Apply all SQL files in `supabase/migrations/` in filename order, then run `supabase/seed.sql`. Historical migrations require Supabase Cron, `pg_net` and Vault; the final migration retires the analysis worker.
3. Register `http://localhost:3000/api/auth/callback` in your Fanvue app with scopes `openid offline_access offline read:self`.
4. Restart the development server and select **Start free**.

Use `localhost` consistently. For another origin or deployment, set `APP_URL` and register the matching callback URL. Keep credentials in server-side environment variables.

Analysis runs within the web request, with no separate worker. Keep the analysis page open until it finishes. Completed results are reused; clearing them requires an explicit new analysis. `OPENAI_MODEL` optionally overrides the default `gpt-4.1-mini`.

For an editorial design preview, open [/preview](http://localhost:3000/preview). It needs the seeded database and Supabase credentials, but no sign-in or OpenAI call. Preview routes are available only during development.

## Checks

```sh
npm run check:style
npm run typecheck
npm test
npm run build
```

Use `npm run format` to apply formatting fixes. Tests use stubs and in-memory Postgres, so live integrations need separate verification.

## Deploy

The app deploys through Vercel. Configure the same server-side environment variables plus `APP_URL`, apply all database migrations and seed data, and register the deployed Fanvue callback URL. Hosting must support the analysis route's five-minute maximum duration.

For a local production build, run `npm run build` followed by `npm start`.

## Further reading

- [Architecture](ARCHITECTURE.md)
- [AI evaluation](docs/AI-EVALUATION.md)
- [Code conventions](AGENTS.md)
- [Image credits](public/ASSETS.md)
