/**
 * Ensures Button is wired to the correct platform implementations and that
 * the web barrel never references the React Native entry.
 *
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsDir = path.join(__dirname, '..');

describe('Button platform exports', () => {
  it('web components barrel imports only the web Button implementation', () => {
    const indexWeb = fs.readFileSync(path.join(componentsDir, 'index.web.ts'), 'utf8');
    expect(indexWeb).toMatch(/from ['"]@\/components\/Button\/web\/Button['"]/);
    expect(indexWeb).not.toMatch(/Button\.native/);
    expect(indexWeb).not.toMatch(/Button\/native\//);
  });

  it('native components barrel imports the native Button implementation', () => {
    const indexNative = fs.readFileSync(path.join(componentsDir, 'index.native.ts'), 'utf8');
    expect(indexNative).toMatch(/from ['"]\.\/Button\/native\/Button\.native['"]/);
  });
});
