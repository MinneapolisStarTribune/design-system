---
name: code-review
description: Verification procedures for reviewing design-system pull requests — confirming web/native parity across files the diff did not touch, resolving a hardcoded colour or spacing literal to the design token that already exists, checking a changeset bump against the real public-API delta, and checking public API changes against the docs that must move with them. Use when reviewing any pull request that changes packages/design-system.
---

# design-system review procedures

`.github/copilot-instructions.md` holds the rules for this repository. This file
holds the four checks that a diff alone cannot settle — each one needs a file the
pull request did not change. Run a procedure only when the diff trips its trigger,
and skip the rest.

Everything referenced here is committed, so it resolves in the review checkout with
no build step. Do not run `yarn build`, `yarn tokens`, `yarn lint`, or the test
suites; CI reports all of those on the same pull request.

Some files named below are on the "skip entirely" list in
`.github/copilot-instructions.md` — `src/types/native-theme.generated.ts` above all.
That list governs what you comment on, not what you read. Open them freely as
reference; never leave a comment on one.

## Where things are

| What | Path (under the repository root) |
| --- | --- |
| Component source | `packages/design-system/src/components/<Name>/{web,native}/` |
| Shared prop types | `packages/design-system/src/components/<Name>/<Name>.types.ts` |
| Component barrels | `packages/design-system/src/components/index.web.ts`, `index.native.ts` |
| Public entry points | `packages/design-system/src/index.web.ts`, `index.native.ts` |
| Published subpaths | `exports` map in `packages/design-system/package.json` |
| Token source | `packages/design-system/tokens/**/*.json` |
| Native theme keys | `packages/design-system/src/types/native-theme.generated.ts` |
| Consumer docs | `README.md`, `integration-guides/{web,native,architecture}.md` |

Many components are nested — `components/EditorialContent/ArticleToolkit/<Name>/`,
`components/Typography/Editorial/<Name>/` — so search for the component name rather
than assuming a top-level directory.

## 1. Confirm cross-platform parity

Trigger: the diff changes a file under a component's `web/` or `native/` directory.

1. List the component directory. If only one of `web/` and `native/` exists, stop —
   there is no parity question.
2. Open `<Name>.types.ts`. A prop or default on the shared interface
   (`<Name>BaseProps`, or `<Name>Props` where native reuses it through
   `NativeTextStylingProps` / `NativeViewStylingProps` / `NativeImageStylingProps`)
   belongs to both platforms. A prop on an explicit `<Name>NativeProps`, or one that
   comes from `HTMLAttributes`, is platform-only — changing it on one side is correct.
3. For a shared change, open the counterpart implementation and its styles
   (`web/<Name>.module.scss`, `native/<Name>.styles.ts`) and compare the specific
   value: the default, the size, the variant list, the accessibility wiring.
4. Check both barrels. A new export must appear in `components/index.web.ts` *and*
   `components/index.native.ts` unless the component is genuinely one-platform.
5. Comment only when you can name the counterpart file and quote the two diverging
   values. A pull request that states the omission is deliberate closes the question.

## 2. Resolve a literal to the token that already exists

Trigger: a hex or `rgba()` colour, or a bare pixel number, appears in a
`*.module.scss` or in a native `StyleSheet.create` block.

Never comment "use a token" on its own. Either name the token or say nothing.

1. Search `packages/design-system/tokens/primitives/` for the literal. Colours live
   in `primitives/color.json`, spacing in `primitives/spacing.json` (keyed by its own
   pixel value, so `16` is `spacing.16`).
2. A primitive is not the answer for a colour. Take its dotted path — say
   `color.neutral.100` — and search `tokens/color/` and `tokens/semantic/` for the
   alias `{color.neutral.100}`. The semantic name that aliases it is what the review
   comment should recommend.
3. Confirm that name resolves for both brands before recommending it: it must appear
   in `brand-startribune-light.json` and `brand-varsity-light.json` (and the `-dark`
   pair when the style has a dark-mode branch). A name present for only one brand is
   not a safe suggestion.
4. Translate the dotted path to the platform in the diff:
   - **Web** — hyphen-join the path and prefix `--`.
     `color.border.on-light.subtle-01` → `var(--color-border-on-light-subtle-01)`.
   - **Native** — lower camel-case the path, digits kept as written.
     `color.background.dark-gray-01` → `theme.colorBackgroundDarkGray01`. Verify the
     key exists in `src/types/native-theme.generated.ts` before quoting it.
5. If no token matches the literal, do not comment. A genuinely new value is a token
   request for the design team, not a review finding.

## 3. Check the changeset bump against the API delta

Trigger: the diff changes `packages/design-system/src/` and includes a
`.changeset/*.md`. (A missing changeset is already a CI failure — do not report it.)

1. Read the bump declared in the changeset's frontmatter.
2. Look at what the diff does to the public surface: `src/index.web.ts`,
   `src/index.native.ts`, the two component barrels, the exported interfaces in
   `<Name>.types.ts`, and the `exports` map in `packages/design-system/package.json`.
3. Judge against `docs/release-runbook.md`: a new export, component, or optional prop
   is **minor**; a removed or renamed export, a removed prop, a narrowed type, or an
   optional prop made required is **major**; a change with no public surface delta is
   **patch**.
4. Comment only when the declared bump is lower than the delta requires, and name the
   export or prop that forces the higher bump. A bump that is higher than necessary is
   the author's call.

## 4. Check the docs that move with the public API

Trigger: the diff changes `src/index.web.ts`, `src/index.native.ts`, either component
barrel, or the `exports` map.

1. `docs/code-standards.md` requires a new export or prop to reach `README.md` plus
   the matching `integration-guides/web.md`, `integration-guides/native.md`, or
   `integration-guides/architecture.md`. Open the ones the change touches and confirm
   the new name is there.
2. Run the check in reverse for prose the diff adds: any import path or subpath a doc
   names must exist in the `exports` map. The map publishes `./web`, `./web/*`,
   `./web/components.css`, `./web/fonts/font-face/*`, and `./native` — a documented
   entry point outside that set does not resolve for consumers.

## Staying in scope

- These procedures produce evidence for rules that already exist. Do not restate a
  rule from `.github/copilot-instructions.md` as a separate comment.
- Every comment from this skill cites the file you opened to reach it. A finding you
  could not confirm against a real file is not a finding.
- Nothing here overrides `docs/`. Where a documented standard and a procedure above
  disagree, the document wins and the procedure is wrong.
