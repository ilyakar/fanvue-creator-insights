/* ------------------------------------------------------------
This file lists the agent instructions and code style guidelines.
---------------------------------------------------------------*/

# AGENTS.md

## Agent & Code Style Guidelines

These rules define how code is written and maintained in this repository.
They apply to both human contributors and AI agents.
The goal is clarity, consistency, and long-term readability.

---

## 0. File Header Comment 🧾

### Every file must start with a brief explanation

Each file must include a short explanatory comment at the very top describing what the file is and what it does.

This applies to

- TS, TSX, JS files
- Components
- Hooks
- Utilities
- Configuration files where applicable

### Required format

Use a multi-line comment with clear separators.

Example

```ts
/* ------------------------------------------------------------
This is the datepicker with range component for selecting date ranges.
---------------------------------------------------------------*/
```

Rules

- The comment must be the first thing in the file
- One short sentence is enough
- Describe purpose, not implementation details

---

### Special rule for 'use client'

If a file uses the 'use client' directive, it must appear as the very first line in the file.

In this case, the file-level header comment must be placed after a single blank line following 'use client'.

Correct order

```ts
'use client'

/* ------------------------------------------------------------
This is the datepicker with range component for selecting date ranges.
---------------------------------------------------------------*/
```

Incorrect order

```ts
/* ------------------------------------------------------------
This is the datepicker with range component for selecting date ranges.
---------------------------------------------------------------*/

'use client'
```

Rules

- 'use client' must always be the first statement in the file
- No comments, imports, or whitespace may appear before it
- There must be exactly one blank line between 'use client' and the file header comment
- The file header comment must come directly after that blank line when present

---

## 1. Naming Conventions 🏷️

### 1.1 User-interaction handlers use a leading underscore

Only functions that are directly triggered by user interaction must use camelCase with a leading underscore.

Examples

- \_handleSubmit
- \_onClick
- \_onChange
- \_onKeyDown
- \_handleSearchSubmit
- \_handleModalClose

This applies to

- click handlers (for example `_onClick`, `_handleClick`)
- input/change handlers (for example `_onChange`, `_handleInputChange`)
- submit/search handlers triggered by the user (for example `_handleSubmit`, `_handleSearchSubmit`)
- keyboard handlers triggered by user input (for example `_onKeyDown`)

This does not apply to

- functions not triggered directly by a user action
- data-fetching helpers (for example `fetchLatestVehicles`)
- value formatters or getters (for example `getVehicleDisplayName`)
- pure utility/helper functions that are not event handlers
- lifecycle or system callbacks that are not direct user interactions

Rule of thumb: if the function runs because the user directly did something (click, type, submit, search), use an underscore; otherwise, do not use one.

---

### 1.2 Variables and functions must be fully spelled out

Do not use abbreviated or single-letter names.

Avoid

- t, b, h, k
- x, y
- tmp, val, obj
- data, res

Exception

- `t` is allowed when it is the translation function (i18n), e.g. `t('home.title')`.
- `tHome`, `tContact`, or similar `t*` names are allowed when they are translation functions scoped to a namespace, e.g. `tHome('searchPlaceholder')`.

Prefer

- searchQuery
- selectedVehicleId
- isFetchingResults
- reservationStartDate
- formattedPriceAed

Readability is always preferred over brevity.

This rule applies to

- local variables
- function names
- parameters
- derived values

---

### 1.3 Component naming

React components must use PascalCase, following standard React conventions.
Component file names must also use PascalCase to match the component.

Exception

Framework-reserved file names, such as Next.js `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts`, must retain their required names. Components declared inside those files still use PascalCase.

Examples

- SearchBar
- FeaturedCollection
- VehicleCard
- BookingSummary

---

### 1.4 Component folder naming

Folders that contain components must use PascalCase (capital first letter, camel case). This applies to reusable component folders; framework route directories follow routing conventions instead.

Examples

- SideMenu
- CarListingCarousel
- FeaturedCollection

---

### 1.5 Default exports for single components

When a file exports a single component, it must use a default export so it can be imported without braces.

Example

```ts
// Correct
const SideMenu = () => {
  ...
}

// Correct import
import SideMenu from './SideMenu'

export default SideMenu
```

---

### 1.6 Prefer ES6 arrow functions

Prefer ES6 arrow function expressions over `function` declarations whenever possible.

Use

```ts
const fetchVehicles = async () => {
  ...
}
```

Avoid

```ts
async function fetchVehicles() {
  ...
}
```

Exception

