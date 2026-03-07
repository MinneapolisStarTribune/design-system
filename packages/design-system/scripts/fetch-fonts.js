/**
 * Fetch font woff2 files from tokens/fonts/{brand}.json into dist/fonts/assets/{brand}/.
 * After running this, rebuild tokens (yarn tokens) so font-face CSS uses local URLs and fonts load without CORS.
 *
 * Usage: node scripts/fetch-fonts.js
 * Or:    yarn fonts:fetch
 */

import fs from 'fs';
import path from 'path';

const TOKENS_DIR_PREFIX = 'tokens/fonts';
const ASSETS_DIR_PREFIX = 'dist/fonts/assets';

/** Browser-like headers so the font CDN allows the request (it often blocks Node/bot User-Agents) */
const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0',
  Accept: 'font/woff2,*/*',
  Referer: 'https://www.startribune.com/',
};

async function fetchFonts() {
  const brands = ['startribune', 'varsity'];
  const failedByPath = new Map();

  for (const brand of brands) {
    const tokensPath = path.join(process.cwd(), `${TOKENS_DIR_PREFIX}/${brand}.json`);
    if (!fs.existsSync(tokensPath)) {
      console.log(`⚠️  No tokens at ${tokensPath}, skipping ${brand}`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
    const fonts = data?.font?.brand?.[brand]?.fonts;
    if (!Array.isArray(fonts)) {
      console.log(`⚠️  No fonts array for ${brand}, skipping`);
      continue;
    }

    const assetsDir = path.join(process.cwd(), ASSETS_DIR_PREFIX, brand);
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    console.log(`\nFetching fonts for ${brand}...`);

    for (const font of fonts) {
      const baseUrl = (font.url || '').replace(/\/?$/, '/');

      for (const v of font.variants || []) {
        const file = v.file || '';
        if (!file) continue;

        const url = baseUrl + file;
        const outPath = path.join(assetsDir, file);

        if (fs.existsSync(outPath)) {
          console.log(`  (cached) ${file}`);
          continue;
        }

        try {
          const res = await fetch(url, {
            redirect: 'follow',
            headers: FETCH_HEADERS,
          });
          if (!res.ok) {
            console.warn(`  ⚠️  ${res.status} ${url}`);
            const match = url.match(/\/([^/]+)\/[^/]+\.woff2$/);
            const label = match ? match[1] : 'fonts';
            if (!failedByPath.has(label)) failedByPath.set(label, []);
            failedByPath.get(label).push(file);
            continue;
          }
          const buf = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(outPath, buf);
          console.log(`  ✓ ${file}`);
        } catch (err) {
          console.warn(`  ⚠️  Failed ${file}: ${err.message}`);
        }
      }
    }
  }

  console.log('\n✓ Font fetch done. Run "yarn tokens" to rebuild font-face CSS with local URLs.\n');

  if (failedByPath.size > 0) {
    console.log('Some URLs returned 403 (e.g. Nohemi). Options:');
    failedByPath.forEach((files, baseUrl) => {
      console.log(`  • ${baseUrl}... (${files.length} file(s))`);
    });
    console.log('  Try opening the URL in a browser; if it downloads, save to dist/fonts/assets/{brand}/');
    console.log('  with the same filename, then run "yarn tokens".\n');
  }
}

fetchFonts().catch((err) => {
  console.error(err);
  process.exit(1);
});
