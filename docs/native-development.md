# Native Development Environment

This guide walks you through setting up and working in a React Native environment for the design system: running mobile Storybook, using the iOS Simulator or a physical device, and mirroring your phone to your Mac.

## Prerequisites

Before you start, ensure you have:

- **Node.js 22+** and **Yarn** (see [Getting Started](getting-started.md) in this folder)
- **macOS** (required for iOS development)
- **Xcode** (from the Mac App Store) — install **iOS** platform support when prompted. After install: open Xcode once, accept the license, and set **Command Line Tools** in Xcode → Settings → Locations.
- **(Optional) Android Studio** — only if you need to run the Android emulator. Create at least one Virtual Device (AVD) in Device Manager.

Full install details are in [apps/mobile-storybook/README.md](../apps/mobile-storybook/README.md).

### iOS Simulator: install a device (required for "press i")

If you run `yarn storybook:ios` (or press **`i`** with the dev server running) and see **"No iOS devices available in Simulator.app"**, you need to add at least one iOS simulator in Xcode:

1. Open **Xcode** (not only the Simulator app).
2. Go to **Xcode → Settings** (or **Preferences**) → **Platforms** (or **Components** in older Xcode).
3. Under **iOS**, confirm a version is installed (e.g. **iOS 18.x** or **17.x**). If not, click **+** or **Get** and install an iOS version (this installs the simulator runtimes).
4. Open **Xcode → Window → Devices and Simulators** and select the **Simulators** tab.
5. Click **+** to add a simulator: choose a **Device Type** (e.g. iPhone 16) and **OS Version** (the iOS you installed), then **Create**.

After that, run `yarn storybook:ios` again (or press **`i`** in the terminal where the dev server is running). You can also open Simulator yourself via **Xcode → Open Developer Tool → Simulator**, then **File → Open Simulator → [iOS version] → [device]**.

### "osascript ... Simulator exited with non-zero code: 1"

If you see **`Error: osascript -e tell app "System Events" to count processes whose name is "Simulator" exited with non-zero code: 1`** when running `yarn storybook:ios` or pressing **`i`**, macOS is blocking Expo from checking whether the Simulator is running (it uses AppleScript for that).

**Fix:** Grant your terminal app permission to control other apps:

1. Open **System Settings → Privacy & Security → Accessibility** (on older macOS: **Security & Privacy → Privacy → Accessibility**).
2. Click the **+** button and add **Terminal** (or **Cursor**, **VS Code**, or whatever app you use to run `yarn`). If it's already listed, ensure the toggle is **on**.
3. Quit and reopen your terminal app, then run `yarn storybook:ios` again (or `yarn storybook:native` and press **`i`**).

> **Security note (as of this writing):** Do **not** enable Accessibility for Cursor or VS Code until leadership has confirmed it does not pose a security risk. Run `yarn storybook:native` and `yarn storybook:ios` from the **built-in Terminal app** only (and add **Terminal** to Accessibility if you need the "press i" flow to open the Simulator).

**Workaround if you prefer not to change Accessibility:** Open the **Simulator** yourself first (**Xcode → Open Developer Tool → Simulator**, then pick a device). Then run `yarn storybook:native`, wait for Metro to start, and press **`i`** to launch the app on the already-open Simulator.

## Running mobile Storybook

Mobile Storybook runs only in a **development build** (via `expo-dev-client`), **not** in Expo Go. Expo Go uses its own bundled runtime and will crash on Storybook dependencies.

1. **First time (and after native config changes):** **Build** the dev client: from the **repo root** run `yarn build:ios` (or `yarn build:android`). This compiles the native app and installs it on the simulator/emulator.
2. **Start Metro** from the **repo root**: `yarn storybook:native` (or `yarn storybook:ios` / `yarn storybook:android`). The scripts use `--dev-client` so Metro connects to the built app, not Expo Go.
3. **Open the "mobile-storybook" app** on the simulator — the one the build installed, not Expo Go.

Code changes (stories, components) are served by Metro and update via Fast Refresh — no need to rebuild unless you change native config or dependencies.

From the **repo root**:

```bash
yarn install
yarn build:ios          # first time only
yarn storybook:native   # daily development
```

The dev client app opens automatically and connects to Metro.

## Viewing on a physical device

Connect your device (USB or same Wi-Fi). From **`apps/mobile-storybook/`** run `npx expo run:ios --device` (or `run:android --device`). Phone and Mac must be on the same network so the device can load the bundle from Metro.

## Mirroring your phone to your Mac (AirPlay / QuickTime)

If you want to see your **personal phone's screen** on your **work Mac** (e.g. to demo or debug without signing into a personal Apple ID on the Mac), you have two options.

### Option 1: QuickTime + USB (no Apple ID, works across work/personal)

1. Connect your iPhone to the Mac with a **USB cable**. Tap **Trust** on the phone if prompted.
2. On the Mac, open **QuickTime Player** (Applications or Spotlight).
3. Menu bar: **File → New Movie Recording**.
4. Click the **▼** next to the record button and choose your **iPhone** as the camera/source.
5. Your iPhone screen appears in the QuickTime window. No Wi-Fi or Apple ID required.

### Option 2: AirPlay to Mac (wireless, same network)

On **macOS Monterey or later**, the Mac can receive AirPlay so your phone can mirror to it:

1. **On the Mac:** Open **System Settings → General → AirDrop & Handoff** (or **Sharing** on older macOS). Find **AirPlay Receiver** and turn it **On**.
2. Set **"Allow AirPlay from"** to **"Everyone on the same network"** (or **"Everyone"**) so your personal iPhone can connect without using the same Apple ID as the Mac.
3. **On the iPhone:** Open **Control Center → Screen Mirroring** and select your Mac.

Your personal phone and work Mac can stay on different Apple IDs; AirPlay works as long as both are on the same Wi-Fi and the Mac allows it.

---

**Summary:** Use **QuickTime + USB** for a simple, account-agnostic mirror. Use **AirPlay to Mac** for wireless mirroring when your Mac and iPhone are on the same network.

## Tips for engineers new to React Native

- **Expo** runs the app and Metro (the bundler); you don't run a separate "backend."
- **Storybook runs inside the app** — the native app *is* the Storybook shell; you pick stories from the in-app list.
- **iOS Simulator** is an app that opens when you press `i`; you can also open it via **Xcode → Open Developer Tool → Simulator**.
- **Metro** is the dev server started by `yarn storybook:native`; keep that terminal running while you develop.
- For **adding or editing native stories**, see [apps/mobile-storybook/README.md](../apps/mobile-storybook/README.md#adding-a-new-native-story).

## Next steps

- **Using the design system in your app:** [Native integration guide](../integration-guides/native.md).
- **Mobile Storybook details and troubleshooting:** [apps/mobile-storybook/README.md](../apps/mobile-storybook/README.md).
