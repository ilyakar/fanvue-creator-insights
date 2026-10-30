<!-- Records the implementation decisions and boundaries of the Creator Insights prototype. -->

# Architecture

## Application boundary

One Next.js App Router application uses TypeScript, React client components for interaction, server components for private reads, and route handlers for OAuth and mutations. SCSS follows the reference project's shared foundations and component hierarchy. `AGENTS.md` remains the source of code style rules.

Application source lives under `src/`, including `src/app/`, `src/lib/`, `src/styles/`, `src/mock-data/`, and `src/proxy.ts`. Aliases such as `@/lib` resolve from `src/`. Public assets, configuration and environment files, documentation, tooling scripts, tests, and Supabase setup remain at the repository root. Copied reference source uses `good-code-from-another-project/src/`.

## Reading a screen

Routes orchestrate account lookup, audience reads, saved-analysis prerequisites and rendering. They do not contain SQL, OAuth mechanics or analysis creation. Request-scoped React caching shares the signed-in account between the dashboard layout and route sections; it does not persist identity between requests.

- `src/app/dashboard/page.tsx` starts one audience feedback promise and streams the date range and saved insights independently. Its `DashboardInsights` section reads the matching saved run and redirects to `/analysis` when incomplete. `FeaturedRequest.tsx` owns the overview-only recommendation and evidence interaction.
- `src/app/dashboard/posts/page.tsx` loads audience feedback without requiring completed analysis, then prepares one shared posts promise. `PostsBrowser` and `PostsCount` consume that promise directly at their separate Suspense positions. `src/lib/posts.ts` owns source comment counts, search, format filtering and ordering. Cards receive posts with comment counts; the count receives only posts.
- `src/app/dashboard/posts/[postId]/page.tsx` validates post existence before applying the saved-analysis redirect. Adjacent `PostContext.tsx` owns the heading, image, caption and sample-link interaction. The route passes an explicit `scopedPostId` to shared insights.
- `src/app/dashboard/settings/page.tsx` streams the server connection check through `src/lib/server/connection-status.ts`. `SettingsView.tsx` owns static settings copy and panels. `AccountAction` owns each typed action, confirmation, request state and focus restoration. Its dialog uses a portal to avoid inheriting compact action-row styles.

Small route-adjacent `DashboardView`, `PostsView`, `PostView` and `SettingsView` compositions share static copy and navigation with `loading.tsx` and local preview routes. They accept explicit pending or ready JSX slots, never optional data promises that implicitly select loading mode. Data-dependent sections remain inside Suspense so headings and controls can render first.

`AudienceInsights` shares metrics, category filtering, cards and the evidence drawer across overview and post screens. It receives audience feedback, saved analysis and optional explicit post scope, with no account or redirect concerns. `useFocusTrap` supports both first-control focus for account confirmations and panel-first focus for the evidence drawer.

`PostsFilterProvider` intentionally stays in the persistent `AppShell`. Its transient search and format state survives streamed results, post-detail navigation and visits to other dashboard screens, then resets when the shell unmounts. Moving it to a posts-only layout would change that behavior.

## Analysis code ownership

`src/lib/server/saved-analysis.ts` only reads saved jobs, accepting already-resolved audience feedback. `src/lib/server/run-analysis.ts` calls OpenAI immediately inside the analysis POST request and saves its outcome. `src/lib/analysis/service.ts` generates AI output; `validation.ts` validates evidence and post scope; `cache.ts` hashes ownership, full source content, AI model and prompt version.

## Style ownership

`src/styles/coreStyling/` loads shared foundations and component styles. Settings and confirmations, messages, onboarding/progress, information pages, alerts and empty/error states have recognizable stylesheets under `src/styles/components/`. `homePage.scss` owns marketing sections and imports `components/productPreview.scss` for the illustrative snapshot. Responsive rules stay with the selectors they modify where possible, preserving existing selectors, specificity and typography.

## Alignment with the copied reference

The closest reference examples are `src/app/home/page.tsx` for visible page composition, `src/app/Components/MyFutureSelfCard.tsx` for focused component props, `src/app/AlertProvider.tsx` for shared notices, and `src/styles/components/myFutureSelfCard.scss` for nested styles with local responsive rules, all inside `good-code-from-another-project/`.

The active application follows that source grouping, component composition, promise-based request handling and SCSS foundation. Explicit `AGENTS.md` rules take precedence over older reference examples, including arrow functions, descriptive names, underscore-prefixed interaction handlers, headers, comments, braces and whitespace.

Two deliberate adaptations remain: authenticated reads run on the server, and small route-adjacent views share copy with streamed loading states. These boundaries support the current app's privacy and loading requirements without adding generic loaders or another state-management layer.

## Identity and credentials

Fanvue is the sole sign-in provider. Authorization uses PKCE S256, a random browser-bound state and a ten-minute database OAuth attempt containing an encrypted verifier. The callback atomically consumes the attempt, exchanges the code with `client_secret_basic`, validates the documented unwrapped v1 profile and accepts creator accounts.

