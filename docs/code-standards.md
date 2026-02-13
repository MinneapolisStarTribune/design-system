# Code Standards

This document serves as a living reference for code standards and conventions used in this design system. All contributors and AI assistants should follow these standards when working on this codebase.

## Table of Contents

- [TypeScript Standards](#typescript-standards)
- [React Component Patterns](#react-component-patterns)
- [File Naming Conventions](#file-naming-conventions)
- [Export Patterns](#export-patterns)
- [Brand Validation](#brand-validation)
- [Storybook Standards](#storybook-standards)
- [Documentation Requirements](#documentation-requirements)
- [Path Aliases](#path-aliases)

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

2. **Display Names**: Always set `displayName` on components for better React DevTools experience
3. **Props Spreading**: Avoid spreading props `{...props}`; be verbose instead

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

### Export Example

```typescript
// src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonColor } from './types';

// src/components/index.ts
export * from './Button';
export * from './Icon';

// src/index.ts
export * from './components';
export { DesignSystemProvider, type Brand } from './providers/MantineProvider';
```

---

## Brand Validation

### Component Registration

- **All components must be registered** in `src/types/component-names.ts`

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

## Storybook Standards

### Story File Naming

- **Story files**: Co-locate with components as `ComponentName.stories.tsx`
- **File location**: Place in the same directory as the component

### Story Structure

1. **First Story Must Be "Configurable"**: The first exported story in every story file must be named "Configurable" (or "Configurable{ComponentName}") and must expose all component props as interactive controls
2. **Purpose**: The Configurable story serves as an interactive playground for UX designers, PMs, and other engineers to experiment with all component options
3. **Full Control Exposure**: All component props should be exposed via `argTypes` with appropriate controls (select, boolean, text, etc.)

### Configurable Story Requirements

- **Must be the first story**: Appears at the top of the story list
- **All props controllable**: Every prop should have a control in the Storybook Controls panel
- **Sensible defaults**: Provide default values that showcase the component well

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

// Additional stories can follow for specific use cases
export const AllSizes: Story = {
  // ... other stories
};
```

---

## How to Use This Document with AI Assistants

### For Cursor and Other AI Tools

To ensure AI assistants follow these standards, include this instruction in your prompts or AI configuration:

```
Please follow the code standards documented in docs/code-standards.md when making changes to this codebase.
Key requirements:
- Use TypeScript strict mode patterns
- Follow React component patterns (factory functions, displayName, brand validation)
- Use path aliases (@/*) for imports
- Format code according to Prettier config
- Follow file naming conventions
- Register new components in component-names.ts
- Include JSDoc comments for public APIs
- Create Storybook stories with "Configurable" as the first story (fully interactive for UX/PM/Engineers)
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

**Last Updated**: 2/12/2025 by Mary M
