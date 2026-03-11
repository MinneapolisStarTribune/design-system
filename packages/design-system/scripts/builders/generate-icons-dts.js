const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../../src/icons');
const outFile = path.join(__dirname, '../../dist/web/icons/index.d.ts');

const svgFiles = fs
  .readdirSync(iconsDir)
  .filter((file) => file.endsWith('.svg'))
  .sort();

const iconNames = svgFiles
  .map((file) => file.replace(/\.svg$/i, ''))
  .filter((name) => name.length > 0);

const toPascalIcon = (name) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('') + 'Icon';

const lines = [
  "// Auto-generated. Do not edit manually.",
  "import type { FC, SVGProps } from 'react';",
  "",
  ...iconNames.map((name) => `export const ${toPascalIcon(name)}: FC<SVGProps<SVGSVGElement>>;`),
];

fs.writeFileSync(outFile, lines.join('\n') + '\n', 'utf8');
console.log(`Generated ${outFile} with ${iconNames.length} icon declarations`);

