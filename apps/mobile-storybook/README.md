# Mobile Storybook

Expo + Storybook for React Native — local development environment for native
design system components.

## Prerequisites

| Tool            | Version       | Notes                                       |
| --------------- | ------------- | ------------------------------------------- |
| Node.js         | >= 22          | see `.nvmrc` in repo root                   |
| Yarn            | 4.x (Berry)   | use Corepack or see root `packageManager`   |
| Xcode           | >= 15          | iOS Simulator (macOS only)                  |
| Android Studio  | latest        | Android Emulator (optional)                 |
| Expo CLI        | installed via `npx` | no global install needed              |

**First time?** See the [iOS and Android setup instructions](../docs/native-development.md#ios-setup) in the Native Development guide for full install steps (Xcode, Android Studio, environment variables, etc.).

## Install

From the **monorepo root**:

```bash
yarn install        # installs all workspace dependencies
```

**Before first run (and after token changes):** From the monorepo root, run `yarn tokens` so that `packages/design-system/dist/mobile/themes` and `dist/mobile/typography` exist. The app resolves `@mobile/themes` and `@mobile/typography` to those paths.

## Run locally (development build — NOT Expo Go)

This app requires a **development build** (via `expo-dev-client`). **Expo Go is not supported** — it uses its own bundled runtime and will crash on Storybook dependencies.

| What you're doing | Command (from repo root) |
|-------------------|--------------------------|
| **Build** the native app (one-time or after native changes) | `yarn build:ios` or `yarn build:android` |
| **Start development** (Metro dev server; use daily) | `yarn storybook:native` or `yarn storybook:ios` / `yarn storybook:android` |

### First time setup

1. **Build the development client** (installs a custom app on the simulator — not Expo Go):

   ```bash
   yarn build:ios        # from repo root — builds & installs on iOS Simulator
   # or
   yarn build:android    # builds & installs on Android emulator/device
   ```

   This runs `expo run:ios` / `expo run:android` in the mobile-storybook workspace. It compiles native code, installs `expo-dev-client`, and puts the app on your simulator.

2. **Start the Metro dev server:**

   ```bash
   yarn storybook:native   # or yarn storybook:ios / yarn storybook:android
   ```

3. **Open the "mobile-storybook" app** on the simulator. This is the app the build step installed — **not** Expo Go. The dev client connects to Metro automatically.

### Daily development

After the first build, you only need step 2 and 3. Code changes update via Fast Refresh. Only rebuild (`yarn build:ios`) when you change native config (`app.json`) or add/change native dependencies.

### Why not Expo Go?

Expo Go bundles its own fixed React Native runtime. This app needs:
- `expo-dev-client` for custom native modules
- A `SharedArrayBuffer` shim (in `shims.js`) that must run before Storybook loads
- Native dependencies (`react-native-reanimated`, gesture handler, etc.) that Expo Go doesn't include

## How it works

1. The app is a minimal Expo project (no Expo Router).
2. It references the design system package via a **workspace dependency**
   and resolves source through Babel + TypeScript path aliases
   pointing at `../../packages/design-system/src/index.native`.
3. Storybook discovers stories matching
   `packages/design-system/src/**/*.native.stories.tsx`.
4. A Storybook decorator wraps every story in `DesignSystemProvider`,
   reading the current **brand** and **mode** from Storybook controls.
5. Open the **Controls** addon panel in the on-device UI to switch:
   - `brand`: `startribune` / `varsity`
   - `mode`: `light` / `dark`

## Adding a new native story

1. Create your story file co-located with the component:

   ```
   packages/design-system/src/components/MyComponent/native/MyComponent.native.stories.tsx
   ```

2. The filename must end in `.native.stories.tsx` to be picked up by the
   native Storybook glob and excluded from the web Storybook glob.

3. Run `yarn storybook:ios` (or `:android` / `:native`) — the story will
   appear automatically.

## Design system alias

| Config            | Alias                                               | Resolves to                                          |
| ----------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `babel.config.js` | `@minneapolisstartribune/design-system/native`      | `../../packages/design-system/src/index.native`      |
| `babel.config.js` | `@`                                                 | `../../packages/design-system/src`                   |
| `tsconfig.json`   | mirrors Babel aliases for IDE type-checking          |                                                      |

## Troubleshooting

- **"Using Expo Go" in terminal** — You need a **development build**, not Expo Go. Run `yarn build:ios` first to install the dev client on the simulator, then `yarn storybook:native`. The scripts use `--dev-client` to connect to the built app.
- **Metro can't find a module** — Run `yarn install` at the monorepo root to
  ensure symlinks are correct, then restart Metro with cache cleared:
  `yarn storybook:native -- --clear`.
- **Story not appearing** — Verify the filename ends in `.native.stories.tsx`
  and lives under `packages/design-system/src/`.
- **TypeScript errors in IDE** — Restart the TS server; aliases are configured
  in `tsconfig.json` and match Babel.
- **`SharedArrayBuffer` errors** — The `shims.js` file polyfills this. Make sure `index.js` imports `./shims` before anything else.

## For engineers new to React Native

- **Expo** runs the app and Metro bundler; you don't need to run a separate "backend."
- **iOS**: Requires macOS, Xcode, and CocoaPods. See the [Native Development guide](../docs/native-development.md#ios-setup) for setup steps.
- **Android**: Requires Android Studio, SDK, emulator, and environment variables. See the [Native Development guide](../docs/native-development.md#android-setup) for setup steps.
- **Storybook runs inside the app**: Unlike web Storybook, the native app *is* the Storybook shell; you pick stories from the in-app list.
- **`storybook.requires.ts`** is generated by the Storybook Metro config when Metro starts; it's in `.gitignore` and should not be edited.

## Stage / Prod / CI

- **Stage & Prod:** EAS Build (or equivalent).
- **CI:** Run Storybook smoke tests against the build. Optionally add a Metro bundle check (e.g. `expo export --platform ios`) to catch import-time crashes.

## Audit notes (setup consistency)

- **Native projects**: iOS is generated at `apps/mobile-storybook/ios/` by `expo run:ios`. Android is generated at `apps/mobile-storybook/android/` by `expo run:android`. Both are regenerated from `app.json` config.
- **Root scripts**: From repo root, `yarn build:ios` and `yarn build:android` build the native app; `storybook:native`, `storybook:ios`, and `storybook:android` start the Metro dev server with `--dev-client`.
- **Turbo**: `turbo.json` defines persistent tasks `storybook`, `storybook:ios`, and `storybook:android` (no cache) so Turbo runs the right script in this workspace.
- **Workspace**: This app is `@minneapolisstartribune/mobile-storybook`; root uses `--filter=@minneapolisstartribune/mobile-storybook` so only this app runs for native Storybook.
- **First run**: After adding or changing this workspace, run `yarn install` from the monorepo root once so the lockfile includes it; then the root storybook scripts work.
