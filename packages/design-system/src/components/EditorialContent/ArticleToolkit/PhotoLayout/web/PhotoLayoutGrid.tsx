import React from 'react';
import { Icon, Image } from '@/components/index.web';
import type { ImageData } from '../../types';
import styles from './PhotoLayout.module.scss';

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
          <button
            type="button"
            className={styles['expand-button']}
            aria-label={`Expand image ${index + 1} of ${images.length}`}
            aria-haspopup="dialog"
            onClick={(e) => onExpand(index, e.currentTarget)}
          >
            <span className={styles['expand-icon']} aria-hidden>
              <Icon name="expand" color="on-dark-secondary" />
            </span>
          </button>
        )}
      </div>
    ))}
  </div>
);

PhotoLayoutGrid.displayName = 'PhotoLayoutGrid';
