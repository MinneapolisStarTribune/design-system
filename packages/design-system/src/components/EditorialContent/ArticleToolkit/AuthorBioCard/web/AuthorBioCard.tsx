import React from 'react';
import classNames from 'classnames';

import { ChevronRightIcon, Image, Link } from '@/index.web';

import styles from './AuthorBioCard.module.scss';
import { AuthorBioCardProps } from '../AuthorBioCard.types';

export const AuthorBioCard: React.FC<AuthorBioCardProps> = ({
  label = 'ABOUT THE AUTHOR',
  name,
  description,
  thumbnailIcon,
  thumbnailIconAlt,
  headingLevel = 'h4',
  ctaLink,
  position,

  className,
  style,
  dataTestId,

  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-hidden': ariaHidden,
  hasTopBorder = false,
  hasBottomBorder = false,
}) => {
  const HeadingTag = headingLevel;

  const ctaLabel = ctaLink?.label?.trim() ? ctaLink.label : 'See More';
  const showCTA = Boolean(ctaLink && (ctaLink.link || ctaLink.onClick));
  const labelTypography = 'typography-utility-label-semibold-small-caps';
  const nameTypography = 'typography-utility-label-semibold-large';
  const positionTypography = 'typography-utility-label-small-caps';
  const descriptionTypography = 'typography-utility-text-regular-small';

  return (
    <div
      className={classNames(
        styles.root,
        hasTopBorder && styles.borderTop,
        hasBottomBorder && styles.borderBottom,
        className
      )}
      style={style}
      data-testid={dataTestId ?? 'author-bio-card'}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-hidden={ariaHidden}
    >
      {label && (
        <HeadingTag className={classNames(styles.heading, labelTypography)}>{label}</HeadingTag>
      )}

      <div className={styles.container}>
        {thumbnailIcon && (
          <div className={classNames(styles.imageWrapper, styles.imageCircle)}>
            <Image
              src={thumbnailIcon}
              alt={thumbnailIconAlt ?? 'Author thumbnail'}
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.content}>
          {name && <div className={classNames(nameTypography, styles.name)}>{name}</div>}

          {position && (
            <div className={classNames(positionTypography, styles.position)}>{position}</div>
          )}

          <div className={classNames(descriptionTypography, styles.description)}>{description}</div>

          {showCTA && (
            <Link
              href={ctaLink!.link}
              onClick={ctaLink!.onClick}
              size="small"
              icon={<ChevronRightIcon size="medium" />}
              iconPosition="end"
              dataTestId="author-bio-cta"
              aria-label={ctaLink!.label}
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

AuthorBioCard.displayName = 'AuthorBioCard';
