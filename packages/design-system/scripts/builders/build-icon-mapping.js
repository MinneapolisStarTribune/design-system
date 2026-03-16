const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../../src/icons');

// Get all SVG files
const svgFiles = fs
  .readdirSync(iconsDir)
  .filter((file) => file.endsWith('.svg'))
  .sort();

const iconNames = svgFiles
  .map((file) => file.replace(/\.svg$/i, ''))
  .filter((name) => name.length > 0 && !name.includes('\n'));

// kebab-case to PascalCase + "Icon" (e.g. arrow-down -> ArrowDownIcon)
const toPascalIcon = (name) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('') + 'Icon';

// Generate icons barrel: each icon is wrapped with createIconWrapper so consumers
// can use size and semantic color props (e.g. <CameraIcon size="small" color="icon-on-dark-secondary" />).
const importCreateWrapper = "import { createIconWrapper } from '@/components/Icon/Icon';";
const rawImports = iconNames
  .map((name) => {
    const componentName = toPascalIcon(name);
    return `import ${componentName}Raw from './${name}.svg?react';`;
  })
  .join('\n');
const wrappedExports = iconNames
  .map((name) => {
    const componentName = toPascalIcon(name);
    return `export const ${componentName} = createIconWrapper(${componentName}Raw);`;
  })
  .join('\n');
const typeExports =
  "export type { IconWrapperProps, IconSize, IconColor } from '@/components/Icon/Icon.types';";

const iconsBarrelContent = `// This file is auto-generated.
// Do not edit manually - run 'npm run icons' to regenerate
// Import only the icons you need for optimal bundle size (tree-shakeable).

${importCreateWrapper}
${rawImports}

${wrappedExports}

${typeExports}
`;

fs.writeFileSync(path.join(iconsDir, 'index.ts'), iconsBarrelContent, 'utf8');
console.log(`Generated icons barrel with ${iconNames.length} icons at src/icons/index.ts`);

