import React, { useMemo } from 'react';
import {
  Linking,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Button } from '@/components/Button/native/Button.native';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/native/UtilityBody.native';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/native/UtilityLabel.native';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon } from '@/icons/index.native';
import type { CaptionNativeProps } from '../Caption.types';
import { createCaptionStyles } from './Caption.styles';

const TABLET_BREAKPOINT = 768;
const DESKTOP_NAV_BREAKPOINT = 1160;

const renderCaptionNode = (value: React.ReactNode): React.ReactNode => {
  if (value === null || value === undefined || value === false) {
    return null;
  }
  return value;
};

export const Caption: React.FC<CaptionNativeProps> = ({
  caption,
  credit,
  purchaseLink,
  variant = 'inline',
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  loopNavigation = false,
  analytics: analyticsOverride,
  onPurchaseLinkClick,
  onNavigationClick,
  dataTestId = 'caption',
  style,
  ...accessibilityProps
}) => {
  const { width } = useWindowDimensions();
  const { track } = useAnalytics();
  const isLightbox = variant === 'lightbox';
  const isCompactLayout = width < TABLET_BREAKPOINT;
  const navButtonSize = width < DESKTOP_NAV_BREAKPOINT ? 'small' : 'large';

  const styles = useNativeStyles((theme) => createCaptionStyles(theme, variant));

  const hasNavigation =
    Boolean(totalItems && totalItems > 1) && (Boolean(onPrevious) || Boolean(onNext));

  const hasPagination = typeof currentIndex === 'number' && typeof totalItems === 'number';

  const canGoPrevious = loopNavigation || (hasPagination && currentIndex > 1);
  const canGoNext = loopNavigation || (hasPagination && currentIndex < totalItems);

  const showPurchaseLink = Boolean(purchaseLink?.link);

  const hasTopRowContent = caption || credit || showPurchaseLink || (!isLightbox && hasNavigation);

  const hasBottomRowContent = isLightbox && (hasPagination || hasNavigation);

  const captionContent = useMemo(() => renderCaptionNode(caption), [caption]);
  const creditContent = useMemo(() => renderCaptionNode(credit), [credit]);

  if (!captionContent && !creditContent && !showPurchaseLink && !hasNavigation) {
    return null;
  }

  const handlePrevious = () => {
    onNavigationClick?.('previous');
    onPrevious?.();
  };

  const handleNext = () => {
    onNavigationClick?.('next');
    onNext?.();
  };

  const handlePurchasePress = async () => {
    track({
      event: 'link_click',
      component: 'Caption',
      label: purchaseLink?.label ?? 'Buy Reprint',
      cta_type: 'buy_reprint',
      href: purchaseLink?.link,
      variant,
      ...analyticsOverride,
    });

    purchaseLink?.onPress?.();
    onPurchaseLinkClick?.();

    if (!purchaseLink?.link) {
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(purchaseLink.link);
      if (!canOpen) {
        return;
      }
      await Linking.openURL(purchaseLink.link);
    } catch (error) {
      console.warn('Failed to open purchase link', error);
    }
  };

  const renderNavigation = () => {
    if (!hasNavigation) {
      return null;
    }

    const previousIndex = loopNavigation
      ? (currentIndex ?? 1) === 1
        ? (totalItems ?? 1)
        : (currentIndex ?? 1) - 1
      : Math.max((currentIndex ?? 1) - 1, 1);
    const nextIndex = loopNavigation
      ? (currentIndex ?? 1) === (totalItems ?? 1)
        ? 1
        : (currentIndex ?? 1) + 1
      : Math.min((currentIndex ?? 1) + 1, totalItems ?? 1);

    return (
      <View style={styles.navigation}>
        <Button
          variant="ghost"
          surface={isLightbox ? 'dark' : 'light'}
          size={navButtonSize}
          icon={<ChevronLeftIcon />}
          onPress={handlePrevious}
          isDisabled={!canGoPrevious}
          style={styles.navButton}
          testID={`${dataTestId}-previous`}
          accessibilityLabel={`Previous image (${previousIndex} of ${totalItems})`}
        />
        <Button
          variant="ghost"
          surface={isLightbox ? 'dark' : 'light'}
          size={navButtonSize}
          icon={<ChevronRightIcon />}
          onPress={handleNext}
          isDisabled={!canGoNext}
          style={styles.navButton}
          testID={`${dataTestId}-next`}
          accessibilityLabel={`Next image (${nextIndex} of ${totalItems})`}
        />
      </View>
    );
  };

  const showInlineCredit = !isLightbox && creditContent;
  const showCaptionLine = captionContent || showInlineCredit || showPurchaseLink;

  const renderCaptionRowContent = () => (
    <>
      {(captionContent || showInlineCredit) && (
        <>
          {captionContent}
          {showInlineCredit ? (
            <>
              {captionContent ? ' ' : null}({creditContent})
            </>
          ) : null}
        </>
      )}

      {showPurchaseLink ? (
        <>
          {(captionContent || showInlineCredit) && (
            <Text
              style={styles.purchaseLinkSeparator}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              •
            </Text>
          )}
          <Text
            style={styles.purchaseLinkText}
            accessibilityRole="link"
            accessibilityLabel={purchaseLink?.label ?? 'Buy Reprint'}
            onPress={handlePurchasePress}
            testID={`${dataTestId}-purchase-link`}
          >
            {purchaseLink?.label ?? 'Buy Reprint'}
          </Text>
        </>
      ) : null}
    </>
  );

  return (
    <View
      testID={dataTestId}
      style={[styles.root, style as StyleProp<ViewStyle>]}
      accessibilityLabel={accessibilityProps['aria-label']}
      accessibilityElementsHidden={accessibilityProps['aria-hidden']}
      importantForAccessibility={accessibilityProps['aria-hidden'] ? 'no-hide-descendants' : 'auto'}
    >
      {hasTopRowContent ? (
        <View style={styles.topRow}>
          <View style={styles.captionRow}>
            {showCaptionLine ? (
              isLightbox ? (
                <UtilityBody
                  size="small"
                  weight="regular"
                  style={styles.captionText}
                  dataTestId={`${dataTestId}-caption`}
                >
                  {renderCaptionRowContent()}
                </UtilityBody>
              ) : (
                <UtilityLabel
                  size="small"
                  weight="regular"
                  style={styles.captionText}
                  dataTestId={`${dataTestId}-caption`}
                >
                  {renderCaptionRowContent()}
                </UtilityLabel>
              )
            ) : null}
          </View>

          {!isLightbox ? renderNavigation() : null}
        </View>
      ) : null}

      {isLightbox && creditContent ? (
        <View style={styles.creditRow} testID={`${dataTestId}-credit`}>
          <View accessibilityElementsHidden importantForAccessibility="no">
            <CameraIcon color="on-dark-tertiary" size="medium" />
          </View>
          <UtilityLabel size="small" weight="regular" style={styles.creditText}>
            {creditContent}
          </UtilityLabel>
        </View>
      ) : null}

      {hasBottomRowContent ? (
        <View style={[styles.bottomRow, isCompactLayout && styles.bottomRowMobile]}>
          {hasPagination ? (
            <View
              accessibilityLiveRegion="polite"
              accessibilityLabel={`Image ${currentIndex} of ${totalItems}`}
            >
              <UtilityLabel
                size="large"
                weight="semibold"
                style={styles.pagination}
                dataTestId={`${dataTestId}-pagination`}
              >
                {currentIndex}/{totalItems}
              </UtilityLabel>
            </View>
          ) : (
            <View style={styles.paginationSpacer} />
          )}

          {renderNavigation()}
        </View>
      ) : null}
    </View>
  );
};

Caption.displayName = 'Caption';