When a framework requires a named function export or specific signature, follow the framework requirement.

---

## 2. Function Comments 📝

Every function must include a short comment describing what it does.

Rules

- Place the comment immediately above the function
- One sentence is usually enough
- Describe intent, not implementation details
- Always include a blank line before a function-level comment

Correct

```ts
doSomething()

// Handles Enter key presses to submit the search.
const _handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  ...
}
```

Incorrect

```ts
doSomething()
// Handles Enter key presses to submit the search.
const _handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  ...
}
```

This spacing rule applies to

- event handlers
- utility functions
- helpers
- hooks and hook helpers

---

## 2.4 Add Inline Comments For Clarity

Use short inline comments inside functions to clarify intent when the code is not immediately obvious.

Examples of good inline comments

- explaining why a guard clause exists
- describing a non-obvious state transition
- calling out a subtle condition or assumption
- indicating why a side effect happens (not just that it happens)

Avoid

- narrating obvious code (e.g. `// Set value`)
- repeating the function-level comment

Aim for a few well-placed inline comments in any non-trivial function.

---

## 2.1 Conditional Comments

When adding comments for conditional branches, place them immediately before the branch keyword and never inside the previous branch block.

Rules

- Put the comment directly above the `if` line
- For `else if` or `else`, place the comment between the closing brace of the previous block and the `else` keyword
- Do not place branch comments inside the block they describe or inside the previous branch block

---

### 2.1.1 Always use braces for control flow

Use curly braces for every `if`, `else if`, and `else` body, including one-line guards, `return`, `throw`, `redirect()`, and `notFound()` calls. Apply the same rule to `for`, `for...of`, `for...in`, `while`, and `do...while` loops.

Each branch body must appear on its own indented lines. Never compress a condition and its action onto one line.

Avoid

```ts
const account = await getCurrentAccount()
if (!account) throw new RequestError('Please reconnect to continue.', 401)
const database = getDatabase()
```

Preferred

```ts
const account = await getCurrentAccount()

// Stop before accessing private records when the session has expired.
if (!account) {
  throw new RequestError('Please reconnect to continue.', 401)
}

const database = getDatabase()
```

### 2.1.2 Separate control flow and logical steps

- Leave a blank line before and after standalone conditionals, loops, and `try` blocks when another statement surrounds them in the same block.
- Leave a blank line before `return`, `throw`, `break`, and `continue` when another statement precedes them in the same block.
- Keep an `else` or `else if` connected to its matching `if`; do not insert unrelated statements between branches. When a branch needs a comment, use the placement described in section 2.1.
- Separate preparation, validation, external calls, state changes, and the final response into readable groups. Related declarations may stay together; do not put a blank line after every variable automatically.
- Leave a blank line between a multiline declaration and the next logical step, and between separate interface or type declarations.
- Extract a named value when a long inline predicate hides what a condition means.
- Explain non-obvious intent with a short comment above the relevant step or branch. Avoid comments that merely repeat an obvious statement.
- Formatting tools are a baseline. Review the control flow and declaration groups manually before considering a file finished.

These rules apply equally to `.ts`, `.tsx`, `.js`, `.mjs`, configuration files, scripts, tests, and callbacks inside React components. Framework-generated files are excluded.

Run `npm run check:style` after changes. This uses standard ESLint and Prettier commands. `npm run format` runs Prettier followed by ESLint fixes for imports and JSX sibling spacing. `npm run lint` and `npm run format:check` check each tool separately; `npm run lint:fix` applies ESLint fixes. Review the result for meaningful grouping and comments.

The root `eslint.config.mjs` defines the shared ESLint rules for this application. JSX spacing uses `eslint-plugin-react` and its `react/jsx-newline` rule. `.prettierrc.json` defines formatting options for this SCSS-based application. Keep this setup simple: do not add project-specific lint rules or reintroduce a custom style checker. Braces, control flow spacing, logical groups and comments remain code review requirements from this document and the existing application code.

---

## 2.2 Grouped Declarations and Whitespace

When declaring variables, hooks, and derived values, separate different categories with a blank line for readability.

Examples of categories

- routing/navigation hooks
- state hooks
- derived values or memoized values
- data fetching hooks
- refs and constants

This keeps related items visually grouped and makes scanning easier.

---

## 2.3 Avoid nested ternaries for multi-branch assignments

Never use nested ternaries to assign a value across multiple branches. It is hard to scan and easy to misread.

Instead, declare the variable first and use an explicit `if/else if/else` chain with a brief comment before each branch.

Avoid

