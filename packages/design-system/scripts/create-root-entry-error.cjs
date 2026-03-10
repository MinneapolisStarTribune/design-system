const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'dist', 'web');
const filePath = path.join(outDir, 'root-entry-error.cjs.js');

fs.mkdirSync(outDir, { recursive: true });

const message =
  "@minneapolisstartribune/design-system: Import from '@minneapolisstartribune/design-system/web' " +
  "or '@minneapolisstartribune/design-system/native' instead of the package root.";

const contents = `"use strict";

throw new Error(${JSON.stringify(message)});
`;

fs.writeFileSync(filePath, contents);