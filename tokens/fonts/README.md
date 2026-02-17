# Font tokens

Defines brand fonts (Publico, Barlow, Graphik, Popular, Nohemi, etc.) in `tokens/fonts/{brand}.json`. The build uses these to generate `@font-face` CSS in `dist/fonts/font-face/{brand}.css`.

## Font-family matching (all fonts)

For any font to render, the **@font-face name** and the **first token of the font-family in CSS** must match.

- **@font-face** uses the single name (e.g. `'Popular'`, `'Nohemi'`, `'Graphik'`) — the build derives this from `tokens/text.json` so it matches usage.
- **Usage** (utility/editorial CSS) uses the full stack (e.g. `Popular, sans-serif`). The browser matches the first token to the @font-face name.
- In each font entry, keep `name` and the first token of `family` in sync.

**Example (Popular):**

| Where            | Value                               |
| ---------------- | ----------------------------------- |
| Token `name`     | `"Popular"`                         |
| Token `family`   | `"Popular, sans-serif"`             |
| Built @font-face | `font-family: 'Popular';`           |
| Usage in CSS     | `font-family: Popular, sans-serif;` |

The first token of the stack (`Popular`) matches the @font-face name → font renders.

## If fonts don’t load (403 / CORS)

The built CSS points at `https://fonts.startribune.com/...` for woff2 files. If those URLs return **403** or are blocked (e.g. CORS), use local files:

1. Put woff2 files in **`dist/fonts/assets/{brand}/`** (same filenames as in the tokens).
2. Run **`yarn tokens`** so the font-face build uses local URLs for any file that exists there.
3. Optional: **`yarn fonts:fetch`** tries to fetch from the CDN; if you get 403 for some paths, add those files manually (e.g. from design team).