Accounts are keyed internally by a UUID and uniquely associated with their stable Fanvue UUID. Access and refresh tokens use AES-256-GCM with fresh nonces and a separately configured key. The browser receives only an opaque, HttpOnly, SameSite=Lax session cookie; production also sets Secure. Only its SHA-256 digest is stored in the database. Sessions expire after thirty days and logout invalidates them server-side.

Refresh-token rotation is serialized by a database lease. Each new pair is written together, guarded by the lease. An ambiguous refresh failure marks the connection for reconnection rather than blindly replaying a potentially consumed token. Disconnect removes local credentials, all sessions and analysis. Fanvue consent can separately be revoked in Fanvue settings; no undocumented revocation endpoint is assumed.

## Storage ownership

Supabase Postgres owns accounts, connections, sessions, OAuth attempts, creator-scoped audience records and durable analysis jobs/results. Every private query derives its owner from the server session, never from an arbitrary browser user ID. RLS is enabled and browser roles have no private table privileges. The server-only service role performs explicitly scoped operations.

Local component state owns dialogs and transient filters. Shared providers supply theme and alert context without persisting application state.

## Source data

`getAudienceFeedback(creatorId)` in `src/lib/data/audience.ts` reads one atomic creator snapshot from Supabase. `src/lib/data/validation.ts` owns its schema and relationship checks. Each Fanvue account is mapped to the same demo creator by default, whose dataset contains 18 synthetic posts, 360 comments and 96 fans. Account sessions and analysis jobs remain individually owned. The JSON files are retained as seed and test fixtures, not runtime data. Future live data can use a different creator mapping and requires suitable verified Fanvue permissions/endpoints.

Audience snapshots are stable for a given dataset version. The result stores comment identifiers, not invented quotations. The matching source dataset must remain available for every saved result. If a live provider is added, persist immutable snapshots before saving any results; this MVP's committed sample files provide that immutable source.

## Analysis contract

The server gives each post an isolated OpenAI Responses request containing only its title, caption, format and original comment identifiers, pseudonymous fan IDs and text. Up to four requests run concurrently, and every post result is validated against that post alone. A specific useful comment can support a post theme without a recurrence quota. Generic reactions and unsupported requests are excluded. Neither stage has a fixed theme count.

The overview groups each feedback category separately, using only validated post themes with the same specific meaning. A schema-required assignment for each source theme prevents duplicate or missing source membership. Its output references post-theme IDs. Application code derives overview comment evidence and source links from those IDs, rejecting invented references, category changes and reuse across groups. Themes omitted from grouping remain standalone, so synthesis cannot silently discard post feedback. Distinct fan and comment counts come from original records.

Results store independent `postThemes` alongside overview `insights`. Post detail pages select their own themes, including their own titles, rather than filtering overview themes. Overview drawers link to contributing post themes and original comments. Older editorial preview records retain their explicitly illustrative rendering through a compatibility fallback. The prompt version separates new results from the old global-first cache.

Both model stages use Zod-derived structured output, `store: false`, bounded output and request timeouts. Post and comment text remain untrusted evidence. Runtime checks enforce references and scope but cannot prove semantic accuracy; `docs/AI-EVALUATION.md` describes that review.

## Immediate processing and caching

A unique owner-scoped cache key hashes the entire dataset, configured model and prompt version. Authentication redirects to the analysis page with an explicit start flag. The page starts an authenticated POST immediately; the route awaits OpenAI inference and persistence before responding. Read-only dashboard requests do not create work. Failed or interrupted requests can be retried, and cleared analysis stays cleared until the user starts again.

There is no background worker or scheduled analysis. Progress polling reads the matching saved run. A six-minute request token, longer than the route's five-minute execution limit, prevents simultaneous requests from duplicating inference. Writes compare that token, and expired requests become retryable. Completed results are reused until the input/configuration changes. The latest migration disables the old Cron schedule while preserving existing saved results and historical schema.

## Visual review and unavailable integrations

The public landing page contains an explicitly illustrative snapshot. Development-only `/preview` routes reuse the full UI with editorial fixtures, all clearly identified as not AI output. Production rejects these routes with an HTTP 404 in the request proxy before rendering. The proxy also redirects requests with no session cookie before streaming; server route guards still validate every full database session. Preview actions cannot access account mutations without a real session.

If credentials are absent, Start free leads to an honest connection setup state. No fake connection, synthetic analysis progress or fallback model output is used.

## Operational limits

Real Fanvue OAuth and live OpenAI inference require configured credentials and an active analysis request. Automated checks use stubbed OAuth HTTP responses and in-memory Postgres. Expired OAuth-attempt records are cleaned when a new login starts; production should also schedule cleanup of expired app sessions and old operational records as retention needs are defined.
