import React, { useMemo } from 'react';
import type { ArticleToolkitBaseProps, ImageData, PhotoLayoutType } from '../types';
import classNames from 'classnames';
import styles from './PhotoLayout.module.scss';
import { Image } from '@/components';

export interface PhotoLayoutProps extends ArticleToolkitBaseProps {
  caption?: string;
  imageList: ImageData[];
  photoLayout?: PhotoLayoutType;
  imageCredit?: string;
  imgixParams?: string;
  variant?: 'immersive'; // Restricting variant to 'immersive' for now, can be expanded in the future if needed
}

export const layoutImageCount: Record<PhotoLayoutType, number> = {
  '2up': 2,
  '3up': 3,
  '4up': 4,
};

export const PhotoLayout: React.FC<PhotoLayoutProps> = ({
  imageList,
  photoLayout = '2up',
  variant = 'immersive',
  className,
  caption,
  imageCredit,
  imgixParams,
  dataTestId = 'photo-layout',
  ...accessibilityProps
}) => {
  const images = useMemo(
    () => imageList.slice(0, layoutImageCount[photoLayout]),
    [imageList, photoLayout]
  );
  const captionText = caption
    ? `${caption}  ${imageCredit ? ` (${imageCredit})` : ''}`
    : imageCredit || '';

  return (
    <figure
      data-testid={dataTestId}
      className={classNames(
        styles.photoLayout,
        styles[`layout-${photoLayout}`],
        styles[`variant-${variant}`],
        className
      )}
      {...accessibilityProps}
    >
      <div className={styles.grid}>
        {images.map((image, index) => {
          return (
            <div key={`${image.src}-${index}`} className={classNames(styles.item)}>
              <Image
                src={image.src}
                alt={image.altText}
                className={styles.image}
                imgixParams={imgixParams}
                loading="lazy"
                decoding="async"
                data-testid={`${dataTestId}-image-${index}`}
                tabIndex={0}
              />
            </div>
          );
        })}
      </div>

      {captionText && (
        <figcaption
          className={classNames(styles.caption, 'typography-utility-label-small')}
          data-testid={`${dataTestId}-caption`}
        >
          {captionText}
        </figcaption>
      )}
    </figure>
  );
};

PhotoLayout.displayName = 'PhotoLayout';
