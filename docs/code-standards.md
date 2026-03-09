# Code Standards

This document serves as a living reference for code standards and conventions used in this design system. All contributors and AI assistants should follow these standards when working on this codebase.

## Table of Contents

- [TypeScript Standards](#typescript-standards)
- [React Component Patterns](#react-component-patterns)
- [File Naming Conventions](#file-naming-conventions)
- [Export Patterns](#export-patterns)
- [Brand Validation](#brand-validation)
- [Storybook Standards](#storybook-standards)
- [Testing Standards](#testing-standards)
- [Path Aliases](#path-aliases)
- [Documentation Requirements](#documentation-requirements)

---

## TypeScript Standards

### Type Safety

- **Avoid `any`**: Use `unknown` or proper types instead. ESLint warns on `any` usage
- **Prefer interfaces over types** for object shapes (unless you need unions, intersections, or computed types)
- **Component props**: Define as interfaces extending `HTMLAttributes` or other base types
- **Factory functions**: Use explicit return types (e.g., `React.FC<Props>`)
- **Union types**: Use const assertions for literal unions (e.g., `const COLORS = ['red', 'blue'] as const`)

### Example

```typescript
// ✅ Good
interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  color: ButtonColor;
  variant: ButtonVariant;
}

// ❌ Bad
type ButtonProps = {
  color: any;
  variant: string;
};
```

---

## React Component Patterns

### Component Structure

1. **Props Spreading**: Avoid spreading props `{...props}`; be verbose instead

---

## File Naming Conventions

### Files and Directories

- **Components**: PascalCase for component files (e.g., `Button.tsx`, `NewsHeading.tsx`)
- **Types**: `ButtonTypes.ts` or `types/index.ts` in component directories
- **Native component files**: use `ComponentName.native.tsx` inside `native/` directories
- **Native test files**: use `ComponentName.native.test.tsx` and `ComponentName.native.a11y.test.tsx`
- **Native stories**: use `ComponentName.native.stories.tsx`
- **Hooks**: camelCase with `use` prefix (e.g., `useBrandValidation.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Directories**: PascalCase for component directories (e.g., `Button/`, `Typography/`)
- **Index files**: Use `index.ts` for re-exports

### File Structure Example

```
ComponentName/
  ComponentName.types.ts                    # shared props (used by both web & native)
  web/
    ComponentName.tsx                        # web component implementation
    ComponentName.stories.tsx                # web storybook story
    ComponentName.test.tsx                   # web unit test (Vitest)
    ComponentName.a11y.test.tsx              # web a11y test (Vitest)
  native/
    ComponentName.native.tsx                 # native component implementation
    ComponentName.native.stories.tsx         # native storybook story
    ComponentName.native.test.tsx            # native unit test (Jest + RNTL)
    ComponentName.native.a11y.test.tsx       # native a11y test (Jest + RNTL)
```

---

## Export Patterns

### Component Exports

1. **Component directory**: Export component and types from `index.ts`. This should be used sparingly; too many `index.ts`'s in a file is a slog to try to sift through.
2. **Components barrel**: Export from `src/components/index.ts`
3. **Main entry**: Export from `src/index.ts` (public API)

### Export Pattern

All component exports follow a consistent pattern:

```typescript
export { Component, type ComponentProps } from './path';
```

This means each component is exported alongside its main Props type. Nested types (like `ButtonColor`, `NewsHeadingImportance`, etc.) are not exported separately, as they can be accessed via TypeScript indexed access types:

```typescript
// Consumers can access nested types using indexed access
type ButtonColor = ButtonProps['color'];
type NewsHeadingImportance = NewsHeadingProps['importance'];
```

### Export Example

```typescript
// src/components/index.ts
export { Button, type ButtonProps } from './Button/Button';
export { Icon, type IconProps } from './Icon/Icon';
export { NewsHeading, type NewsHeadingProps } from './Typography/Editorial/NewsHeading/NewsHeading';

// src/index.ts
export * from './components';
export { DesignSystemProvider, type Brand } from './providers/DesignSystemProvider';
```

---

## Brand Validation

### Component Registration

- **All components must be registered** in `src/types/component-names.ts`

---

## Storybook Standards

### Story File Naming

- **Story files**: Co-locate with components as `ComponentName.stories.tsx`
- **File location**: Place in the same directory as the component

### Story Structure

Every story file must have exactly **2 stories**:

1. **"Configurable"** (first story): Named "Configurable" or "Configurable{ComponentName}". Exposes all component props as interactive controls for UX designers, PMs, and engineers to experiment with all options.
2. **"All variants"** (second story): Named "AllVariants". Renders all prop combinations/variants in one view for visual regression testing with Chromatic.

### Configurable Story Requirements

- **Must be the first story**: Appears at the top of the story list
- **All props controllable**: Every prop should have a control in the Storybook Controls panel
- **Sensible defaults**: Provide default values that showcase the component well

### All Variants Story Requirements

- **Must be the second story**: Used for Chromatic visual regression snapshots
- **Complete coverage**: Renders every variant/combination of component props
- **No interactive controls needed**: Static render of all variants for consistent snapshots

### Story Example

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { UtilityLabel } from './UtilityLabel';
import { UtilityLabelSize, UtilityLabelWeight } from '../../types/globalTypes';

const meta = {
  title: 'Foundations/Typography/Utility/UtilityLabel',
  component: UtilityLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'] as UtilityLabelSize[],
      description: 'The size of the label',
    },
    weight: {
      control: 'select',
      options: ['regular', 'semibold'] as UtilityLabelWeight[],
      description: 'The font weight of the label',
    },
    capitalize: {
      control: 'boolean',
      description: 'Whether to apply uppercase transformation',
    },
  },
} satisfies Meta<typeof UtilityLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ✅ First story - fully configurable for UX/PM/Engineers
export const Configurable: Story = {
  args: {
    size: 'medium',
    weight: 'regular',
    capitalize: false,
    children: 'Utility Label',
  },
};

// ✅ Second story - all variants for Chromatic regression testing
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Render all size/weight/capitalize combinations */}
    </div>
  ),
};
```

---

## Native Component Patterns

### Themed Styles with `useNativeStyles`

Native components that need theme-aware styles should use the `useNativeStyles` hook.  
For typography components, use `createNativeTypographyStylesWithDefaults` so default text color is applied automatically.

```tsx
import React from 'react';
import { Text } from 'react-native';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import { createNativeTypographyStylesWithDefaults } from '@/styles/nativeTypography';

export const MyComponent: React.FC<MyComponentProps> = ({ variant, children }) => {
  const styles = useNativeStyles(createStyles);
  return <Text style={styles[variant]}>{children}</Text>;
};

const createStyles = (theme) =>
  createNativeTypographyStylesWithDefaults(theme, {
    primary: { ...theme.typographyArticleQuoteSmall },
    secondary: { ...theme.typographyArticleQuoteLarge },
  });
```

This pattern:

- **Encapsulates memoisation** so styles are only recalculated if theme tokens change
- **Applies default typography color automatically** (`colorTextOnLightPrimary`) across variants
- **Keeps `StyleSheet.create` centralized** in a shared helper instead of repeating it in each component
- **Infers the theme type** from the hook so token names are autocompleted and typo-checked

> For direct access to `brand`, `colorScheme`, or individual tokens outside of a stylesheet, use `useNativeTokens` instead.
---

## Testing Standards

### Test Runner Split

- **Web tests** run with **Vitest** (`@testing-library/react`, `jsdom`)
- **Native component tests** run with **Jest + @testing-library/react-native**
- Vitest excludes `*.native.test.tsx` and `*.native.a11y.test.tsx` files
- Jest matches native test files by the `*.native.*` naming convention

### Native Token Imports in Tests

When testing hooks/components that depend on native tokens, use the real generated modules
from `@mobile/themes/*` and `@mobile/typography/*` instead of mocking token files.

```typescript
// ✅ Good - assert against generated token modules
import { nativeTokenFixtures } from '@/test-utils/nativeTokenFixtures';
```

Avoid inline `vi.mock()` token stubs for native token modules in test files.


### Test Wrappers

When tests need a `DesignSystemContext`, use the shared wrapper from `src/test-utils/wrappers.tsx` instead of inlining `<DesignSystemContext.Provider>`:

- **`TestWrapperInDesignSystemProvider({ brand?, colorScheme? })`** — returns a wrapper component that provides `DesignSystemContext`. Defaults to `'startribune'` / `'light'`.

```typescript
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';

// With defaults (startribune, light)
renderHook(() => useMyHook(), {
  wrapper: TestWrapperInDesignSystemProvider(),
});

// With overrides — only specify what you need
render(<MyComponent />, {
  wrapper: TestWrapperInDesignSystemProvider({ brand: 'varsity', colorScheme: 'dark' }),
});
```

```typescript
// ❌ Bad - inline provider in tests
render(
  <DesignSystemContext.Provider value={{ brand: 'startribune', colorScheme: 'light' }}>
    <MyComponent />
  </DesignSystemContext.Provider>
);

// ✅ Good - shared test wrapper
render(<MyComponent />, {
  wrapper: TestWrapperInDesignSystemProvider(),
});
```

---

## Path Aliases

### Import Paths

- **Use `@/*` alias**: Maps to `src/*`. Do not use relative import.

### Import Examples

```typescript
// ✅ Good - using path alias
import type { ComponentName } from '@/types/component-names';

// ❌ Bad - relative imports (unless in same directory)
import { useBrandValidation } from '../../../hooks/useBrandValidation';
```

---

## Documentation Requirements

###

Every time you work in this repo, do not forget to update documentation! You MUST update:

- `README.md` — audience: consuming app developers
- `integration-guides/web.md` — audience: web consumers
- `integration-guides/native.md` — audience: React Native consumers

## Using This Document with AI Assistants

Reference `@docs/code-standards.md` in Cursor prompts or `.cursorrules`. AI tools should also reference `integration-guides/native.md` and `integration-guides/web.md` for platform-specific patterns.

---

This is a **living document** — update it when standards change.
