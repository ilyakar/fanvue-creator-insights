<!-- Records the implementation decisions and boundaries of the Creator Insights prototype. -->

# Architecture

## Application boundary

One Next.js App Router application uses TypeScript, React client components for interaction, server components for private reads, and route handlers for OAuth and mutations. SCSS follows the reference project's shared foundations and component hierarchy. `AGENTS.md` remains the source of code style rules.

## Identity and credentials

Fanvue is the sole sign-in provider. Authorization uses PKCE S256, a random browser-bound state and a ten-minute database OAuth attempt containing an encrypted verifier. The callback atomically consumes the attempt, exchanges the code with `client_secret_basic`, validates the documented unwrapped v1 profile and accepts creator accounts.

Accounts are keyed internally by a UUID and uniquely associated with their stable Fanvue UUID. Access and refresh tokens use AES-256-GCM with fresh nonces and a separately configured key. The browser receives only an opaque, HttpOnly, SameSite=Lax session cookie; production also sets Secure. Only its SHA-256 digest is stored in the database. Sessions expire after thirty days and logout invalidates them server-side.

Refresh-token rotation is serialized by a database lease. Each new pair is written together, guarded by the lease. An ambiguous refresh failure marks the connection for reconnection rather than blindly replaying a potentially consumed token. Disconnect removes local credentials, all sessions and analysis. Fanvue consent can separately be revoked in Fanvue settings; no undocumented revocation endpoint is assumed.

## Storage ownership

Supabase Postgres owns accounts, connections, sessions, OAuth attempts, creator-scoped audience records and durable analysis jobs/results. Every private query derives its owner from the server session, never from an arbitrary browser user ID. RLS is enabled and browser roles have no private table privileges. The server-only service role performs explicitly scoped operations.

Redux follows the reference structure but creates an isolated store per provider. It persists only the sidebar preference. Saved analysis, credentials and session identities never live in persisted Redux. Local component state owns dialogs and transient filters.

## Source data

`AudienceDataProvider` loads and validates creator-scoped records from Supabase. Each Fanvue account is mapped to the same demo creator by default, whose dataset contains 18 synthetic posts, 360 comments and 96 fans. Account sessions and analysis jobs remain individually owned. The JSON files are retained as seed and test fixtures, not runtime data. Future live data can use a different creator mapping and requires suitable verified Fanvue permissions/endpoints.

The source provider is stable for a given dataset version. The result stores comment identifiers, not invented quotations. The matching source dataset must remain available for every saved result. If a live provider is added, persist immutable snapshots before saving any results; this MVP's committed sample files provide that immutable source.

## Analysis contract

The server sends post context and comment identifiers/text to OpenAI Responses with a Zod-derived structured output schema, `store: false`, bounded output and request timeout. It excludes Fanvue credentials and fan identity details. Comments are untrusted source text, not instructions.

Each theme contains category, title, summary, optional opportunity, supporting comment IDs and evidence-scoped summaries for every referenced post. Runtime validation rejects unknown IDs and missing/unsupported post scope, and deduplicates repeated references. Application code counts original comments and distinct fan IDs. Structural validation cannot prove semantic correctness; the evaluation checklist covers that limitation.

## Durable processing and caching

A unique owner-scoped cache key hashes the entire dataset, configured model and prompt version. First authentication queues or reuses that run. Read-only dashboard requests do not create work. A failed run can be explicitly retried; cleared analysis stays cleared until the user starts again.

The separate Node worker claims one job atomically with `FOR UPDATE SKIP LOCKED`, records real stages, and renews its ten-minute lease. Browser polling reads saved state without simulated percentages. Results are committed only by the current lease holder. Interrupted runs can be recovered for up to three claims; exhausted jobs become a visible failure with retry. Completed results are reused until the input/configuration changes.

The worker is a required long-lived process in deployment. There is no in-memory job queue or fire-and-forget work after an HTTP response. An intentionally queued job remains queued if no worker is running.

## Visual review and unavailable integrations

The public landing page contains an explicitly illustrative snapshot. Development-only `/preview` routes reuse the full UI with editorial fixtures, all clearly identified as not AI output. Production rejects these routes with an HTTP 404 in the request proxy before rendering. The proxy also redirects requests with no session cookie before streaming; server route guards still validate every full database session. Preview actions cannot access account mutations without a real session.

If credentials are absent, Start free leads to an honest connection setup state. No fake connection, synthetic analysis progress or fallback model output is used.

## Operational limits

Real Fanvue OAuth, live OpenAI inference and hosted Supabase operation require configured credentials and a running worker. Automated checks use stubbed OAuth HTTP responses and in-memory Postgres. Expired OAuth-attempt records are cleaned when a new login starts; production should also schedule cleanup of expired app sessions and old operational records as retention needs are defined.
