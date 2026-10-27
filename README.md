<!-- Describes how to run, configure and review the Creator Insights prototype. -->

# ✳ Creator Insights

A responsive creator app that turns sample Fanvue comments into evidence-backed audience insights.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

- Landing page: http://127.0.0.1:3000
- **Local design preview:** http://127.0.0.1:3000/preview

The development preview is intentionally labelled **illustrative insights**. Its editorial themes are not model output, it creates no account, and it cannot mutate private data. All `/preview` routes are unavailable in production. There is no public Explore demo flow.

## Enable the real connection and AI analysis

1. Copy `.env.example` to `.env.local` and fill its server-side variables.
2. Create a Supabase project and apply `supabase/migrations/001_initial.sql` in its SQL editor.
3. Register your Fanvue app's exact callback URL: `http://127.0.0.1:3000/api/auth/callback` (or the chosen deployed origin). Enable `openid offline_access offline read:self`. The app reads the creator profile only; audience content is synthetic.
4. Set `FANVUE_CLIENT_ID`, `FANVUE_CLIENT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `OPENAI_API_KEY` locally. Never place credentials in chat or client-exposed environment variables.
5. Generate a separate encryption key with `openssl rand -hex 32` and use it as `TOKEN_ENCRYPTION_KEY`. Keep it stable and separate from the database; losing it makes existing encrypted connections unreadable.
6. Set `APP_URL` to the actual origin. `127.0.0.1` and `localhost` are different OAuth origins; use the same one throughout.
7. Restart the web server, then run the durable worker in a second terminal:

```sh
npm run worker
```

Now **Start free** uses real Fanvue OAuth. First sign-in queues the sample dataset for real OpenAI inference. The worker persists validated results independently of the browser. Returning users reuse the same run. Clearing analysis does not start another paid analysis until the creator chooses **Prepare my insights**.

`OPENAI_MODEL` defaults to `gpt-4.1-mini` and can be changed to an available model supporting Responses structured outputs. Model availability depends on the API account. No live model invocation or real OAuth consent has been performed without credentials.

## Verification

```sh
npm run check:style
npm run typecheck
npm test
npm run build
```

`npm run check:style` runs ESLint and Prettier checks. `npm run format` runs Prettier followed by ESLint fixes; manually review logical groups and comments afterwards. Use `npm run lint`, `npm run lint:fix` and `npm run format:check` to run the tools separately. The reference directory and generated files are excluded.

The root `eslint.config.mjs` uses OneRent's shared TypeScript, React, import and Prettier rules without additional project-specific rules. `react/jsx-newline` controls JSX sibling spacing. Readability conventions such as braces and control flow spacing are documented in `AGENTS.md` and reviewed manually. The Prettier options match OneRent, excluding its Tailwind plugin because this project uses SCSS. TypeScript is pinned to 6.0.3, which the ESLint parser supports. There is no custom style checking script.

Tests cover dataset integrity, distinct fan counts, post-scoped evidence, invalid model references, cache isolation, authenticated encryption, OAuth request shape, CSRF checks, and the SQL migration, worker claims, job recovery, refresh locking, database privileges and cascaded deletion. Database tests run real Postgres in memory through PGlite; no production database is contacted.

## Production operation

```sh
npm run build
npm start
# Run this separately as a long-lived process:
npm run worker
```

Deploy the web process and worker to a Node-compatible platform, using the same Supabase project and environment. Set `APP_URL` to an HTTPS origin and register its callback in Fanvue. The worker needs a process host, not an unawaited serverless task. Multiple workers are supported through database job leases. This repository does not create hosting accounts, configure remote credentials or publish the application.

Apply the migration before connecting an account. All private tables have RLS enabled and no browser policies; requests go through the authenticated backend using a server-only service role. Any future browser-side Supabase access requires deliberately designed policies.

## Source map

- `app/`: routes, providers and reusable `Components/`
- `styles/`: shared SCSS tokens, mixins, foundations and component styles
- `redux/`: an isolated store persisting only the sidebar preference
- `mock-data/`: source posts, comments, fans and separate editorial preview fixtures
- `lib/data/`: replaceable provider and dataset validation
- `lib/analysis/`: model inference, schema and evidence validation
- `lib/server/`: database, OAuth, encrypted credentials and sessions
- `scripts/analysis-worker.ts`: durable background processing
- `supabase/migrations/`: versioned database foundation
- `tests/`: meaningful data, security and database checks

See `ARCHITECTURE.md` for ownership, job lifecycle and integration decisions, and `docs/AI-EVALUATION.md` for semantic evaluation before accepting live results.

## Design and source references

The interface follows the supplied Brex-inspired composition and Stripe-inspired palette, adapted to a creator product. Typography is Inter, hosted locally. Regular interface text is at least 14px, with a sparse 12px fine print variant for secondary supporting notes and footer details. Sample post photography is from Unsplash; source URLs are listed in `public/ASSETS.md`. All creator, fan and comment records are fictional.

The copied `good-code-from-another-project/` directory is reference material only and remains unchanged.
