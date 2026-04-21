import React from 'react';
import { View, type TextStyle, type ViewStyle } from 'react-native';
import type { PullQuoteProps } from '../PullQuote.types';
import { ArticleQuote } from '@/components/Typography/ArticleBody/ArticleQuote/native/ArticleQuote.native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useNativeStyles, type NativeTheme } from '@/hooks/useNativeStyles';
import { QuoteIcon } from '@/icons/index.native';

export type { PullQuoteProps } from '../PullQuote.types';

const getNumericValue = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const PullQuote: React.FC<PullQuoteProps> = ({
  quote,
  attribution,
  jobTitle,
  variant = 'standard',
  size = 'small',
  dataTestId = 'pull-quote',
  ...accessibilityProps
}) => {
  const styles = useNativeStyles(createStyles);
  if (!quote) return null;

  const iconDimensions = size === 'large' ? styles.iconLarge : styles.iconSmall;

  const ariaLabel = accessibilityProps['aria-label'];
  const ariaHidden = accessibilityProps['aria-hidden'];

  return (
    <View
      style={[
        styles.pullQuote,
        variant === 'immersive' ? styles.variantImmersive : styles.variantStandard,
      ]}
      testID={dataTestId}
      accessibilityLabel={ariaLabel}
      accessibilityElementsHidden={ariaHidden}
      importantForAccessibility={ariaHidden ? 'no-hide-descendants' : 'auto'}
    >
      <View style={[styles.quoteIconWrapper, iconDimensions]}>
        <View style={styles.quoteIcon}>
          <QuoteIcon
            width={iconDimensions.width as number}
            height={iconDimensions.height as number}
            color="pull-quote-accent"
            testID={`${dataTestId}-icon`}
          />
        </View>
      </View>

      <View style={styles.pullQuoteWrapper}>
        <ArticleQuote size={size}>{quote}</ArticleQuote>

        {(attribution || jobTitle) && (
          <View style={styles.caption}>
            {attribution && (
              <UtilityLabel
                size="medium"
                weight="semibold"
                dataTestId={`${dataTestId}-attribution`}
              >
                {attribution}
              </UtilityLabel>
            )}

            {jobTitle && (
              <UtilityLabel
                size="small"
                capitalize
                dataTestId={`${dataTestId}-job-title`}
                style={styles.jobTitle}
              >
                {jobTitle}
              </UtilityLabel>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: NativeTheme) => ({
  pullQuote: {
    flexDirection: 'row' as const,
    maxWidth: theme.semanticPullQuoteMaxWidth,
  } satisfies ViewStyle,
  variantStandard: {} satisfies ViewStyle,
  variantImmersive: {} satisfies ViewStyle,
  quoteIconWrapper: {
    justifyContent: 'flex-start' as const,
    alignItems: 'center' as const,
    flexShrink: 0,
  } satisfies ViewStyle,
  iconSmall: {
    width: theme.semanticPullQuoteIconSmallWidth,
    height: theme.semanticPullQuoteIconSmallHeight,
  } satisfies ViewStyle,
  iconLarge: {
    width: theme.semanticPullQuoteIconLargeWidth,
    height: theme.semanticPullQuoteIconLargeHeight,
  } satisfies ViewStyle,
  quoteIcon: {
    marginTop: getNumericValue(theme.semanticPullQuoteIconMarginTop),
  } satisfies ViewStyle,
  pullQuoteWrapper: {
    flex: 1,
    marginLeft: theme.spacing8,
    gap: theme.spacing20,
  } satisfies ViewStyle,
  caption: {
    borderTopWidth: 1,
    borderTopColor: theme.colorBorderOnLightStrong02,
    paddingTop: theme.spacing8,
    gap: theme.spacing4,
    alignSelf: 'flex-start' as const,
  } satisfies ViewStyle,
  jobTitle: {
    color: theme.colorTextOnLightTertiary,
  } satisfies TextStyle,
});

PullQuote.displayName = 'PullQuote';
