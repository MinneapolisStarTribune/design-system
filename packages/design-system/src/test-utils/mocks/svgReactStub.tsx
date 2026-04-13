import { View } from 'react-native';

/**
 * Jest does not run Vite/SVGR, so `import x from './icon.svg?react'` would resolve to a bogus path.
 * Map `*.svg?react` to this stub in jest.config.js.
 */
export default function SvgReactStub(props: Record<string, unknown>) {
  return <View testID="svg-react-stub" {...props} />;
}
