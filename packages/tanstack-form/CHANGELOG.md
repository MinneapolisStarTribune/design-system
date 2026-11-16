# @minneapolisstartribune/design-system-tanstack-form

## 3.1.0

### Minor Changes

- [#485](https://github.com/MinneapolisStarTribune/design-system/pull/485) [`a460425`](https://github.com/MinneapolisStarTribune/design-system/commit/a4604251d2c02fc2de64ec24ed464941505de20b) Thanks [@andres-startribune](https://github.com/andres-startribune)! - Add AutocompleteField for single selection with form value, blur, and accessible validation wiring. Requires design-system ^4.4.0 for the new Autocomplete export.

- [#480](https://github.com/MinneapolisStarTribune/design-system/pull/480) [`244c720`](https://github.com/MinneapolisStarTribune/design-system/commit/244c7209aeeb5c1a1fa5479755569373d97a07fc) Thanks [@andres-startribune](https://github.com/andres-startribune)! - Add FormControl.Datepicker and the direct FormControlDatepicker export, composing the existing calendar with typed date entry, inclusive limits, native form validation, and a leading calendar icon and trailing expand/collapse chevron. Export validateDateInput for matching form validation.

  Add the DateField TanStack adapter with shared label/error handling and reset behavior. Require SUS 4.3.0, which includes the new control.

  Use static web FormControl members so Rollup/Vite consumers of other controls can exclude Datepicker code. All documented compound members and direct exports remain available; FormControl itself remains a non-renderable container.

### Patch Changes

- Updated dependencies [[`6cbc812`](https://github.com/MinneapolisStarTribune/design-system/commit/6cbc812afcb4d6530ec318775678a22d9c7bfe3b), [`b724574`](https://github.com/MinneapolisStarTribune/design-system/commit/b724574c437ad1d95fbf8773d11cdd26ac3d3dfa), [`c2a7c95`](https://github.com/MinneapolisStarTribune/design-system/commit/c2a7c954dbf66b5c943f504fa78cf1785ab68022), [`244c720`](https://github.com/MinneapolisStarTribune/design-system/commit/244c7209aeeb5c1a1fa5479755569373d97a07fc), [`a0db6ad`](https://github.com/MinneapolisStarTribune/design-system/commit/a0db6ada7e720f9499fb9d8fed30c4b06f618622)]:
  - @minneapolisstartribune/design-system@4.4.0

## 3.0.0

### Patch Changes

- Updated dependencies [[`57a1b44`](https://github.com/MinneapolisStarTribune/design-system/commit/57a1b444f23c8175035ac70838682108beaba0d8), [`12e5634`](https://github.com/MinneapolisStarTribune/design-system/commit/12e563404e1ed9ebfeda117b3a3951eebb43fc88)]:
  - @minneapolisstartribune/design-system@4.3.0

## 2.0.0

### Patch Changes

- Updated dependencies [[`7e6746b`](https://github.com/MinneapolisStarTribune/design-system/commit/7e6746bfc08bda7d61b9b774112b2ec0e8fad9a7), [`998b73a`](https://github.com/MinneapolisStarTribune/design-system/commit/998b73aaedfe2021de1694388d6fbeeaf5ab7edb)]:
  - @minneapolisstartribune/design-system@4.2.0

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