```ts
const matchedSearchPath = matchedCategoryKey
  ? `/cars/category:${matchedCategoryKey}`
  : matchedBrandKey
    ? `/cars/brand:${matchedBrandKey}`
    : matchedBodyTypeKey
      ? `/cars/body-type:${matchedBodyTypeKey}`
      : null
```

Preferred

```ts
let matchedSearchPath = null

// Use category match when present.
if (matchedCategoryKey) {
  matchedSearchPath = `/cars/category:${matchedCategoryKey}`
}

// Use brand match when category is missing.
else if (matchedBrandKey) {
  matchedSearchPath = `/cars/brand:${matchedBrandKey}`
}

// Use body type match when both category and brand are missing.
else if (matchedBodyTypeKey) {
  matchedSearchPath = `/cars/body-type:${matchedBodyTypeKey}`
}
```

---

## 3. TSX Layout and Spacing ✨

### 3.1 Blank lines between sibling JSX elements

Use blank lines between sibling JSX elements only when at least one of the adjacent siblings is multi-line (for example, it has children or its props span multiple lines). When both adjacent siblings are single-line, do not insert a blank line.

Preferred (multi-line sibling gets a blank line)

```tsx
return (
  <div>
    <button type="button" onClick={_onClick}>
      Search
    </button>

    <div className="results">...</div>
  </div>
)
```

Preferred (single-line siblings stay adjacent)

```tsx
return (
  <div>
    <SummaryCard />
    <div className="spacer--sm" />
    <ResultsList />
  </div>
)
```

---

### 3.2 Grouping rule

If multiple elements belong together conceptually, wrap them in a parent container and keep spacing consistent within that group.

---

### 3.2.1 Keep page content and loading states DRY

- Define page headings, descriptions, and static controls once in JSX, shared by the ready page and any navigation fallback.
- Place Suspense boundaries around data-dependent sections so static page content can render immediately.
- Use reusable skeleton components for pending data. Skeleton components must not duplicate page copy or maintain a route-to-text configuration object.
- Share the same model promise across sections that need the same data rather than fetching it separately for each section.

---

### 3.3 Nested elements must be nested in SCSS

When an element is nested inside a parent in the markup, its styles must be nested under the parent selector in SCSS so the structure matches one-to-one.

Example

```tsx
<div className="details">
  <div className="text">
    <div className="name">...</div>

    <div className="meta">...</div>
  </div>

  <Image className="brand-logo" ... />
</div>
```

```scss
.details {
  ...

  .text {
    ...

    .name {
      ...
    }

    .meta {
      ...
    }
  }

  .brand-logo {
    ...
  }
}
```

---

### 3.4 Prefer concise SCSS class names for nested elements

When styles are nested under a parent selector, keep child class names short and avoid repeating the parent name.

Do not repeat the parent class name in nested child class names.

Example of good code:

```scss
.delivery-and-pickup-map {
  .popup {
    .content {
      .text {
        ...
      }
    }
  }
}
```

Example of bad code:

```scss
.delivery-and-pickup-map {
  .delivery-and-pickup-map-popup {
    .delivery-and-pickup-map-popup-content {
      .delivery-and-pickup-map-popup-content-text {
        ...
      }
    }
  }
}
```

---

### 3.5 Place responsive rules inside the selector they modify

When adding responsive overrides, use the shared SCSS responsive mixins and place the include inside the selector it affects instead of grouping overrides at the end of the file.

Example

```scss
.general-search {
  display: flex;

  @include max-width(tablet) {
    flex-wrap: wrap;
  }

  .search-field {
    flex: 1;

    @include max-width(tablet) {
      flex: 1 1 100%;
    }
  }
}
```

---

### 3.6 Use the shared SCSS foundation

Write all application styling in `.scss` files. Follow the organization and import patterns in `src/styles/`, and reuse shared variables, functions, mixins, and foundational styles instead of duplicating them in page or component files.

---

### 3.7 Margin direction preference

Prefer adding vertical spacing with `margin-bottom` (margin down) rather than `margin-top` (margin up) so stacks maintain predictable flow and future tweaks only adjust spacing after elements.

---

### 3.8 Spacing and sizing must be a multiple of five pixels

For custom SCSS spacing and sizing values, use multiples of 5px (for example 5px, 10px, 15px, 20px) unless explicitly stated otherwise.

Avoid values like 4px or 8px for these properties.

Exceptions

- Borders, font sizes, and responsive breakpoints do not need to be multiples of 5px.
- In very rare cases, 0.5 spacing (2.5px) is allowed when explicitly requested and visually necessary.

