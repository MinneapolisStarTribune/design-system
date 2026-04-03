import React from 'react';
import type { PullQuoteProps } from '../PullQuote.types';
import styles from './PullQuote.module.scss';
import classNames from 'classnames';
import { QuoteIcon } from '@/index.web';
import { ArticleQuote } from '@/components/Typography/ArticleBody/ArticleQuote/web/ArticleQuote';

export type { PullQuoteProps } from '../PullQuote.types';

export const PullQuote: React.FC<PullQuoteProps> = ({
  quote,
  attribution,
  jobTitle,
  isLongQuote = false,
  align = 'left',
  className,
  dataTestId = 'pull-quote',
  variant,
  ...accessibilityProps
}) => {
  if (!quote) return null;

  return (
    <div
      className={classNames(
        styles['pull-quote'],
        styles[`align-${align}`],
        styles[`variant-${variant}`],
        className
      )}
      data-testid={dataTestId}
      {...accessibilityProps}
    >
      <span className={styles['quote-icon-wrapper']} aria-hidden="true">
        <QuoteIcon aria-hidden="true" className={styles['quote-icon']} />
      </span>
      <div className={styles['pull-quote-wrapper']}>
        <ArticleQuote size={isLongQuote ? 'large' : 'small'}>{quote}</ArticleQuote>

        {(attribution || jobTitle) && (
          <div className={styles.caption}>
            {attribution && (
              <div className={styles.attribution} data-testid={`${dataTestId}-attribution`}>
                {attribution}
              </div>
            )}
            {jobTitle && (
              <div className={styles.jobTitle} data-testid={`${dataTestId}-job-title`}>
                {jobTitle}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

PullQuote.displayName = 'PullQuote';
