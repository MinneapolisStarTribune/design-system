# Mobile Storybook

Expo + Storybook for React Native — local development environment for native
design system components.

## Prerequisites

| Tool           | Version             | Notes                                     |
| -------------- | ------------------- | ----------------------------------------- |
| Node.js        | >= 22               | see `.nvmrc` in repo root                 |
| Yarn           | 4.x (Berry)         | use Corepack or see root `packageManager` |
| Xcode          | >= 15               | iOS Simulator (macOS only)                |
| Android Studio | latest              | Android Emulator (optional)               |
| Expo CLI       | installed via `npx` | no global install needed                  |

**First time?** See the [iOS and Android setup instructions](../docs/native-development.md#ios-setup) in the Native Development guide for full install steps (Xcode, Android Studio, environment variables, etc.).

## Install

From the **monorepo root**:

```bash
yarn install        # installs all workspace dependencies
```

**Before first run (and after token changes):** From the monorepo root, run `yarn tokens` so that `packages/design-system/dist/mobile/themes` and `dist/mobile/typography` exist. The app resolves `@mobile/themes` and `@mobile/typography` to those paths.

## Where to run commands

This app lives in a Yarn workspace monorepo. **Use the repository root** (`design-system/`) for day-to-day work unless noted below.

### From the repo root (recommended)

| Task | Command |
| ---- | ------- |
| Install all workspace dependencies | `yarn install` |
| Build design-system mobile tokens | `yarn tokens` |
| Build iOS dev client (native app) | `yarn build:ios` |
| Build Android dev client | `yarn build:android` |
| Start Metro (dev client) | `yarn storybook:native` |
| Start Metro + iOS Simulator | `yarn storybook:ios` |
| Start Metro + Android emulator | `yarn storybook:android` |

Root scripts delegate to this workspace via Turbo or `yarn workspace @minneapolisstartribune/mobile-storybook`.

### From `apps/mobile-storybook/` (equivalent)

You can `cd apps/mobile-storybook` and run the workspace scripts directly:

| Task | Command |
| ---- | ------- |
| Build iOS dev client | `yarn ios` |
| Build Android dev client | `yarn android` |
| Start Metro | `yarn storybook` |
| Start Metro + iOS | `yarn storybook:ios` |
| Start Metro + Android | `yarn storybook:android` |

These run the same Expo commands as the root shortcuts. App scripts set `NODE_PATH=./node_modules`, which helps Babel resolve `expo/config` in the monorepo.

### Always run from the repo root

- **`yarn install`** — installs the whole monorepo; do not run install only inside `apps/mobile-storybook/`.
- **`yarn tokens`** — builds token output under `packages/design-system/dist/mobile/`.

### Do not run commands from

- `apps/mobile-storybook/ios/` — use `yarn build:ios` from root or `yarn ios` from this app folder.
- `apps/mobile-storybook/android/` — same for Android.

Running `pod install` manually under `ios/` is discouraged; `expo run:ios` (via `yarn build:ios` or `yarn ios`) handles native dependencies.

### Physical device

See [Run locally](#run-locally) — **Option A** (dev client install + Metro) or **Option B** (Expo Go: `yarn storybook:native`, press **`s`**, scan QR). Phone and Mac must be on the same Wi‑Fi for either option.

## Run locally

Storybook scripts start Metro with **`--dev-client`** (development build mode). You can also use **Expo Go** on a physical device by toggling Metro — both are documented below.

| What you're doing | Command (from repo root) |
| ----------------- | ------------------------ |
| Start Metro | `yarn storybook:native` |
| Start Metro + open simulator/emulator | `yarn storybook:ios` / `yarn storybook:android` |
| Build custom native app (dev client) | `yarn build:ios` / `yarn build:android` |

### Option A: Development build (recommended)

Use this for **simulator/emulator**, **CI**, and when you need the full native stack (Reanimated, worklets, all Storybook addons). This is what `app.json` and `expo-dev-client` are configured for.

**First time (or after `app.json` / native dependency changes):**

1. Build and install the dev client:

   ```bash
   yarn build:ios        # iOS Simulator
   # or
   yarn build:android    # Android emulator/device
   ```

2. Start Metro:

   ```bash
   yarn storybook:native   # or yarn storybook:ios / yarn storybook:android
   ```

3. Open the **mobile-storybook** app on the simulator (the app from step 1, not Expo Go). It connects to Metro automatically.

**Daily:** Steps 2–3 only. Rebuild when native config or dependencies change.

**Physical device (dev client):** Install the app once with `npx expo run:ios --device` or `run:android --device` from `apps/mobile-storybook/`, then start Metro with `yarn storybook:native` and stay in **development build** mode (do not press **`s`** to switch to Expo Go). Scan the QR code or open the installed app.

### Option B: Expo Go (physical device, quick try)

Expo Go can work for **light testing on a real phone** after dependencies are aligned with **Expo SDK 54** (install the latest Expo Go from the store). It avoids a native build but uses a fixed runtime — some stories or addons may fail if they need native modules Expo Go does not ship.

1. From the repo root, start Metro:

   ```bash
   yarn storybook:native
   ```

2. In the Metro terminal, press **`s`** (`switch to Expo Go`). Metro shows **Using Expo Go** and the QR code targets the **Expo Go** app.

3. On your phone, install **Expo Go** (SDK 54), connect to the **same Wi‑Fi** as your Mac, and scan the QR code.

Press **`s`** again (`switch to development build`) to return to dev-client mode.

| | Development build | Expo Go |
| --- | --- | --- |
| **Best for** | Simulator, full native deps, team default | Quick check on a physical device |
| **Native build required?** | Yes (`yarn build:ios` / `:android`) | No |
| **How to connect** | Open **mobile-storybook** app; or QR in dev-client mode | Press **`s`** in Metro, scan QR with **Expo Go** |
| **Guaranteed for all stories?** | Yes (intended setup) | No — depends on Expo Go’s bundled modules |

### Metro modes (`s` toggle)

Our scripts pass `--dev-client`, so Metro starts in **development build** mode. While Metro is running, Expo prints a shortcut line such as:

- **`Press s │ switch to Expo Go`** — when you are in development build mode
- **`Press s │ switch to development build`** — when you are in Expo Go mode (**Using Expo Go**)

The QR code and deep link target whichever mode is active.

If you see **`PlatformConstants`** or missing-module errors in Expo Go, the JS bundle and Expo Go’s runtime are likely out of sync — run `yarn install` at the repo root, confirm Expo SDK 54, update Expo Go on the device, or use **Option A** (dev client) instead.

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

| Config            | Alias                                          | Resolves to                                     |
| ----------------- | ---------------------------------------------- | ----------------------------------------------- |
| `babel.config.js` | `@minneapolisstartribune/design-system/native` | `../../packages/design-system/src/index.native` |
| `babel.config.js` | `@`                                            | `../../packages/design-system/src`              |
| `tsconfig.json`   | mirrors Babel aliases for IDE type-checking    |                                                 |

## Troubleshooting

- **`pod install` failed** after upgrading Expo SDK — The checked-in `ios/Podfile.lock` may still reference React Native 0.79 pods while `package.json` is on 0.81. From `apps/mobile-storybook/ios/`:

  ```bash
  export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8   # required if CocoaPods warns about UTF-8
  rm -rf Pods Podfile.lock build
  pod install
  ```

  Then run `yarn build:ios` from the repo root again. Commit the regenerated `Podfile.lock` so the team stays in sync.

- **Android build fails after Expo SDK upgrade** — Gradle caches and generated native code can be stale. From `apps/mobile-storybook/android/`:

  ```bash
  ./gradlew clean
  ```

  Or remove build outputs and retry from the repo root:

  ```bash
  rm -rf apps/mobile-storybook/android/.gradle apps/mobile-storybook/android/app/build apps/mobile-storybook/android/build
  yarn build:android
  ```

  Ensure [Android setup](../docs/native-development.md#android-setup) is complete (`ANDROID_HOME`, an AVD or connected device). First build downloads Gradle dependencies and can take several minutes.

- **CocoaPods `Unicode Normalization not appropriate for ASCII-8BIT`** — Your shell locale is not UTF-8. Add to `~/.zshrc` and restart the terminal:

  ```bash
  export LANG=en_US.UTF-8
  export LC_ALL=en_US.UTF-8
  ```

- **Wrong app opens after scanning QR** — Check Metro’s mode (look for **Using Expo Go** vs development build). Press **`s`** to toggle; the QR targets the active mode. For Expo Go, press **`s`** until Metro shows **Using Expo Go**, then scan with the Expo Go app. For the dev client, stay in development build mode and open **mobile-storybook** (or scan after `yarn build:ios` / device install).
- **`PlatformConstants` / TurboModule errors in Expo Go** — Usually SDK or version mismatch. Run `yarn install` at the repo root, update Expo Go on the device to match SDK 54, or use the **development build** (`yarn build:ios` / `yarn build:android`).
- **Expo Go worked before but not now** — Confirm Metro shows **Using Expo Go** (press **`s`** if needed), same Wi‑Fi, and Expo Go is updated. Fall back to dev client for full Storybook support.
- **Metro can't find a module** — Run `yarn install` at the monorepo root to
  ensure symlinks are correct, then restart Metro with cache cleared:
  `yarn storybook:native -- --clear`.
- **Story not appearing** — Verify the filename ends in `.native.stories.tsx`
  and lives under `packages/design-system/src/`.
- **TypeScript errors in IDE** — Restart the TS server; aliases are configured
  in `tsconfig.json` and match Babel.
- **`SharedArrayBuffer` errors** — The `shims.js` file polyfills this. Make sure `index.js` imports `./shims` before anything else.
- > :warning: **Troubleshooting:** If you hit a sandbox sync error, run `yarn build:ios` again — it will re-run pod install automatically. Do not run `pod install` directly; it's deprecated in React Native projects. You can also run `yarn ios` from inside `apps/mobile-storybook/` as an alternative. Always run commands from either the **repo root** or `apps/mobile-storybook/` — not from `apps/mobile-storybook/ios/`.

## For engineers new to React Native

- **Expo** runs the app and Metro bundler; you don't need to run a separate "backend."
- **iOS**: Requires macOS, Xcode, and CocoaPods. See the [Native Development guide](../docs/native-development.md#ios-setup) for setup steps.
- **Android**: Requires Android Studio, SDK, emulator, and environment variables. See the [Native Development guide](../docs/native-development.md#android-setup) for setup steps.
- **Storybook runs inside the app**: Unlike web Storybook, the native app _is_ the Storybook shell; you pick stories from the in-app list.
- **`storybook.requires.ts`** is generated by the Storybook Metro config when Metro starts; it's in `.gitignore` and should not be edited.

## Stage / Prod / CI

- **Stage & Prod:** EAS Build (or equivalent).
- **CI:** Run Storybook smoke tests against the build. Optionally add a Metro bundle check (e.g. `expo export --platform ios`) to catch import-time crashes.

## Audit notes (setup consistency)

- **Native projects**: iOS is generated at `apps/mobile-storybook/ios/` by `expo run:ios`. Android is generated at `apps/mobile-storybook/android/` by `expo run:android`. Both are regenerated from `app.json` config.
- **Root scripts**: From repo root, `yarn build:ios` and `yarn build:android` build the dev client; `storybook:native`, `storybook:ios`, and `storybook:android` start Metro with `--dev-client` (press **`s`** in Metro to switch to Expo Go for QR on a physical device).
- **Turbo**: `turbo.json` defines persistent tasks `storybook`, `storybook:ios`, and `storybook:android` (no cache) so Turbo runs the right script in this workspace.
- **Workspace**: This app is `@minneapolisstartribune/mobile-storybook`; root uses `--filter=@minneapolisstartribune/mobile-storybook` so only this app runs for native Storybook.
- **First run**: After adding or changing this workspace, run `yarn install` from the monorepo root once so the lockfile includes it; then the root storybook scripts work.
