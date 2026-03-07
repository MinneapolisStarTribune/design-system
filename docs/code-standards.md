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
- **Hooks**: camelCase with `use` prefix (e.g., `useBrandValidation.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Directories**: PascalCase for component directories (e.g., `Button/`, `Typography/`)
- **Index files**: Use `index.ts` for re-exports

### File Structure Example

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
      ButtonTypes.ts
      index.ts
    Typography/
      Editorial/
        createEditorialHeading.tsx
        EditorialTypes.ts
        index.ts
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

## Testing Standards

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

- README.md - The audience is consuming repositories and their developers.
- docs/web - The audience is consuming repositories in web environments
- docs/native - The audience is consuming repositories in react native environments
-

## How to Use This Document with AI Assistants

### For Cursor and Other AI Tools

To ensure AI assistants follow these standards, include this instruction in your prompts or AI configuration:

```
Please follow the code standards documented in docs/code-standards.md when making changes to this codebase.
Key requirements:
- Use TypeScript strict mode patterns
- Follow React component patterns (factory functions, brand validation)
- Use path aliases (@/*) for imports
- Format code according to Prettier config
- Follow file naming conventions
- Register new components in component-names.ts
- Include JSDoc comments for public APIs
- Create Storybook stories with exactly 2 stories: "Configurable" (first, fully interactive for UX/PM/Engineers) and "AllVariants" (second, for Chromatic regression testing)
- Update documentation
```

### Cursor-Specific Instructions

You can also reference this file directly in Cursor:

1. **In chat prompts**: Mention `@docs/code-standards.md` to include it in context
2. **In rules**: Add a reference to this file in your `.cursorrules` file (if you use one)
3. **In comments**: Reference specific sections when asking for code changes

### Example Prompt

```
@docs/code-standards.md Please ________ following our code standards.
Make sure to:
- Register it in component-names.ts
- Use brand validation
- Include proper TypeScript types
```

---

## Keeping This Document Updated

This is a **living document**. When standards change:

1. Update this file immediately
2. Update related code to match new standards
3. Communicate changes to the team
4. Update AI assistant instructions if needed
