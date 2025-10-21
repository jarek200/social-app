# Tooling Audit Report

## Overview
During an automated quality pass (`pnpm run check`) the workspace surfaced multiple blocking issues: formatting checks aborted because Prettier is missing, Vitest exited early without discovering tests, and Biome lint generated dozens of noisy warnings for `.astro` frontmatter imports. The sections below summarise each problem, root cause, and the actions required to restore a healthy CI signal.

## Detected Issues
- `nx format:check` fails immediately with `Cannot find module 'prettier'` because neither the root `package.json` nor any nested workspace package declares Prettier.
- `pnpm run test` (Vitest) reports "No test files found" even though `apps/web/src/components/__tests__/FeedIsland.test.tsx` exists. The `feedStore` is initialised with an empty array, so the test's `beforeEach` destructuring crashes silently and Vitest bails without loading any specs.
- `pnpm run lint` triggers 50+ Biome warnings for "unused imports" inside Astro frontmatter blocks (e.g. `apps/web/src/pages/analytics.astro`). Those imports are required for template usage but Biome lacks Astro awareness, leading to consistent false positives.

## Recommended Remediations
- Add `prettier` as a root `devDependency` (e.g. `^3.3.3`) and, if desired, a minimal `.prettierrc` forwarding to Biome defaults. This satisfies Nx format tooling without impacting existing formatting flows.
- Patch `apps/web/src/components/__tests__/FeedIsland.test.tsx` to provide deterministic fixture data instead of relying on the empty `feedStore`. A simple helper like `seedFeedStore()` that injects a post record allows Vitest to collect and execute the spec. While updating tests, consider adding a dedicated `test.include` glob for `src/components/__tests__/**/*.test.tsx` so Discovery stays resilient.
- Extend `biome.json` with a file-specific rule override, disabling `noUnusedImports` for `**/*.astro` (or upgrade to Biome 2.3+ once Astro support lands). This removes the false positives while keeping the rule active for `.ts(x)` files.

## Next Steps
1. Implement the dependency/config updates above and re-run `pnpm run check` to confirm all stages pass locally.
2. Land a regression test for the feed fixture helper to prevent future accidental empty-store regressions.
3. Monitor the next Biome release notes; re-enable the rule for Astro files once native support is available.
