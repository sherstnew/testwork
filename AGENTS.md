# AGENTS.md

## Project Stack

- Runtime/package manager: Bun.
- Framework: Next.js 15 with App Router.
- Language: TypeScript with `strict` enabled.
- UI styling: Tailwind CSS utilities in TSX. Do not add SCSS/CSS modules for new UI.
- Data layer: Mongoose models in `src/lib/models.ts`, connection helpers in `src/lib/mongoose.ts`.
- Metrics: `prom-client` and `src/app/api/metrics/route.ts`.

## Commands

- Install dependencies: `bun install`
- Development server: `bun run dev`
- Production build: `bun run build`
- Lint: `bun run lint`

Use Bun commands for dependency and script work. Do not reintroduce `package-lock.json`.

## Structure

- App routes live in `src/app`.
- API routes live in `src/app/api`.
- Shared DB and infra code lives in `src/lib`.
- Shared fetch/client helpers live in `src/lib/utils`, grouped by scope:
  - `exams.ts` for exam loading helpers.
  - `tests.ts` for session/test lifecycle helpers.
  - `results.ts` for result loading helpers.
  - `rating.ts` for rating aggregation helpers.
- Domain types live in `src/types`.

## Coding Rules

- Prefer `@/` imports for project files.
- Keep route components focused on UI and page-level state. Move reusable data logic into `src/lib/utils`.
- Preserve Russian UI copy unless the task explicitly asks for localization changes.
- Keep Tailwind classes equivalent to existing visual styles when refactoring. Use arbitrary values when exact legacy values matter, for example `w-[80%]`, `max-[600px]:text-xl`, or `bg-[#43be54]`.
- Avoid adding new dependencies unless they clearly reduce implementation risk or complexity.
- Do not mutate unrelated files or generated build output.

## Tailwind Notes

- Tailwind is configured in `tailwind.config.ts`.
- `preflight` is disabled to avoid changing the current global reset and layout behavior.
- Global CSS lives in `src/app/globals.css` and contains Tailwind directives plus the project reset/body styles.

## Verification

After meaningful changes, run:

1. `bun run lint`
2. `bun run build`

If a check cannot run because of missing environment variables or external services, report the exact blocker.
