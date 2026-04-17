import React, { useMemo } from 'react';
import { View, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeTheme } from '@/hooks/useNativeStyles';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import type { BaseDangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import { cleanMarkup } from '../DangerousCodeBlock.utils';
import { createStyles } from './DangerousCodeBlock.styles';

export type DangerousCodeBlockProps = Omit<BaseDangerousCodeBlockProps, 'style'> & {
  style?: ViewStyle;
};

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

  const content = useMemo(() => {
    return cleanMarkup(markup, cleanQuotes);
  }, [markup, cleanQuotes]);

  const html = useMemo(() => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              overflow-x: hidden;
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
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
    </View>
  );
};

DangerousCodeBlock.displayName = 'DangerousCodeBlock';
