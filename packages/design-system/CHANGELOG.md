# @minneapolisstartribune/design-system

## 4.0.0

### Major Changes

- [#462](https://github.com/MinneapolisStarTribune/design-system/pull/462) [`a9004df`](https://github.com/MinneapolisStarTribune/design-system/commit/a9004df141915a5bf151711f944292776c6ea8e4) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Removed `useFormLogic` and its types (`FormValidationErrors`, `UseFormLogicOptions`, `UseFormLogicReturn`). Use TanStack Form v1 with the new `@minneapolisstartribune/design-system-tanstack-form` package instead, see the Form docs in Storybook.

  The new package starts with a `TextField` adapter. It wraps `TextInput` in a `FormGroup`, binds it to a string field, and shows the field's validation error as an error caption once the field is blurred or the form is submitted.

### Minor Changes

- [#467](https://github.com/MinneapolisStarTribune/design-system/pull/467) [`6ec71d0`](https://github.com/MinneapolisStarTribune/design-system/commit/6ec71d0956dceb4591c1b526c94a8b1534271d05) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - `Dialog.Root` and `Drawer.Root` take a `dismissible` prop. Set it to `false` for prompts that can't be skipped, like signing in again after a session expires: Escape and overlay presses no longer call `onClose`, and the close button is hidden unless you pass `showCloseButton`.

### Patch Changes

- [#468](https://github.com/MinneapolisStarTribune/design-system/pull/468) [`626bbb7`](https://github.com/MinneapolisStarTribune/design-system/commit/626bbb7d6045c25fe1d8be9823902796313fb33d) Thanks [@quynhngandao](https://github.com/quynhngandao)! - `Menu` now closes when the user presses Shift+Tab from an item and returns focus to the trigger, as Escape does. This follows the APG menu button pattern that Floating UI does not handle.

- [#466](https://github.com/MinneapolisStarTribune/design-system/pull/466) [`94ca106`](https://github.com/MinneapolisStarTribune/design-system/commit/94ca1064fa67b82499b30ab3546e50ffcbccd13e) Thanks [@quynhngandao](https://github.com/quynhngandao)! - `Select` and `MultiSelect` stay inside their container with `box-sizing: border-box`, update their dropdowns padding and item radius.

  `Select` has one tab stop. The nested button is now a plain element, so screen readers no longer announce the field twice. The combobox opens and selects with Space, exposes `aria-disabled` when disabled, and leaves the tab order.

  `Select` now selects the active option and closes on Tab, and closes when focus moves to another control.

## 3.2.0

### Minor Changes

- [#461](https://github.com/MinneapolisStarTribune/design-system/pull/461) [`c53d374`](https://github.com/MinneapolisStarTribune/design-system/commit/c53d374aa134bf28579862a1e80a2e86555ad679) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - `components.css` no longer starts with `@charset "UTF-8";`. The file is ASCII-only, so the rule did nothing, and when the file was imported into a cascade layer (`@import … layer(…)`) it caused an "Unknown at rule: @charset" parse warning.

  Add scoped web theme files: `startribune-light.scoped.css`, `startribune-dark.scoped.css`, `varsity-light.scoped.css`, and `varsity-dark.scoped.css`. Each contains only the scheme's CSS variables, under `[data-theme='light']` or `[data-theme='dark']`, and sets `color-scheme`. Import `{brand}-dark.scoped.css` after `{brand}-light.css` to switch to dark with `data-theme="dark"` on `<html>` or on any region. The existing `{brand}-{mode}.css` files are unchanged.

  `DesignSystemProvider` now sets `data-theme` on `<html>` when `forceColorScheme` is passed, and restores the previous value on unmount. When `forceColorScheme` is omitted, the provider leaves `data-theme` alone. Apps that pass `forceColorScheme="dark"` now also get the `[data-theme='dark']` styles in `TextInput` and `CandyBar` (the same styles dark Storybook shows). `Link` now applies its dark styles under `[data-theme='dark']` as well as `.sb-dark`. The new `DS_ROOT_THEME_ATTRIBUTE` export holds the attribute name.

## 3.1.0

### Minor Changes

- [#455](https://github.com/MinneapolisStarTribune/design-system/pull/455) [`50e6e2d`](https://github.com/MinneapolisStarTribune/design-system/commit/50e6e2d67d507d5029e798102d9700c0390bc4c4) Thanks [@quynhngandao](https://github.com/quynhngandao)! - Add web `Menu`, with `Menu.Item`, `Menu.ItemIcon`, and `Menu.Divider`. The divider leaves 2px above and below it, so hovered and focused items don't touch it. The menu renders and wires a `trigger` element (with `onOpen`). It supports `placement`, pointer controls, link and disabled items (pass `as={NextLink}` to render a router link), item-closing behavior, and arrow-key navigation. `placement` and `arrowPosition` accept a value per breakpoint. Its `onClose` callback takes no arguments. If the chosen side runs out of room, the menu flips to the other side, then shrinks to fit and scrolls. Pass `portalRoot` to render it outside `document.body`.

  Exports the `MenuProps`, `MenuItemProps`, `MenuPlacement`, and `MenuArrowPosition` types.

### Patch Changes

- [#455](https://github.com/MinneapolisStarTribune/design-system/pull/455) [`aaf6052`](https://github.com/MinneapolisStarTribune/design-system/commit/aaf605267d485d98e5590d939eb473696e05bdd4) Thanks [@quynhngandao](https://github.com/quynhngandao)! - `Popover` now shrinks to fit narrow screens or its `portalRoot`. A `left` or `right` popover that fits on neither side opens below or above the trigger instead. `Popover.Divider` now applies `fullBleed`: by default it spans the popover edge to edge, and with `fullBleed={false}` it lines up with the body text. The divider also has `role="separator"`.

- [#456](https://github.com/MinneapolisStarTribune/design-system/pull/456) [`3cac61b`](https://github.com/MinneapolisStarTribune/design-system/commit/3cac61bfccef8b587774f17998db8ecd84267a50) Thanks [@quynhngandao](https://github.com/quynhngandao)! - `Select` now matches the Core `select` component. The options list uses the dropdown menu styles shared with `Menu`: 16px list radius, no vertical list padding, 12px option padding, 16px option text at every size, a 3px scrollbar, and a max height of 317px (was 280px), scrolling past that. The large trigger has a 12px gap before the chevron. Default and error borders use the `border-on-light-subtle-02` and `border-state-attention-on-light` tokens, so they follow dark mode. `Select` also no longer adds an `undefined` class to its container when a value is selected.

## 3.0.0

### Major Changes

- [#442](https://github.com/MinneapolisStarTribune/design-system/pull/442) [`19b920f`](https://github.com/MinneapolisStarTribune/design-system/commit/19b920fc71e2d658b66a71ae346c24fbf193d60d) Thanks [@quynhngandao](https://github.com/quynhngandao)! - ## Breaking changes

  ### Namespace API

  `Popover` now follows the `Drawer` and `Menu` namespace pattern:

  ```tsx
  // Before
  <Popover />

  // After
  <Popover.Root />
  ```

  Imports and section names do not change: use `Popover.Heading`, `Popover.Description`,
  `Popover.Body`, and `Popover.Divider`.

  ### Styling API
  - On `Popover`, replace `wrapperClassName`, `containerClassName`, `contentClassName`, and
    `arrowClassName` with surface `className`.
  - On sections, replace named class props with `className`:
    - `Popover.Heading`: replace `headerClassName`; `titleClassName` and `closeButtonClassName`
      are removed.
    - `Popover.Description`, `Popover.Body`, and `Popover.Divider`: replace their named class prop.
  - Only `id` and `style` remain supported HTML div attributes. Use `dataTestId` instead of
    `data-testid`, as with `Drawer`. Custom `style` is merged with positioning styles, so it no
    longer breaks placement.
  - Sections also accept `dataTestId`. `Popover.Heading` sets `${dataTestId}-close-button` on its
    close button.

  ### Portal API

  `PopoverPortalRootProvider` and `PopoverPortalRootContext` are removed. Pass `portalRoot` to
  each `Popover` that needs a custom container, as with `Drawer`.

  ### Removed APIs

  `TriggerablePopover`, `useExternalTrigger`, `installExternalTriggerGlobals`, and their types
  are removed. No known consumer uses them.

  ## Consumer impact
  - **Coaches Portal** (`apps/web`, 2.1.0): update both `Sidebar.tsx` popovers to
    `Popover.Root` and replace removed styling props with `className`. The account menu can
    alternatively move to `Menu` (VAR-1267). It does not use the removed portal API.
  - **Varsity Web** (1.14.0): in `GiftButton` and `ShareButton`, rename `<Popover>` to
    `<Popover.Root>`. No removed props or portal API are used.
  - **Star Tribune Web** (1.17.0) and **The Brief** (^1.12.1): no action required.

  Coaches Portal and Varsity Web force a light color scheme, so the dark-mode improvement below
  does not change their appearance.

  ## Improvements
  - `Popover` no longer adds a trigger wrapper `div`, avoiding hydration errors inside `<p>` and
    preserving inline, flex, and grid layouts.
  - Dialogs use `Popover.Heading` as their accessible name when present, otherwise `aria-label`.
  - Triggers now point `aria-controls` at the dialog, and element triggers keep their own display.
  - `Popover.Heading` adds `eyebrow`, `value`, and `showCloseButton` (default: `true`).
  - Popovers now follow the app theme. Customize the surface with `--popover-background`,
    `--popover-arrow-fill`, and `--popover-arrow-stroke`.

### Minor Changes

- [#450](https://github.com/MinneapolisStarTribune/design-system/pull/450) [`4089cec`](https://github.com/MinneapolisStarTribune/design-system/commit/4089cec919bde15fe686054fce876dd2e6eeb3f1) Thanks [@willogura](https://github.com/willogura)! - Add `Coachmark`'s `impressionTrackingId` prop (web): renders an empty, inert element with that id inside the floating panel itself, sized and positioned to exactly cover it.

  For a third party (e.g. Piano) that tracks impressions by watching whether _its own_ element intersects the viewport, rather than anything this component exposes directly. That element needs to actually move and resize with the panel to reflect the coachmark's real on-screen visibility -- a tracking element placed anywhere else on the page (e.g. appended to `document.body`) can't accurately reflect that.

  Given a local `zIndex: -1`, so whatever a third party injects there (e.g. an iframe) stays visually behind the panel's own title/description/CTA instead of covering them -- a positioned element with no z-index of its own otherwise paints above normal in-flow content regardless of DOM order. Also carries the HTML `inert` attribute, not just `aria-hidden`, so injected focusable content (e.g. that same iframe) can't still be reached by keyboard even though it's hidden from screen readers and click-through.

- [#450](https://github.com/MinneapolisStarTribune/design-system/pull/450) [`f8e3ef7`](https://github.com/MinneapolisStarTribune/design-system/commit/f8e3ef7f6f296fe53dc41f6c7e8a8e5472669ec7) Thanks [@willogura](https://github.com/willogura)! - Add `Coachmark`'s `trackReferenceMovement` prop (web): repositions on every animation frame instead of only on scroll/resize events. Defaults to false (unchanged behavior). Turn on when `children` scrolls within the page (e.g. a table row) rather than staying fixed on screen (e.g. a sticky header icon) -- event-based repositioning can visibly lag behind a reference that's continuously moving, since browsers can throttle/coalesce scroll event dispatch during a fast or flung scroll.

- [#448](https://github.com/MinneapolisStarTribune/design-system/pull/448) [`1ce30d2`](https://github.com/MinneapolisStarTribune/design-system/commit/1ce30d294b4868a7dc335306183669bb60a7fd33) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Add `ToggleGroup` (web): a set of joined toggles, shown in Figma as the segmented control. Compose `ToggleGroup.Root` with `ToggleGroup.Item`.
  `type="single"` (default) keeps exactly one item selected and behaves as a radio group; `type="multiple"` lets any number be selected and behaves as a group of checkboxes, with `value` as an array.

### Patch Changes

- [#454](https://github.com/MinneapolisStarTribune/design-system/pull/454) [`021b920`](https://github.com/MinneapolisStarTribune/design-system/commit/021b920c4de2e02d8de6c6b309b69596676a79cc) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Update `Dialog`, `Drawer` and `ToggleGroup` type exports.

## 2.4.0

### Minor Changes

- [#447](https://github.com/MinneapolisStarTribune/design-system/pull/447) [`49866ab`](https://github.com/MinneapolisStarTribune/design-system/commit/49866ab851d33592002272258e9227a3d67a6f7b) Thanks [@willogura](https://github.com/willogura)! - Export `useCoachmarkPortalRoot` (web) alongside `Coachmark`: creates/reuses a dedicated, viewport-pinned DOM node to use as `Coachmark`'s `portalRoot` prop, so a consuming app's CSS can target one particular coachmark instance (e.g. to give it a different z-index than the rest) via that root's id. Also fixes the `flip`/`shift` boundary issue a bare, zero-height portal node would otherwise cause.

  Moved here from an app that had its own copy of this logic, since any consumer of `Coachmark` with a custom `portalRoot` needs the same safeguards.

### Patch Changes

- [#447](https://github.com/MinneapolisStarTribune/design-system/pull/447) [`6092246`](https://github.com/MinneapolisStarTribune/design-system/commit/6092246500e014b746508e8222dba60e8e606984) Thanks [@willogura](https://github.com/willogura)! - Fix `Coachmark` sitting dead-center instead of hugging the viewport edge near a corner-anchored trigger (e.g. a `top-right`/`bottom-right` coachmark on a nav icon), and its arrow sliding into the card's own rounded corner instead of staying inset from it.

  `shift()` ran after the custom `alignmentShift` middleware and re-clamped the card's position using its own (larger) edge padding, silently overriding whatever edge-hugging position `alignmentShift` had computed. Both now share the same smaller padding. The `arrow()` middleware also now keeps a minimum distance from the card's edge instead of being allowed to slide flush into it.

## 2.3.0

### Minor Changes

- [#439](https://github.com/MinneapolisStarTribune/design-system/pull/439) [`67c7cc8`](https://github.com/MinneapolisStarTribune/design-system/commit/67c7cc8a4eac7d1a77193e3fe1260a8f37e2c56a) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Add `Drawer` (web): a modal panel attached to the side of the screen. Compose `Drawer.Root` with `Drawer.Heading`, `Drawer.Body` and `Drawer.Footer`. Supports a responsive `position`, `role="alertdialog"`, describing the panel by its body (`describeWithBody`), a `closeLabel` for the close button, and an `onClose(reason)` that reports `'closeButton' | 'escapeKey' | 'overlayPress'`.
  `Drawer.Heading` renders an `h2` by default; pass `as` (`'h1' | 'h2' | 'h3' | 'h4' | 'div'`) to change the heading level, or `div` for content that isn't a single heading. Its props are exported as `DrawerHeadingProps`.

- [#441](https://github.com/MinneapolisStarTribune/design-system/pull/441) [`d8e010d`](https://github.com/MinneapolisStarTribune/design-system/commit/d8e010de770b3bdba368f4ebf9450ab6b2f3778e) Thanks [@mauricio-rossi-strib](https://github.com/mauricio-rossi-strib)! - Add `Dialog` (web): a modal window that's centered on larger screens and rises from the bottom as a sheet on phones.
  Also adds `error` color option for Button (web and native) in order to allow for delete/destructive confirmation buttons, a common pattern on confirmation dialogs.
  `Dialog.Actions` stacks its actions full width on phones by default; pass `stackOnMobile={false}` to keep them side by side for longer content like forms.
  `Dialog.Title` renders an `h2` by default; pass `as` (`'h1' | 'h2' | 'h3' | 'h4' | 'div'`) to change the heading level, or `div` for content that isn't a single heading, like a logo plus a title. Its props are exported as `DialogTitleProps`.

## 2.2.0

### Minor Changes

- [#438](https://github.com/MinneapolisStarTribune/design-system/pull/438) [`a6fa1b0`](https://github.com/MinneapolisStarTribune/design-system/commit/a6fa1b0fc2c0d557577c73b78c5dbc30fc514f5f) Thanks [@willogura](https://github.com/willogura)! - Adds a `Coachmark` component — a dismissible, externally-controlled callout for an unprompted single action. Vendor-specific coachmark integrations (e.g. Piano) live outside this package; see `@minneapolisstartribune/piano-coachmark`.

### Patch Changes

- [#433](https://github.com/MinneapolisStarTribune/design-system/pull/433) [`37f21b3`](https://github.com/MinneapolisStarTribune/design-system/commit/37f21b3d78686d334f789f127f8039c751e3463b) Thanks [@andres-startribune](https://github.com/andres-startribune)! - Fix web Select so Enter highlights the selected option, or the first option when no value matches, on opening. Scroll the dropdown into view with nearest alignment when opened, and keep the active option visible when reopening a long list.

## 2.1.0

### Minor Changes

- [#430](https://github.com/MinneapolisStarTribune/design-system/pull/430) [`a3708e5`](https://github.com/MinneapolisStarTribune/design-system/commit/a3708e55b19e2fd848126e584fe87df97acab8d4) Thanks [@willogura](https://github.com/willogura)! - Add TriggerablePopover component and useExternalTrigger hook for vendor-triggerable popovers.

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
