
# Testing Guide

This document defines how to test in design-systems (SUS). It is the single source of truth for testing conventions, patterns, and expectations. Both engineers and AI agents should follow it when writing or modifying tests.

This repo's conventions align with the [Engineering Testing Strategy](https://minneapolisstartribune.atlassian.net/wiki/spaces/PD/pages/3478355969/Engineering+Testing+Strategy+Principles+Practices+and+Expectations+for+Quality+Ownership) which defines our org-wide principles and expectations for quality ownership.

## Table of Contents

- [Quick Reference](#quick-reference)
- [Frameworks](#frameworks)
- [What to Test](#what-to-test)
- [Test Types and When to Use Each](#test-types-and-when-to-use-each)
- [File Locations and Naming](#file-locations-and-naming)
- [Selectors](#selectors)
- [Writing a New Test: Decision Tree](#writing-a-new-test-decision-tree)
- [CI Integration](#ci-integration)
- [Common Patterns](#common-patterns)

## Quick Reference

| What                           | Tool       | Command                      |
| ------------------------------ | ---------- | ---------------------------- |
| Run all test(Web + Native)     | Vitest + Jest    | `yarn test`            |
| Run Web Tests Only             | Vitest           | `yarn test:web`        |
| Run Native Tests Only          | Jest             | `yarn test:native`     |
| Run accessibility tests        | Vitest + Jest    | `yarn test:a11y`       |
| Run tests with coverage        | Vitest           | `yarn test:coverage`   |
| Run tests in watch mode        | Vitest           | `yarn test:watch`      |
| Lint                           | ESLint           | `yarn lint`            |
| Format                         | Prettier         | `yarn format`          |

Always run `yarn lint`, `yarn format`, and `yarn test` to validate before pushing.

## Frameworks

**Unit and integration tests:** Vitest with React Testing Library for web tests. Config in `vitest.config.ts`, setup in `vitest-setup.ts`.  Jest with React Native for Mobile testing.  Config in `jest.config.js`, setup in `jest.setup.ts`.

**Component visual and interaction testing:** Storybook with Chromatic. Config in `.storybook/main.ts`. Stories live alongside their components in `src/components/`. Chromatic runs visual regression tests in CI on every PR.

Do not introduce additional test runners or E2E frameworks without team consensus. Supplementary tools (e.g., MSW for network mocking, `@storybook/test` for play functions) are fine as long as they work within the existing stack.

## What to Test

Prioritize testing in this order:

1. **Components with business logic.** Components that transform data, branch on conditions, or manage interactive state (toggles, tabs, filters).
2. **Utility functions.** Pure functions with branching logic, data transformations, formatters.

Do not write tests for:

- Type definitions
- Static configuration objects with no logic
- Simple wrapper components that only pass props through
- Purely presentational components that are better covered by Storybook stories and Chromatic visual regression

## Test Types and When to Use Each

### Component Tests

This will be the primary testing pattern for this project.  Test components directly when they contain meaningful logic that benefits from focused assertions, or when they are reused across multiple pages as everything in this repository is a reusable componet than this testing is necessary.

**When to use:** Components with interactive state, conditional rendering based on props, or data transformation logic. 

**Pattern for web:**

```typescript
import { FormGroupDescription } from './FormGroup.Description';
import { FormGroupProvider } from '../../FormGroupContext';
import { renderWithProvider } from '@/test-utils/render';
describe('FormGroupDescription', () => {
  it('renders children', () => {
    const { getByText } = renderWithProvider(
      <FormGroupDescription>Helpful description</FormGroupDescription>
    );
    expect(getByText('Helpful description')).toBeInTheDocument();
  });
  it('applies dataTestId to the description element', () => {
    const { getByTestId } = renderWithProvider(
      <FormGroupDescription dataTestId="form-group-description">
        Description text
      </FormGroupDescription>
    );
    const el = getByTestId('form-group-description');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Description text');
  });
  it('uses context descriptionId when inside FormGroupProvider', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
        <FormGroupDescription>Context description</FormGroupDescription>
      </FormGroupProvider>
    );
    const el = getByText('Context description');
    expect(el).toHaveAttribute('id');
    expect(el.getAttribute('id')).toMatch(/^description-/);
  });
  it('prop id overrides context descriptionId when both are present', () => {
    const { getByText } = renderWithProvider(
      <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
        <FormGroupDescription id="custom-description-id">
          Custom id description
        </FormGroupDescription>
      </FormGroupProvider>
    );
    const el = getByText('Custom id description');
    expect(el).toHaveAttribute('id', 'custom-description-id');
  });
});
```

**Pattern for native:**

```typescript
import { render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { FormGroupProvider } from '../FormGroupContext';
import { FormGroupCaption } from './Caption/FormGroup.Caption.native';
import { FormGroupDescription } from './Description/FormGroup.Description.native';
import { FormGroupLabel } from './Label/FormGroup.Label.native';

const ds = TestWrapperInDesignSystemProvider({ brand: 'startribune' });

describe('FormGroup (native)', () => {
  describe('FormGroupLabel', () => {
    it('renders label text inside provider', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormGroupLabel>Email</FormGroupLabel>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByText('Email')).toBeOnTheScreen();
    });

    it('shows optional hint when optional is true', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormGroupLabel optional>Phone</FormGroupLabel>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByText('Phone')).toBeOnTheScreen();
      expect(screen.getByText('(Optional)')).toBeOnTheScreen();
    });

    it('forwards dataTestId to the label', () => {
      render(
        <FormGroupProvider hasLabel hasDescription={false} hasCaption={false}>
          <FormGroupLabel dataTestId="fg-label-test">Field</FormGroupLabel>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByTestId('fg-label-test')).toBeOnTheScreen();
    });
  });

  describe('FormGroupDescription', () => {
    it('renders description text', () => {
      render(
        <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
          <FormGroupDescription>Help text here</FormGroupDescription>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByText('Help text here')).toBeOnTheScreen();
    });

    it('forwards dataTestId', () => {
      render(
        <FormGroupProvider hasLabel={false} hasDescription hasCaption={false}>
          <FormGroupDescription dataTestId="fg-desc-test">Desc</FormGroupDescription>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      expect(screen.getByTestId('fg-desc-test')).toBeOnTheScreen();
    });
  });

  describe('FormGroupCaption', () => {
    it('renders caption text for each variant', () => {
      const variants = ['info', 'error', 'success'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(
          <FormGroupProvider hasLabel={false} hasDescription={false} hasCaption>
            <FormGroupCaption variant={variant}>Caption {variant}</FormGroupCaption>
          </FormGroupProvider>,
          { wrapper: ds }
        );

        expect(screen.getByText(`Caption ${variant}`)).toBeOnTheScreen();
        unmount();
      });
    });

    it('sets alert live region for error variant', () => {
      render(
        <FormGroupProvider
          hasLabel={false}
          hasDescription={false}
          hasCaption
          captionVariant="error"
        >
          <FormGroupCaption variant="error" dataTestId="fg-cap-error">
            Invalid
          </FormGroupCaption>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      const root = screen.getByTestId('fg-cap-error');
      expect(root.props.accessibilityRole).toBe('alert');
      expect(root.props.accessibilityLiveRegion).toBe('assertive');
    });

    it('does not set alert role for info variant', () => {
      render(
        <FormGroupProvider hasLabel={false} hasDescription={false} hasCaption>
          <FormGroupCaption variant="info" dataTestId="fg-cap-info">
            Hint
          </FormGroupCaption>
        </FormGroupProvider>,
        { wrapper: ds }
      );

      const root = screen.getByTestId('fg-cap-info');
      expect(root.props.accessibilityRole).toBeUndefined();
      expect(root.props.accessibilityLiveRegion).toBeUndefined();
    });
  });
});
```

### Unit Tests

For pure functions and utilities with branch logic.

**When to use**: Functions that transform data, format values, or make decisions.  Not needed for simple pass through functions.  

**Pattern**

```typescript
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
```


### Storybook Interaction Tests ([docs](https://storybook.js.org/docs/writing-tests/interaction-testing))

Stories serve two purposes: visual documentation and interactive behavior testing. Static stories document component appearance across prop variants. Interaction tests (via `play` functions) verify that user interactions produce the correct visual and behavioral outcomes.

Chromatic runs in CI on every PR, capturing visual snapshots and executing play functions. This catches visual regressions and interaction breakages in one pass.

**When to add a story:** Any reusable component in `src/components/`. Stories are not needed for page level components or one off layout wrappers.


**Static story pattern (visual documentation):**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import MyComponent from '.';

const meta = {
  title: 'Category/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Click me',
    variant: 'primary',
  },
};
```

**Interaction test pattern (behavioral verification):**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import Accordion from '.';

const meta = {
  title: 'Layout & Containers/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Section Title',
    children: <p>Expandable content</p>,
  },
};

export const ToggleBehavior: Story = {
  args: { ...Default.args },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /section title/i });

    // Verify initial collapsed state
    await expect(canvas.queryByText('Expandable content')).not.toBeVisible();

    // Expand
    await userEvent.click(trigger);
    await expect(canvas.getByText('Expandable content')).toBeVisible();

    // Collapse
    await userEvent.click(trigger);
    await expect(canvas.queryByText('Expandable content')).not.toBeVisible();
  },
};
```

**Conventions:**

- Story files use the `.stories.tsx` (or `.stories.ts` when no JSX is needed) extension
- Stories live next to their component: `src/components/Accordion/accordion.stories.tsx`
- Follow the existing `title` hierarchy: Foundations, Global, Actions & Inputs, Layout & Containers, Navigation, Game, Editorial Content, User Controls, Ads & Sponsors
- Use `tags: ['autodocs']` for automatic documentation generation
- Keep static stories and interaction stories in the same file. Use descriptive export names to distinguish them (e.g., `Default`, `OpenState`, `ToggleBehavior`, `KeyboardNavigation`)
- Use `{ canvas, userEvent }` from the play function context — `canvas` is pre-scoped to the story element. Import only `expect` from `storybook/test`
- Always `await` `userEvent` methods and `expect` calls inside play functions

**Good candidates for interaction tests:** Any component where user interaction changes visible state. Expanding/collapsing panels, sorting tables, toggling menus, filtering lists, paginating results. If a user clicks something and the component looks different, that's a play function.

**Accessibility testing:**

The `@storybook/addon-a11y` addon is enabled. It runs automated accessibility checks on every story. Play functions can extend this by verifying keyboard navigation and focus management:

```typescript
import { expectNoA11yViolations } from '@/test-utils/a11y';
import { FormGroupDescription } from './FormGroup.Description';

describe('FormGroupDescription Accessibility', () => {
  describe('static rendering', () => {
    it('has no violations when description is associated with an input via id and aria-describedby', async () => {
      const descriptionId = 'email-description';
      await expectNoA11yViolations(
        <>
          <FormGroupDescription id={descriptionId}>
            We will never share your email.
          </FormGroupDescription>
          <input
            id="email-input"
            type="email"
            aria-label="Email"
            aria-describedby={descriptionId}
          />
        </>
      );
    });

    it('has no violations with dataTestId', async () => {
      const descriptionId = 'desc-id';
      await expectNoA11yViolations(
        <>
          <FormGroupDescription id={descriptionId} dataTestId="form-group-description">
            Help text for the field.
          </FormGroupDescription>
          <input id="field-input" type="text" aria-label="Field" aria-describedby={descriptionId} />
        </>
      );
    });

    it('has no violations when rendered standalone', async () => {
      await expectNoA11yViolations(
        <FormGroupDescription id="standalone-desc">
          Standalone description text
        </FormGroupDescription>
      );
    });
  });
});
```

## File Locations and Naming

### Vitest (unit and integration for web) and Jest (unit and integration for native)

Tests are colocated with the source files they test.

```
Example
packages/design-system/src/components/Button/
  native/
    Button.native.tsx
    Button.native.stories.tsx
    Button.native.test.tsx
    buttonTheme.ts
  web/
    Button.stories.tsx
    Button.test.tsx
    Button.types.ts
    Button.utils.ts
    ButtonGroup.mdx
    ButtonGroup.modules.scss
    ButtonGroup.stories.tsx
    ButtonGroup.test.tsx
    UtilityButtons.mdx
    UtilityButton.tsx
    UtilityButton.a11y.test.tsx
    UtilityButton.module.scss
    UtilityButton.stories.tsx
    UtilityButton.test.tsx
  Button.platform-exports.test.ts
  Button.types.ts
  helpers.ts
  utilityButtonIconFillVariant.ts
```

Rules:

- Test files use the `.test.ts` or `.test.tsx` extension
- Test files sit next to the file they test


### Storybook

Stories live alongside their components.

```
packages/design-system/src/components/
  Radio/
    web/
      Radio.tsx
      Radio.stories.tsx                # story file
    native/
      Radio.native.tsx
      Radio.native.stories.ts      # story file
```

## Selectors

Prefer selectors in this order:

1. `getByRole` with accessible name (best)
2. `getByText` for visible text content
3. `getByLabelText` for form elements
4. `getByTestId` as a last resort when semantic selectors are not possible

```typescript
// Good
screen.getByRole('button', { name: /submit/i });
screen.getByRole('heading', { name: /more games/i });
screen.getAllByRole('table');

// Avoid
screen.getByTestId('submit-button');
document.querySelector('.btn-primary');
```

**Query timing:**

- Use `getBy*` when the element should already be present after render
- Use `findBy*` when the element is expected to appear asynchronously (combines `getBy*` with `waitFor`)
- Use `queryBy*` when asserting that an element is _not_ present
- Use `waitFor` for more complex async assertions that `findBy*` can't cover

```typescript
// Element is present immediately
screen.getByRole('heading', { name: /more games/i });

// Element appears after async work (preferred over waitFor + getBy)
await screen.findByText('Individual Stats');

// Asserting absence
expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
```

## Writing a New Test: Decision Tree

Use this to determine what kind of test to write.

```
Is this a reusable component in src/components/?
  Does it have interactive behavior (clicks, toggles, input)?
    YES -> Write a Storybook story with a play function
           Verify the interaction produces the correct visual/behavioral result
  Does it have business logic or conditional rendering?
    YES -> Write a Vitest component test
           Import the component directly, pass props, assert rendered output
           Write a Jest test for native.  
  Is it purely presentational?
    YES -> Write a static Storybook story for visual documentation
           Chromatic will handle visual regression

Is this a pure utility function?
  YES -> Write a unit test
         Import the function, test input/output pairs

None of the above?
  -> Probably doesn't need a dedicated test. Coverage will come from
     page level tests that exercise this code indirectly.
```

## CI Integration

**Pre-commit hook (lefthook):** Automatically runs `yarn format`, `yarn lint`, `turbo run typecheck`, `yarn test:web`, and `yarn test:native` on staged files before every commit. Tests related to your changes must pass to commit.

**PR checks:**

- Vitest and Jest run on every push to main/prod and every PR. Coverage is uploaded to Codecov.
- Chromatic runs on every PR when component or story files change. It captures visual snapshots and runs play functions. Changes are auto accepted on main.

**Coverage:** Tracked via Codecov. Coverage reports appear on every PR. New code should maintain or improve coverage.

## Common Patterns


### Testing client components with state

```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
render(<MyClientComponent {...props} />, { wrapper: TestProvider });

await user.click(screen.getByRole('button', { name: /toggle/i }));
expect(screen.getByText('New content')).toBeInTheDocument();
```
