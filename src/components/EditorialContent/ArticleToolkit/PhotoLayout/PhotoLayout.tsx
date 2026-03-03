import React, { useMemo } from 'react';
import type { ArticleToolkitBaseProps, ImageData, PhotoLayoutType } from '../types';
import classNames from 'classnames';
import styles from './PhotoLayout.module.scss';
import { getImageList } from './utils';

export interface PhotoLayoutProps extends ArticleToolkitBaseProps {
  photoLayoutCaption?: string;
  imageList: ImageData[];
  photoLayout?: PhotoLayoutType;
  expandable?: boolean;
  imgixBaseUrl?: string;
  onExpand?: (index: number) => void;
}

export const PhotoLayout: React.FC<PhotoLayoutProps> = ({
  imageList,
  photoLayout = '2up',
  variant = 'immersive',
  expandable = false,
  onExpand,
  className,
  photoLayoutCaption,
  dataTestId = 'photo-layout',
  ...accessibilityProps
}) => {
  // Restrict variant
  if (variant !== 'immersive') {
    console.warn('PhotoLayout currently supports only immersive variant');
  }

  const images = useMemo(() => getImageList(imageList, photoLayout), [imageList, photoLayout]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!expandable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onExpand?.(index);
    }
  };

  return (
    <figure
      data-testid={dataTestId}
      className={classNames(styles.photoLayout, styles[`layout--${photoLayout}`], className)}
      {...accessibilityProps}
    >
      <div className={styles.grid}>
        {images.map((image, index) => {
          return (
            <div
              key={`${image.src}-${index}`}
              className={classNames(styles.item, {
                [styles.expandableItem]: expandable,
              })}
              tabIndex={expandable ? 0 : undefined}
              role={expandable ? 'button' : undefined}
              onClick={expandable ? () => onExpand?.(index) : undefined}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <img
                src={image.src}
                alt={image.altText}
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
            </div>
          );
        })}
      </div>

      {photoLayoutCaption && (
        <figcaption
          className={classNames(styles.caption, 'typography-utility-label-small')}
          data-testid={`${dataTestId}-caption`}
        >
          {photoLayoutCaption}
        </figcaption>
      )}
    </figure>
  );
};

PhotoLayout.displayName = 'PhotoLayout';
