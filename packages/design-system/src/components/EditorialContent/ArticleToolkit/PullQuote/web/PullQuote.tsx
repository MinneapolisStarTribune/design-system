import React from 'react';
import type { PullQuoteProps } from '../PullQuote.types';
import styles from './PullQuote.module.scss';
import classNames from 'classnames';
import { QuoteIcon, ArticleQuote, UtilityLabel } from '@/index.web';

export type { PullQuoteProps } from '../PullQuote.types';

export const PullQuote: React.FC<PullQuoteProps> = ({
  quote,
  attribution,
  jobTitle,
  className,
  variant = 'immersive',
  size = 'large',
  dataTestId = 'pull-quote',
  ...accessibilityProps
}) => {
  if (!quote) return null;

  if (variant === 'standard') {
    return (
      <div data-testid={dataTestId}>
        Pull Quotes are not supported in the standard variant. Please use the immersive variant
        instead.
      </div>
    );
  }

  return (
    <div
      className={classNames(
        styles['pull-quote'],
        {
          [styles['immersive']]: variant === 'immersive',
        },
        className
      )}
      data-testid={dataTestId}
      {...accessibilityProps}
    >
      <span className={styles['quote-icon-wrapper']}>
        <QuoteIcon
          aria-hidden="true"
          className={classNames(styles['quote-icon'], styles[`size-${size}`])}
        />
      </span>
      <div className={styles['pull-quote-wrapper']}>
        <ArticleQuote size={size}>{quote}</ArticleQuote>

        {(attribution || jobTitle) && (
          <div className={styles.caption}>
            {attribution && (
              <UtilityLabel
                size="medium"
                weight="semibold"
                data-testid={`${dataTestId}-attribution`}
              >
                {attribution}
              </UtilityLabel>
            )}
            {jobTitle && (
              <UtilityLabel
                size="small"
                capitalize={true}
                data-testid={`${dataTestId}-job-title`}
                className={styles['job-title']}
              >
                {jobTitle}
              </UtilityLabel>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

PullQuote.displayName = 'PullQuote';
