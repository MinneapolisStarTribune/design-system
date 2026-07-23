# @minneapolisstartribune/design-system

## 1.14.0

### Minor Changes

- [#411](https://github.com/MinneapolisStarTribune/design-system/pull/411) [`f2d3c86`](https://github.com/MinneapolisStarTribune/design-system/commit/f2d3c8652022dafb7bc276df093588cf007a9c77) Thanks [@robichaud-strib](https://github.com/robichaud-strib)! - ImageGallery: added `navButtonClassName`, `expandButtonClassName`, and `closeButtonClassName` overrides so consumers can style the nav, expand, and close buttons directly. The dialog close button now sizes from `var(--spacing-button-md)` instead of a hardcoded 44px, and `ImageGallery` is marked as a client component. ([#393](https://github.com/MinneapolisStarTribune/design-system/issues/393))

### Patch Changes

- [#411](https://github.com/MinneapolisStarTribune/design-system/pull/411) [`f2d3c86`](https://github.com/MinneapolisStarTribune/design-system/commit/f2d3c8652022dafb7bc276df093588cf007a9c77) Thanks [@robichaud-strib](https://github.com/robichaud-strib)! - Native theme: generated color tokens using CSS alpha syntax (`rgb(0 0 0 / 60%)`) are now emitted as React Native-compatible `rgba(0, 0, 0, 0.6)`, fixing broken overlay backgrounds (opaque or white) in Expo apps. Web CSS output is unchanged. ([#395](https://github.com/MinneapolisStarTribune/design-system/issues/395))

- [#404](https://github.com/MinneapolisStarTribune/design-system/pull/404) [`1f6162d`](https://github.com/MinneapolisStarTribune/design-system/commit/1f6162dc5aa8e82c7dee2a4f1df15541552af648) Thanks [@susiedouang-strib](https://github.com/susiedouang-strib)! - Native Caption and ImageGallery: gallery expand and close buttons now size from `theme.spacingButtonMd` with `radiusFull` instead of hardcoded 40/44px values, and Caption nav buttons render medium instead of large at wide widths, matching the web gallery buttons.

- [#411](https://github.com/MinneapolisStarTribune/design-system/pull/411) [`f2d3c86`](https://github.com/MinneapolisStarTribune/design-system/commit/f2d3c8652022dafb7bc276df093588cf007a9c77) Thanks [@robichaud-strib](https://github.com/robichaud-strib)! - Native UtilityLabel: a caller-supplied `style` prop now composes after the generated typography style instead of replacing it, so typography tokens are preserved while caller overrides still apply. ([#394](https://github.com/MinneapolisStarTribune/design-system/issues/394))
