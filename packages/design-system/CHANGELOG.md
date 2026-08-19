# @minneapolisstartribune/design-system

## 2.0.0

### Major Changes

- [#426](https://github.com/MinneapolisStarTribune/design-system/pull/426) [`cf2d8a2`](https://github.com/MinneapolisStarTribune/design-system/commit/cf2d8a273e1ada0527a25a82d8131b0d80dccd05) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Move `react-native-svg` and `react-native-webview` from `dependencies` to optional
  `peerDependencies` so web consumers no longer install React Native packages transitively.

  **Breaking for native consumers.** Every native consumer must now declare `react-native-svg` as well as `react-native-webview` as their dependencies.

## 1.17.0

### Minor Changes

- [#425](https://github.com/MinneapolisStarTribune/design-system/pull/425) [`1c3a703`](https://github.com/MinneapolisStarTribune/design-system/commit/1c3a70356daaef4264ddb9a160396423b6580702) Thanks [@YuvarajPattabi13](https://github.com/YuvarajPattabi13)! - Add `zIndex` prop to `Tooltip` to allow consumers to override the default stacking order (`9999`) when the tooltip renders behind fixed headers or other high z-index elements.

### Patch Changes

- [#421](https://github.com/MinneapolisStarTribune/design-system/pull/421) [`0da53d4`](https://github.com/MinneapolisStarTribune/design-system/commit/0da53d4a171494865fd087e673cd8e9251b8b63e) Thanks [@itaha-livefront-strib](https://github.com/itaha-livefront-strib)! - Bumped `react-native-svg` from 15.12.1 to 15.15.3. This resolves the 'Unable to resolve module buffer' error when trying to upgrade the design system package in the mobile repo.

  Consumers must rebuild native (`pod install` / new dev client) — this changes a native module version, so a JS-only update will not pick it up. Apps pinning `react-native-svg` should move to 15.15.3 in lockstep to avoid two copies resolving against one native build.

  [Missing buffer dependency - software-mansion/react-native-svg#2701](https://github.com/software-mansion/react-native-svg/issues/2701).

## 1.16.0

### Minor Changes

- [#422](https://github.com/MinneapolisStarTribune/design-system/pull/422) [`5ce2ff2`](https://github.com/MinneapolisStarTribune/design-system/commit/5ce2ff2ef037c9eb02c39e6de7851b2aab59c58a) Thanks [@SathishKumarRNLT](https://github.com/SathishKumarRNLT)! - Exposes slidesPerGroupAuto and slidesPerGroup props on SwiperCarousel

## 1.15.0

### Minor Changes

- [#419](https://github.com/MinneapolisStarTribune/design-system/pull/419) [`614c1a0`](https://github.com/MinneapolisStarTribune/design-system/commit/614c1a091c7d159551627a4e9504475e8455d57a) Thanks [@YuvarajPattabi13](https://github.com/YuvarajPattabi13)! - Add as prop to PageHeading web so semantic heading tag can differ from importance-based visual style.

## 1.14.0

### Minor Changes

- [#411](https://github.com/MinneapolisStarTribune/design-system/pull/411) [`f2d3c86`](https://github.com/MinneapolisStarTribune/design-system/commit/f2d3c8652022dafb7bc276df093588cf007a9c77) Thanks [@robichaud-strib](https://github.com/robichaud-strib)! - ImageGallery: added `navButtonClassName`, `expandButtonClassName`, and `closeButtonClassName` overrides so consumers can style the nav, expand, and close buttons directly. The dialog close button now sizes from `var(--spacing-button-md)` instead of a hardcoded 44px, and `ImageGallery` is marked as a client component. ([#393](https://github.com/MinneapolisStarTribune/design-system/issues/393))

### Patch Changes

- [#411](https://github.com/MinneapolisStarTribune/design-system/pull/411) [`f2d3c86`](https://github.com/MinneapolisStarTribune/design-system/commit/f2d3c8652022dafb7bc276df093588cf007a9c77) Thanks [@robichaud-strib](https://github.com/robichaud-strib)! - Native theme: generated color tokens using CSS alpha syntax (`rgb(0 0 0 / 60%)`) are now emitted as React Native-compatible `rgba(0, 0, 0, 0.6)`, fixing broken overlay backgrounds (opaque or white) in Expo apps. Web CSS output is unchanged. ([#395](https://github.com/MinneapolisStarTribune/design-system/issues/395))

- [#404](https://github.com/MinneapolisStarTribune/design-system/pull/404) [`1f6162d`](https://github.com/MinneapolisStarTribune/design-system/commit/1f6162dc5aa8e82c7dee2a4f1df15541552af648) Thanks [@susiedouang-strib](https://github.com/susiedouang-strib)! - Native Caption and ImageGallery: gallery expand and close buttons now size from `theme.spacingButtonMd` with `radiusFull` instead of hardcoded 40/44px values, and Caption nav buttons render medium instead of large at wide widths, matching the web gallery buttons.

- [#411](https://github.com/MinneapolisStarTribune/design-system/pull/411) [`f2d3c86`](https://github.com/MinneapolisStarTribune/design-system/commit/f2d3c8652022dafb7bc276df093588cf007a9c77) Thanks [@robichaud-strib](https://github.com/robichaud-strib)! - Native UtilityLabel: a caller-supplied `style` prop now composes after the generated typography style instead of replacing it, so typography tokens are preserved while caller overrides still apply. ([#394](https://github.com/MinneapolisStarTribune/design-system/issues/394))
