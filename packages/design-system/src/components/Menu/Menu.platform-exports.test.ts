/**
 * Menu is web-only for now: ensures the web barrel exports it and the native barrel does not.
 *
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(__dirname, '..');

describe('Menu platform exports', () => {
  it('web components barrel imports only the web Menu implementation', () => {
    const indexWeb = fs.readFileSync(path.join(componentsDir, 'index.web.ts'), 'utf8');
    expect(indexWeb).toMatch(/from ['"]\.\/Menu\/web\/Menu['"]/);
    expect(indexWeb).not.toMatch(/Menu\/native\//);
  });

  it('native components barrel does not export Menu', () => {
    const indexNative = fs.readFileSync(path.join(componentsDir, 'index.native.ts'), 'utf8');
    expect(indexNative).not.toMatch(/\.\/Menu\//);
  });
});
