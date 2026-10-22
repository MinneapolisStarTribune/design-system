# @minneapolisstartribune/design-system-tanstack-form

## 1.1.0

### Minor Changes

- [#472](https://github.com/MinneapolisStarTribune/design-system/pull/472) [`5b27e88`](https://github.com/MinneapolisStarTribune/design-system/commit/5b27e889d86e94f233ba7cbf8003ea6720ee99ab) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Adds `TextAreaField`, which binds `TextArea` to a string field. The design-system peer range moves to `^4.1.0`, the first version with `TextArea`.

### Patch Changes

- Updated dependencies [[`5b27e88`](https://github.com/MinneapolisStarTribune/design-system/commit/5b27e889d86e94f233ba7cbf8003ea6720ee99ab)]:
  - @minneapolisstartribune/design-system@4.1.0

## 1.0.0

### Minor Changes

- [#462](https://github.com/MinneapolisStarTribune/design-system/pull/462) [`a9004df`](https://github.com/MinneapolisStarTribune/design-system/commit/a9004df141915a5bf151711f944292776c6ea8e4) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Removed `useFormLogic` and its types (`FormValidationErrors`, `UseFormLogicOptions`, `UseFormLogicReturn`). Use TanStack Form v1 with the new `@minneapolisstartribune/design-system-tanstack-form` package instead, see the Form docs in Storybook.

  The new package starts with a `TextField` adapter. It wraps `TextInput` in a `FormGroup`, binds it to a string field, and shows the field's validation error as an error caption once the field is blurred or the form is submitted.

- [#464](https://github.com/MinneapolisStarTribune/design-system/pull/464) [`aafa6aa`](https://github.com/MinneapolisStarTribune/design-system/commit/aafa6aa94591f5225ee23f3f09ecaa59ebcec09e) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Added `PasswordField`, `NumberField`, `SelectField`, `MultiSelectField`, `RadioGroupField`, `CheckboxField`, `CheckboxGroupField`, `SwitchField` and `ToggleGroupField` adapters.

  `Checkbox` and `ToggleGroup.Root` take an `aria-describedby` prop, so an error caption rendered outside them can be linked to the control. On `Checkbox` it's added alongside the checkbox's own caption.

### Patch Changes

- Updated dependencies [[`6ec71d0`](https://github.com/MinneapolisStarTribune/design-system/commit/6ec71d0956dceb4591c1b526c94a8b1534271d05), [`b73ec59`](https://github.com/MinneapolisStarTribune/design-system/commit/b73ec59803c3f54fac932e83740adc2521c84bff), [`626bbb7`](https://github.com/MinneapolisStarTribune/design-system/commit/626bbb7d6045c25fe1d8be9823902796313fb33d), [`94ca106`](https://github.com/MinneapolisStarTribune/design-system/commit/94ca1064fa67b82499b30ab3546e50ffcbccd13e), [`80fa290`](https://github.com/MinneapolisStarTribune/design-system/commit/80fa2904c45eac9c4067c74b17ccfecd95ff2dbd), [`a9004df`](https://github.com/MinneapolisStarTribune/design-system/commit/a9004df141915a5bf151711f944292776c6ea8e4), [`aafa6aa`](https://github.com/MinneapolisStarTribune/design-system/commit/aafa6aa94591f5225ee23f3f09ecaa59ebcec09e)]:
  - @minneapolisstartribune/design-system@4.0.0
