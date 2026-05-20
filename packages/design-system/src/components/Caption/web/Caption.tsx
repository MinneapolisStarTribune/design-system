'use client';

import React from 'react';
import classNames from 'classnames';

import { ChevronLeftIcon, ChevronRightIcon, CameraIcon } from '@/icons';
import { useAnalytics } from '@/hooks/useAnalytics';

import type { CaptionProps } from '../Caption.types';
import styles from './Caption.module.scss';
import { Button } from '@/index.web';

export const Caption: React.FC<CaptionProps> = ({
  caption,
  credit,
  purchaseLink,
  variant = 'inline',
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  analytics: analyticsOverride,
  onPurchaseLinkClick,
  onNavigationClick,
  className,
  dataTestId = 'caption',
  ...accessibilityProps
}) => {
  const { track } = useAnalytics();
  const isLightbox = variant === 'lightbox';

  const hasNavigation =
    Boolean(totalItems && totalItems > 1) && (Boolean(onPrevious) || Boolean(onNext));

  const hasPagination = typeof currentIndex === 'number' && typeof totalItems === 'number';

  const canGoPrevious = hasPagination && currentIndex > 1;

  const canGoNext = hasPagination && currentIndex < totalItems;

  const handlePrevious = () => {
    onNavigationClick?.('previous');
    onPrevious?.();
  };

  const handleNext = () => {
    onNavigationClick?.('next');
    onNext?.();
  };

  const handlePurchaseClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    track({
      event: 'link_click',
      component: 'Caption',
      label: purchaseLink?.label ?? 'Buy Reprint',
      cta_type: 'buy_reprint',
      href: purchaseLink?.link,
      variant,
      ...analyticsOverride,
    });
    purchaseLink?.onClick?.(event);
    onPurchaseLinkClick?.(event);
  };

  const renderNavigation = () => {
    if (!hasNavigation) return null;

    return (
      <div className={styles.navigation}>
        <Button
          variant="ghost"
          surface={isLightbox ? 'dark' : 'light'}
          size="large"
          icon={<ChevronLeftIcon />}
          onClick={handlePrevious}
          isDisabled={!canGoPrevious}
          className={styles.navButton}
          aria-label={`Previous image (${Math.max((currentIndex ?? 1) - 1, 1)} of ${totalItems})`}
        />

        <Button
          variant="ghost"
          surface={isLightbox ? 'dark' : 'light'}
          size="large"
          icon={<ChevronRightIcon />}
          onClick={handleNext}
          isDisabled={!canGoNext}
          className={styles.navButton}
          aria-label={`Next image (${Math.min(
            (currentIndex ?? 1) + 1,
            totalItems ?? 1
          )} of ${totalItems})`}
        />
      </div>
    );
  };

  const hasTopRowContent =
    caption || credit || purchaseLink?.link || (!isLightbox && hasNavigation);

  const hasBottomRowContent = isLightbox && (hasPagination || hasNavigation);

  if (!caption && !credit && !purchaseLink?.link && !hasNavigation) {
    return null;
  }

  return (
    <figcaption
      data-testid={dataTestId}
      className={classNames(
        styles.caption,
        styles[`variant-${variant}`],
        'typography-utility-label-small',
        className
      )}
      {...accessibilityProps}
    >
      {hasTopRowContent && (
        <div className={styles['top-row']}>
          <div className={styles['caption-row']}>
            {(caption || (!isLightbox && credit)) && (
              <span className={styles['caption-text']} data-testid={`${dataTestId}-caption`}>
                {caption}
                {!isLightbox && credit && (
                  <>
                    {caption ? ' ' : null}({credit})
                  </>
                )}
              </span>
            )}

            {purchaseLink?.link && (
              <>
                {(caption || (!isLightbox && credit)) && (
                  <span className={styles['purchase-link-separator']}>•</span>
                )}

                <a
                  href={purchaseLink.link}
                  className={styles['purchase-link']}
                  onClick={handlePurchaseClick}
                  data-testid={`${dataTestId}-purchase-link`}
                >
                  {purchaseLink.label ?? 'Buy Reprint'}
                </a>
              </>
            )}
          </div>

          {!isLightbox && renderNavigation()}
        </div>
      )}

      {isLightbox && credit && (
        <div className={styles['credit-row']} data-testid={`${dataTestId}-credit`}>
          <CameraIcon size="medium" aria-hidden className={styles['credit-icon']} />
          <span>{credit}</span>
        </div>
      )}

      {hasBottomRowContent && (
        <div className={styles['bottom-row']}>
          {hasPagination ? (
            <div
              className={styles.pagination}
              data-testid={`${dataTestId}-pagination`}
              aria-live="polite"
              aria-atomic="true"
            >
              {currentIndex}/{totalItems}
            </div>
          ) : (
            <div />
          )}

          {renderNavigation()}
        </div>
      )}
    </figcaption>
  );
};

Caption.displayName = 'Caption';