---

### 3.9 Prefer short-circuit conditionals for optional strings

When conditionally appending strings (like class names), prefer short-circuit `&&` over ternaries that return empty strings. Collect the values in an array, remove falsy entries, and join them so `false` is never rendered as a class name.

Avoid

```tsx
className={`filter-button ${isFilterApplied && 'is-active'}`}
```

Preferred

```tsx
className={['filter-button', isFilterApplied && 'is-active'].filter(Boolean).join(' ')}
```

---

### 3.10 Typography and visible copy

- Use locally hosted Inter throughout the landing page and application, including headings, body text, inputs, buttons, navigation, comments and product previews.
- Regular interface text must be at least 14px. The default body size is 16px.
- Use the 12px fine print variant sparingly for secondary supporting notes, such as reassurance below a button, preview captions, privacy notes, count explanations and footer details. No visible text may be smaller than 12px.
- Keep main content, navigation, controls, labels, badges, regular metadata, errors and action guidance at least 14px, including mobile layouts and illustrative product previews. Never scale text down to make a layout fit.
- Use the shared SCSS typography tokens, including `$font-size-fine-print` for the 12px variant. Adjust wrapping, spacing and responsive layouts when larger type needs more room.
- Do not use em dashes or en dashes as sentence punctuation in authored visible copy. Use commas, full stops or parentheses instead. Preserve grammatical hyphens in compound words and modifiers, such as "catch-up", "in-between moments", "check-ins" and "day-in-the-life videos". Use words such as "to" for date ranges. Technical identifiers, file paths and URLs retain their required spelling.
- Ask the AI model to follow the same punctuation convention in titles, summaries and suggestions. Preserve actual fan comments as original evidence.

---

### 3.11 Product identity

- The application is named Creator Insights and is independent of Fanvue.
- Display "Creator Insights" as one complete wordmark, with equal styling for both words. Place the solid purple asterisk before the name, never between the words. Keep the full name on mobile; only a collapsed navigation rail may show the mark alone, with the full accessible name. Reuse the shared Brand component in headers, footers and product previews.
- Refer to Fanvue when describing the platform connection, authentication, accounts or source content. Do not use Fanvue as the application's brand name.

---

## 4. Example, Putting Everything Together ✅

```tsx
'use client'

/* ------------------------------------------------------------
This is the search bar component used to filter available vehicles.
---------------------------------------------------------------*/

// Renders the search bar and handles user interactions.
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFetchingResults, setIsFetchingResults] = useState(false)

  // Updates the search query when the user types.
  const _onChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  // Submits the search request and updates loading state.
  const _handleSubmitSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsFetchingResults(true)

    try {
      await fetchSearchResults(searchQuery)
    } finally {
      setIsFetchingResults(false)
    }
  }

  return (
    <form onSubmit={_handleSubmitSearch}>
      <input value={searchQuery} onChange={_onChangeSearchQuery} placeholder="Search cars" />

      <button type="submit" disabled={isFetchingResults}>
        {isFetchingResults ? 'Loading…' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar
```

---

## 5. Agent Instructions 🤖

When making changes, agents must

- add a file-level header comment at the top of every file
- ensure 'use client' is the very first line when present
- place the file header comment after a single blank line following 'use client'
- use a leading underscore only for functions directly triggered by user interaction (click, type, submit, search)
- keep camelCase naming for variables and functions
- prefer ES6 arrow function expressions over `function` declarations
- fully spell out all names, no abbreviations
- add a brief comment above every function
- when a file defines a primary page/component plus helpers, place the primary page/component first and keep helper components below it
- always include a blank line before function-level comments
- use braces and multiline bodies for every conditional branch and loop, including early returns, throws, redirects, and not-found guards
- separate control flow, validation, external calls, state changes, and return values with blank lines and meaningful logical groups
- run `npm run check:style` and manually review readability after formatting
- use PascalCase for reusable component folders; follow framework conventions for route directories and reserved file names
- default-export files that contain a single component so imports do not use braces
- maintain blank lines between sibling TSX elements
- write all application styling in SCSS and follow the structure in `src/styles/`
- reuse shared SCSS variables, functions, mixins, and foundational styles instead of duplicating them
- use custom SCSS spacing and sizing values that are multiples of 5px; borders, font sizes, and responsive breakpoints are exempt
- prefer short-circuit `&&` for conditional strings instead of ternaries with empty strings
- for conditional class names, use an array with `&&`, filter falsy entries, and join with spaces, e.g. `className={['filter-button', isFilterApplied && 'is-active'].filter(Boolean).join(' ')}`
- prefer promise-based error handling (`.then/.catch`) over `try/catch` when possible
- prefer default styling when possible; avoid adding explicit colors or extra styling if the defaults already match the desired appearance
- use Inter and shared typography tokens, with a 14px minimum for regular text and a sparse 12px fine print variant for secondary supporting notes and footer details
- avoid em dashes and en dashes as sentence punctuation; preserve grammatical hyphens in compound words and modifiers
- avoid the Font Awesome icon `size` prop; use shared SCSS styling when icon sizing needs adjustment
- use Font Awesome icons throughout; if a different icon system is in use on a page you are editing (such as Lucide React), replace it with the closest Font Awesome icon without adding a `size` prop
- preserve existing patterns and formatting in the repository
- before making architectural or structural decisions, inspect the closest equivalent in the active `src/` code and follow its established approach unless the user explicitly requests a different pattern

