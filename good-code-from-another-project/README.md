<!-- Explains the copied application source and its import conventions. -->

# Application source reference

The copied application code lives in `src/`, matching the active project's organization. These are source examples, not a standalone runnable application. Existing source files have only been relocated.

When adapting these examples, resolve `@/*` from `src/*`, `@styles/*` from `src/styles/*`, `@redux/*` from `src/redux/*`, and `@data/*` from `src/data/*`.

Use these files as structural and style references. The active application must not import runtime code from this directory.
