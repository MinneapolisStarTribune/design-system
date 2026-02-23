# Troubleshooting

Common issues and solutions for using the design system.

## Web Issues

### CSS Variables Not Loading

**Symptoms:** Components appear unstyled or with default browser styles.

**Solutions:**

1. Verify the theme CSS file is imported before components render
2. Check the Network tab to ensure the CSS file loaded (look for `{brand}-{colorScheme}.css`)
3. Ensure the import path is correct: `@minneapolisstartribune/design-system/dist/themes/{brand}-{colorScheme}.css`
4. For dynamic loading, verify the link element is added to `<head>` before React renders

### Theme Not Applying

**Symptoms:** Components render but don't match the expected theme colors.

**Solutions:**

1. Verify `brand` prop matches the CSS file brand (`'startribune'` or `'varsity'`)
2. Verify `forceColorScheme` prop matches the CSS file (`'light'` or `'dark'`)
3. Check that `DesignSystemProvider` wraps all components that need theming
4. Inspect computed styles in DevTools to see if CSS variables are defined

### Component Styling Issues

**Symptoms:** Components render but styling looks wrong.

**Solutions:**

1. Ensure `DesignSystemProvider` is wrapping your components
2. Verify you're using the correct brand/theme combination
3. Check that Mantine peer dependencies are installed and compatible
4. Clear your build cache and rebuild: `rm -rf node_modules/.cache && yarn build` (or `npm run build`)

### Build/Bundler Configuration Issues

**Symptoms:** Import errors or CSS not being processed.

**Solutions:**

1. **Vite:** No special configuration needed - CSS imports work out of the box
2. **Webpack/CRA:** May need to configure CSS loader. Ensure CSS files in `node_modules` are processed
3. **TypeScript:** Ensure `@minneapolisstartribune/design-system` is in your `tsconfig.json` types
4. **Module resolution:** Verify your bundler can resolve packages from GitHub Packages registry

## Mobile Issues

### Component Import Errors

**Symptoms:** Cannot import components from `/native` entry point.

**Solutions:**

1. Verify you're importing from `@minneapolisstartribune/design-system/native`
2. Check that the package version supports React Native
3. Ensure React Native dependencies are installed
4. Clear Metro bundler cache: `npx react-native start --reset-cache`

### Font Loading Issues

**Symptoms:** Text renders but fonts don't appear correctly.

**Solutions:**

1. Verify fonts are bundled in your React Native app
2. Check that font names match what the library expects
3. Refer to React Native font loading documentation for your setup

## General Issues

### Authentication Issues

**Symptoms:** `npm install` or `yarn add` fails with 404 or authentication errors.

**Solutions:**

1. Verify your `.npmrc` or `.yarnrc` is configured correctly (see [Installation](../README.md#installation))
2. Check that your GitHub token has `read:packages` scope
3. Ensure the token hasn't expired
4. For CI/CD, verify the token is set as a secret/environment variable

## Still Having Issues?

- Check the [Storybook](https://design-system-8bmbp4q1g-startribune-team-one.vercel.app) for working examples
- Review component source code in the repository
- Open an issue on GitHub with details about your setup and error messages