Agents should prefer clarity and explicitness over clever or compact code.

---

## 6. Project Architecture and Code Examples 🧭

Application source belongs in `src/`: routes and components in `src/app/`, shared logic in `src/lib/`, styles in `src/styles/`, fixtures in `src/mock-data/`, and request guards in `src/proxy.ts`. Import aliases resolve from `src/`. Keep `public/`, configuration and environment files, documentation, tests, tooling scripts, and Supabase setup at the repository root.

Before creating or reorganizing code, inspect the closest relevant implementation in this project. Use `ARCHITECTURE.md` for ownership and data flow, and these files for concrete examples:

- App shell and providers: `src/app/layout.tsx`, `src/app/Providers.tsx`, `src/app/AlertProvider.tsx`, and `src/app/Components/AppShell/AppShell.tsx`.
- Routes and streaming: `src/app/dashboard/posts/page.tsx` starts one shared model promise and places Suspense boundaries around dependent sections. `src/app/dashboard/posts/PostsView.tsx` defines static headings and controls once, with explicit slots for streamed content.
- Component boundaries: `src/app/dashboard/settings/SettingsView.tsx` owns page composition, while `src/app/Components/AccountAction/AccountAction.tsx` owns interactive account actions and confirmations. Reusable audience rendering lives in `src/app/Components/AudienceInsights/AudienceInsights.tsx`.
- API routes and security: `src/app/api/account/route.ts` checks origin and session before mutations. `src/lib/server/session.ts`, `src/lib/server/http.ts`, and `src/lib/server/config.ts` centralize identity, request errors, and server configuration.
- Shared logic and services: `src/lib/posts.ts` contains pure post helpers; `src/lib/data/audience.ts` reads audience snapshots; `src/lib/server/saved-analysis.ts` reads saved analysis; `src/lib/server/run-analysis.ts` owns analysis execution. Keep model generation and evidence validation in `src/lib/analysis/`.
- State: use local React state for component interactions and focused context providers for shared UI state. Follow `src/app/Components/PostsBrowser/PostsFilterProvider.tsx` for transient filters and `src/app/Components/Theme/ThemeProvider.tsx` for browser-persisted theme preferences. Durable account and analysis records belong on the server. Do not introduce Redux or another state library without a clear requirement.
- Styling: `src/styles/coreStyling/index.scss` loads foundations and component styles. Reuse tokens and responsive mixins from `src/styles/stylingImports/`. Follow `src/styles/components/settings.scss` for nested selectors and responsive rules, and `src/styles/homePage.scss` for page styling.
- Tests: `tests/posts.test.ts` demonstrates pure helper checks, `tests/streaming.test.ts` checks streamed composition, and `tests/run-analysis.test.ts` checks request orchestration. Add meaningful tests for changed behavior, using the closest existing test as a guide.

Keep responsibilities explicit: routes orchestrate, server helpers own credentials and persistence, pure helpers transform values, and interactive components own user actions. Keep private reads on the server, derive ownership from the authenticated session, and validate external input at its boundary. Never expose server credentials in client components.

Preserve the lifetime of shared state and reuse resolved values or promises instead of fetching the same model separately for sibling sections. Keep static page copy outside data-dependent loading boundaries and use shared skeletons for pending content.

These examples guide structure, not feature-specific business logic. Direct user instructions and the explicit rules in this file take precedence over existing code. Keep changes local and incremental, preserve focused component boundaries, and avoid new abstractions or competing styling systems without a concrete need. If multiple patterns fit and the choice materially changes the architecture, ask for clarification.

---

End of file.
