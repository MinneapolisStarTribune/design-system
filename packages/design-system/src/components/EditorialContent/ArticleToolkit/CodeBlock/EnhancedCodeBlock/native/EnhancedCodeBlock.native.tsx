import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { DangerousCodeBlock } from '../../DangerousCodeBlock/native/DangerousCodeBlock.native';
import type { BaseEnhancedCodeBlockProps } from '../EnhancedCodeBlock.types';
import { createStyles } from './EnhancedCodeBlock.styles';

export type EnhancedCodeBlockProps = Omit<BaseEnhancedCodeBlockProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
};

const createThemeState = (theme: NativeTheme) => ({
  styles: createStyles(theme),
});

export const EnhancedCodeBlock: React.FC<EnhancedCodeBlockProps> = ({
  size = 'full',
  variant = 'standard',
  cleanQuotes = true,
  dataTestId = 'enhanced-code-block',
  style,
  ...rest
}) => {
  const { styles } = useNativeStyles(createThemeState);

  const containerStyle = useMemo<ViewStyle | undefined>(() => {
    if (cleanQuotes) return undefined; // apply size/variant styles only when cleanQuotes is false
    const key = `variant-${variant}-size-${size}` as keyof typeof styles;
    return styles[key] as ViewStyle;
  }, [cleanQuotes, variant, size, styles]);

  return (
    <DangerousCodeBlock
      variant={variant}
      cleanQuotes={cleanQuotes}
      dataTestId={dataTestId}
      style={[style, containerStyle]}
      {...rest}
    />
  );
};

EnhancedCodeBlock.displayName = 'EnhancedCodeBlock';
