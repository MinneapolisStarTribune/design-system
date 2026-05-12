import { View } from 'react-native';

export type WebViewProps = Record<string, unknown>;

export function WebView(props: WebViewProps) {
  return <View testID="react-native-webview-stub" {...props} />;
}

export default WebView;
