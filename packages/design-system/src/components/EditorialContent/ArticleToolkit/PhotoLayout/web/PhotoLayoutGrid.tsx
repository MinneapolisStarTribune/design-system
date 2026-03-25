import React from 'react';
import { Image } from '@/components/index.web';
import type { ImageData } from '../../types';
import styles from './PhotoLayout.module.scss';
import { ExpandButton } from '../../shared/ExpandButton/ExpandButton';

interface PhotoLayoutGridProps {
  images: ImageData[];
  expandable: boolean;
  dataTestId: string;
  imgixParams?: string;
  onExpand: (index: number, el: HTMLButtonElement) => void;
}

export const PhotoLayoutGrid: React.FC<PhotoLayoutGridProps> = ({
  images,
  expandable,
  dataTestId,
  imgixParams,
  onExpand,
}) => (
  <div className={styles.grid}>
    {images.map((img, index) => (
      <div key={`${img.src}-${index}`} className={styles.item}>
        <Image
          src={img.src}
          alt={img.altText}
          className={styles.image}
          imgixParams={imgixParams}
          loading="lazy"
          decoding="async"
          data-testid={`${dataTestId}-image-${index}`}
          tabIndex={0}
        />
        {expandable && (
          <ExpandButton
            onClick={(e) => onExpand(index, e.currentTarget)}
            ariaLabel={`Expand image ${index + 1} of ${images.length}`}
          />
        )}
      </div>
    ))}
  </div>
);

PhotoLayoutGrid.displayName = 'PhotoLayoutGrid';
