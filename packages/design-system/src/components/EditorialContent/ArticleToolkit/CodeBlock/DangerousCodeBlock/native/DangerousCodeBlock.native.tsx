import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import type { BaseDangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import { cleanMarkup } from '../DangerousCodeBlock.utils';
import { createStyles } from './DangerousCodeBlock.styles';
import { NativeViewStylingProps } from '@/types';

export type DangerousCodeBlockProps = NativeViewStylingProps<BaseDangerousCodeBlockProps>;

const createThemeState = (theme: NativeTheme) => ({
  styles: createStyles(theme),
});

export const DangerousCodeBlock: React.FC<DangerousCodeBlockProps> = ({
  markup,
  variant = 'standard',
  cleanQuotes = true,
  dataTestId = 'dangerous-code-block',
  style,
}) => {
  const { styles } = useNativeStyles(createThemeState);
  const [height, setHeight] = useState(1);

  const content = useMemo(() => {
    return cleanMarkup(markup, cleanQuotes);
  }, [markup, cleanQuotes]);

  const injectedJS = `
    (function() {
      function sendHeight() {
        const height = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.ReactNativeWebView.postMessage(String(height + 1));
      }

      setTimeout(sendHeight, 100);
      window.addEventListener('load', sendHeight);
    })();
    true;
  `;

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    const newHeight = Number(event.nativeEvent.data);
    if (!isNaN(newHeight)) {
      setHeight(newHeight);
    }
  }, []);

  const html = useMemo(() => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * {
              box-sizing: border-box;
              padding: 0;
              margin: 0;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  }, [content]);

  return (
    <View
      testID={dataTestId}
      style={[
        styles.base,
        variant === 'immersive' ? styles.variantImmersive : styles.variantStandard,
        style,
      ]}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
        style={{ height }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
    </View>
  );
};

DangerousCodeBlock.displayName = 'DangerousCodeBlock';
