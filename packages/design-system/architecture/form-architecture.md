# Form Component Architecture

This document covers the form components in our design system: `Form`, `FormGroup`, `FormGroup` subcomponents, `FormControl`, and individual form control components.

## Overview

The form architecture follows a **compound component pattern** with clear separation of concerns. Each component has a specific responsibility, making the system flexible, maintainable, and accessible. Use as much or as little as you need:

```
Form (Optional - semantic <form>, layout, and onSubmit)
  └── FormGroup (layout & accessibility wiring)
      ├── FormGroup.Label (semantic label)
      ├── FormGroup.Description (helpful context)
      └── FormGroup.Caption (validation/status messages)
  └── FormControl (actual input/controls)
      ├── FormControl.TextInput (basic text input)
      ├── FormControl.CheckboxGroup (a group of checkboxes)
  └── Form.Button (Optional - type="submit", layout-aware)
  └── useFormLogic (Optional - adds controlled state and validation)
```

## Component Responsibilities

### Form (Optional)

**Location:** `src/components/Form/Form.tsx`

`FormGroup` + `FormControl` work standalone in any container. `Form` adds the semantic form element and layout. `useFormLogic` adds controlled state and validation — or bring your own (React Hook Form, Formik, `useState`).

**What it does:**

Controls layout via `orientation` prop (vertical by default, or horizontal for inline forms)

Validation state lives in the **app** (or in `useFormLogic`). `Form` does not own it.

**Example Usage:**

```tsx
// Vertical form (default)
<Form onSubmit={handleSubmit}>
  <FormGroup>
    <FormGroup.Label>Email</FormGroup.Label>
    <FormControl.TextInput />
  </FormGroup>
  <FormGroup>
    <FormGroup.Label>Password</FormGroup.Label>
    <FormControl.TextInput type="password" />
  </FormGroup>
  <Form.Button>Submit</Form.Button>
</Form>
```

---

### FormGroup

**Location:** `src/components/FormGroup/FormGroup.tsx`

FormGroup handles layout, spacing, and accessibility wiring. It's presentational (no internal state) and automatically connects labels, descriptions, and captions to form controls.

**What it does:**

- Provides consistent spacing between label, description, control, and caption
- Automatically wires accessibility attributes (`aria-labelledby`, `aria-describedby`)
- Generates unique IDs using React's `useId()` for each subcomponent

**How it works:**
FormGroup processes its children and automatically:

- Generates unique IDs for Label, Description, and Caption components
- Injects `aria-labelledby` on the form control pointing to the label
- Injects `aria-describedby` on the form control pointing to description and caption IDs

**Example:**

```tsx
<FormGroup>
  <FormGroup.Label>Email Address</FormGroup.Label>
  <FormGroup.Description>We'll never share your email</FormGroup.Description>
  <FormControl.TextInput placeholderText="Enter your email" />
  <FormGroup.Caption variant="error">Invalid email format</FormGroup.Caption>
</FormGroup>
```

**Why `useId()`?**
React's `useId()` generates stable, unique IDs that work with server-side rendering and prevent collisions across the component tree. This means multiple FormGroups on the same page won't have ID conflicts, and accessibility attributes always reference valid elements. No manual ID management needed!

---

### FormGroup Subcomponents

Simple, presentational components that render semantic HTML.

#### FormGroup.Label

**Location:** `src/components/FormGroup/FormGroupLabel.tsx`

Renders a semantic `<label>` element and associates with the form control.

**Example:**

```tsx
<FormGroup.Label>Username</FormGroup.Label>
```

#### FormGroup.Description

**Location:** `src/components/FormGroup/FormGroupDescription.tsx`

Provides helpful context or instructions. Automatically associated with the form control via `aria-describedby`.

**Example:**

```tsx
<FormGroup.Description>
  Must be at least 8 characters with a mix of letters and numbers
</FormGroup.Description>
```

#### FormGroup.Caption

**Location:** `src/components/FormGroup/FormGroupCaption.tsx`

Displays validation messages or status information. Supports `info`, `error`, and `success` variants. Automatically associated with the form control via `aria-describedby`.

**Example:**

```tsx
<FormGroup.Caption variant="error">This field is required</FormGroup.Caption>
<FormGroup.Caption variant="success">Password meets all requirements</FormGroup.Caption>
<FormGroup.Caption variant="info">Passwords must be at least 8 characters</FormGroup.Caption>
```

---

### FormControl

**Location:** `src/components/FormControl/FormControl.tsx`

A compound component that provides a namespace for all form control types. Each control (TextInput, Checkbox, Radio, etc.) has its own TypeScript interface, making it type-safe and easy to discover via autocomplete.

**Example:**

