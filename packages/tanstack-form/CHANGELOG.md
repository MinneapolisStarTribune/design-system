# @minneapolisstartribune/design-system-tanstack-form

## 1.0.0

### Minor Changes

- [#462](https://github.com/MinneapolisStarTribune/design-system/pull/462) [`a9004df`](https://github.com/MinneapolisStarTribune/design-system/commit/a9004df141915a5bf151711f944292776c6ea8e4) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Removed `useFormLogic` and its types (`FormValidationErrors`, `UseFormLogicOptions`, `UseFormLogicReturn`). Use TanStack Form v1 with the new `@minneapolisstartribune/design-system-tanstack-form` package instead, see the Form docs in Storybook.

  The new package starts with a `TextField` adapter. It wraps `TextInput` in a `FormGroup`, binds it to a string field, and shows the field's validation error as an error caption once the field is blurred or the form is submitted.

### Patch Changes

- Updated dependencies [[`6ec71d0`](https://github.com/MinneapolisStarTribune/design-system/commit/6ec71d0956dceb4591c1b526c94a8b1534271d05), [`626bbb7`](https://github.com/MinneapolisStarTribune/design-system/commit/626bbb7d6045c25fe1d8be9823902796313fb33d), [`94ca106`](https://github.com/MinneapolisStarTribune/design-system/commit/94ca1064fa67b82499b30ab3546e50ffcbccd13e), [`a9004df`](https://github.com/MinneapolisStarTribune/design-system/commit/a9004df141915a5bf151711f944292776c6ea8e4)]:
  - @minneapolisstartribune/design-system@4.0.0
