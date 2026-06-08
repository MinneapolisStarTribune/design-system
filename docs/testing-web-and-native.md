# Testing: Web vs Native

The design system ships two platforms from one package. Unit tests are split on purpose: **different runtimes need different tools**.

| | Web | Native (React Native) |
|---|-----|------------------------|
| **Test runner** | [Vitest](https://vitest.dev/) | [Jest](https://jestjs.io/) (`jest.config.js`, `preset: 'react-native'`) |
| **Rendering library** | [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/) (RNTL) |
| **Environment** | **jsdom** (browser-like DOM in Node) | Jest + React Native test harness (no DOM) |
| **File naming** | `Component.test.tsx`, `Component.a11y.test.tsx` | `Component.native.test.tsx`, `Component.native.a11y.test.tsx` |
| **Commands** | `yarn test:web`, `vitest run <file>` | `yarn test:native`, `jest --config jest.config.js <file>` |
| **Single file (repo root)** | `yarn testfile packages/design-system/src/.../Foo.test.tsx` | `yarn testfile packages/design-system/src/.../Foo.native.test.tsx` |

Full suite: `yarn test` runs **both** (Vitest first, then Jest).

---

## Why Jest for mobile / native?

Native components import `react-native` (`View`, `Pressable`, `Text`, etc.). They are **not HTML** and do not run in a browser DOM.

### 1. React Native’s official test stack is Jest-shaped

Expo and React Native document Jest as the default unit-test runner. The `react-native` Jest preset knows how to:

- Transform React Native and community packages (see `transformIgnorePatterns` in `packages/design-system/jest.config.js`)
- Resolve platform-specific files where needed
- Run in Node without a browser

Vitest *can* run some RN tests, but the ecosystem (presets, examples, Stack Overflow, Callstack docs) is centered on **Jest + RNTL** for component tests.

### 2. @testing-library/react-native expects this world

We assert the same way users experience the app: roles, labels, `testID`, and press events—not implementation details.

RNTL is built for Jest-style setups. Our native tests live next to components as `*.native.test.tsx` and are **excluded from Vitest** so they are never accidentally run with the wrong environment.

### 3. Native-only mocks and module resolution

Jest config maps native-specific modules, for example:

- `react-native-svg` → test mock
- `@/icons` → `src/icons/index.native.ts` (SvgXml icons, not web SVGR components)

That keeps tests aligned with what ships in the **native** bundle (`vite.native.config.ts`), not the web Vite pipeline.

### 4. `react-test-renderer` on native (not something we call directly)

RNTL still uses **`react-test-renderer`** under the hood to build a tree of React Native elements. There is no DOM; the renderer serializes the RN view tree so queries like `getByRole` and `getByText` work.

We do **not** import `react-test-renderer` in test files. `jest.setup.ts` only suppresses its deprecation warning until RNTL moves off it.

**Mocks in native Jest tests:** import Jest APIs explicitly:

```typescript
import { jest } from '@jest/globals';

const onPress = jest.fn();
```

`tsconfig.json` loads **Vitest** globals for the package, not Jest globals—so bare `jest.fn()` can fail type-checking even though Jest runs the file.

---

## Why Vitest + jsdom for web (not Jest, not react-test-renderer)

Web components use **DOM APIs** (`div`, `button`, CSS modules, `:hover`, etc.). Our web build and Storybook already run on **Vite**.

### 1. Same toolchain as web build and Storybook

- Web library build: `vite.web.config.ts`
- Unit tests: `vitest.config.ts` (Vite + Vitest)

One resolver story for aliases (`@/…`), SVGR (`*.svg?react`), and CSS. Tests exercise code the same way Vite bundles it for consumers.

### 2. jsdom provides a browser-like DOM

Vitest’s `environment: 'jsdom'` gives us `document`, `window`, and DOM APIs so `@testing-library/react` can render web components and run queries (`getByRole`, `getByText`, `userEvent`, etc.).

**react-test-renderer is not used for web tests here.** It renders a JSON tree of React elements; it does not implement layout, CSS, or real DOM behavior. For design-system web components (tokens, CSS modules, Mantine, a11y), **DOM-based testing via RTL + jsdom** is the right fit.

### 3. Speed, ESM, and tooling we already use

Vitest runs fast, supports ESM natively, and integrates with:

- `vitest-axe` for web accessibility tests (`*.a11y.test.tsx`)
- Coverage via `vitest run --coverage`
- `vitest.setup.ts` for jest-dom matchers and jsdom quirks (e.g. `matchMedia`, canvas mocks for axe)

### 4. Clear separation by filename

Vitest **excludes** `*.native.test.tsx` and `*.native.a11y.test.tsx`.  
Jest **only matches** those native patterns.

That avoids running a `Pressable` test in jsdom or a `<button>` test in the RN preset.

---

## Mental model

```text
Web component (*.tsx in web/)
  → Vitest + jsdom + @testing-library/react
  → “Behaves like a page in a browser”

Native component (*.native.tsx)
  → Jest + @testing-library/react-native (+ react-test-renderer inside RNTL)
  → “Behaves like a screen in React Native”
```

Both stacks follow Testing Library principles: query what the user sees, avoid testing implementation details. The **runner and environment** differ because the **platform** differs.

---

## Related docs

- [Code standards — Testing](./code-standards.md#testing-standards)
- [Native development](./native-development.md)
- `packages/design-system/jest.config.js`
- `packages/design-system/vitest.config.ts`