```tsx
<FormControl.TextInput />
<FormControl.Checkbox />
<FormControl.Radio />
```

---

### Individual FormControl Components

Each control is self-contained with its own implementation, styles, and tests.

#### FormControl.TextInput

**Location:** `src/components/FormControl/TextInput/TextInput.tsx`

Renders a single-line text input that handles all states (hover, focused, filled, success, error, disabled) and supports optional icons at the start or end.

**Example:**

```tsx
<FormControl.TextInput
  placeholderText="Enter your email"
  icon="mail"
  iconPosition="start"
  size="medium"
/>
```

#### Other FormControl Components

Checkbox, Radio, NumberInput, Select, and future controls all follow the same pattern: each lives in its own folder with its own props interface, styles, and tests.

---

## How Components Work Together

### Complete Example

```tsx
<Form>
  <FormGroup>
    <FormGroup.Label>Email Address</FormGroup.Label>
    <FormGroup.Description>We'll use this to send you important updates</FormGroup.Description>
    <FormControl.TextInput
      placeholderText="you@example.com"
      icon="mail"
      iconPosition="start"
      size="medium"
    />
    <FormGroup.Caption variant="error">Please enter a valid email address</FormGroup.Caption>
  </FormGroup>

  <FormGroup>
    <FormGroup.Label>Password</FormGroup.Label>
    <FormGroup.Description>Must be at least 8 characters</FormGroup.Description>
    <FormControl.TextInput type="password" placeholderText="Enter your password" size="medium" />
    <FormGroup.Caption variant="success">Password meets all requirements</FormGroup.Caption>
  </FormGroup>

  <Button type="submit">Sign Up</Button>
</Form>
```

### What Happens Behind the Scenes

When FormGroup processes its children, it automatically:

- Generates unique IDs for Label, Description, and Caption
- Injects `aria-labelledby` and `aria-describedby` on the form control
- Applies consistent spacing between all elements

Screen readers can then announce: "Email Address, edit text. We'll use this to send you important updates. Please enter a valid email address." All without any manual ID management!

---

## File Structure

```
src/components/
├── Form/                            # Future component
│   ├── Form.tsx                     # Main form component
│   ├── Form.module.scss             # Form layout & orientation styles
│   ├── Form.test.tsx                # Form behavior tests
│   ├── Form.a11y.test.tsx           # Form accessibility tests
│   └── form.stories.tsx             # Storybook stories
│
├── FormControl/
│   ├── FormControl.tsx              # Compound component container
│   ├── FormControl.module.scss      # Shared styles
│   ├── TextInput/
│   │   ├── TextInput.tsx
│   │   ├── TextInput.module.scss
│   │   └── TextInput.test.tsx
│   ├── Checkbox/
│   │   ├── Checkbox.tsx
│   │   ├── Checkbox.module.scss
│   │   └── Checkbox.test.tsx
│   ├── Radio/
│   │   └── ...
│   ├── NumberInput/
│   │   └── ...
│   ├── Select/
│   │   └── ...
│   ├── FormControl.test.tsx
│   ├── FormControl.a11y.test.tsx
│   └── FormControl.stories.tsx
│
└── FormGroup/
    ├── FormGroup.tsx                # Main component + children processing
    ├── FormGroup.module.scss        # Layout & spacing
    ├── FormGroupLabel.tsx           # Label subcomponent
    ├── FormGroupDescription.tsx     # Description subcomponent
    ├── FormGroupCaption.tsx         # Caption subcomponent
    ├── FormGroup.test.tsx
    ├── FormGroup.a11y.test.tsx
    └── formGroup.stories.tsx
```

---

## Common Patterns

### Multiple FormGroups

Each FormGroup manages its own accessibility IDs, so you can use multiple on the same page without ID collisions:

```tsx
<Form>
  <FormGroup>
    <FormGroup.Label>Username</FormGroup.Label>
    <FormControl.TextInput />
  </FormGroup>

  <FormGroup>
    <FormGroup.Label>Password</FormGroup.Label>
    <FormControl.TextInput type="password" />
  </FormGroup>
</Form>
```

### Conditional Captions

```tsx
<FormGroup>
  <FormGroup.Label>Email</FormGroup.Label>
  <FormControl.TextInput />
  {error && <FormGroup.Caption variant="error">{error}</FormGroup.Caption>}
</FormGroup>
```

---

## Testing Philosophy

We test at three levels:

**Component-Level** - Each control (like `TextInput.test.tsx`) is tested in isolation to ensure it works standalone with all its props, states, and interactions.

**Integration-Level** - FormGroup tests verify that accessibility wiring works correctly and that components play nicely together.

**Form-Level** - Form tests cover submission handling, validation coordination, orientation behavior, and the complete form experience.
