# Icons

SVG icons live in `packages/design-system/src/icons/`. Each file becomes a React component (via `*.svg?react`) wrapped with `createIconWrapper` for size and semantic color props.

## Adding or updating an icon

1. Add or edit the `.svg` file in `packages/design-system/src/icons/` using **kebab-case** (e.g. `arrow-left.svg`).
2. **Open the SVG as source text**, not only the image preview. In VS Code: right‑click the file → **Open With…** → **Text Editor** (if the editor opens a preview by default).
3. Set **`fill="currentColor"` on the root `<svg>` element only** (open the file as text, not only the preview). When design specifies a **fixed path color** (e.g. `#0D0D0D`), keep that on the path — **do not** replace it with `currentColor`. If an editor or extension keeps rewriting path fills, use **`style="fill: #0D0D0D"`** on the path (no `fill` attribute) so the hex survives typical “normalize to currentColor” steps.
4. Run **`yarn icons`** from the design-system package (or repo root if that script delegates here) to regenerate `src/icons/index.ts`. Do not hand-edit `index.ts` — it is auto-generated.

The root `fill="currentColor"` ties the SVG to the CSS `color` value where needed; path fills stay as in the source asset (hex or `style`).
