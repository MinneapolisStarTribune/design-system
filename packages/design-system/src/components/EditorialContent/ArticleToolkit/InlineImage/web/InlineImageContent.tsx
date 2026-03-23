import { ExpandIcon, Image } from '@/index.web';
import styles from './InlineImage.module.scss';
import { ImageData } from '../../types';
import React from 'react';

interface InlineImageContentProps {
  image: ImageData;
  imgixParams?: string;
  expandable?: boolean;
  onExpand: (e: HTMLButtonElement) => void;
  dataTestId: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain';
}

export const InlineImageContent: React.FC<InlineImageContentProps> = ({
  image,
  imgixParams,
  expandable,
  onExpand,
  dataTestId,
  style,
  objectFit = 'cover',
}) => {
  return (
    <div className={styles['image-wrapper']}>
      <Image
        src={image.src}
        alt={image.altText}
        imgixParams={imgixParams}
        className={styles.image}
        loading="lazy"
        decoding="async"
        dataTestId={`${dataTestId}-image`}
        style={{ ...style, objectFit }}
      />

      {expandable && (
        <button
          type="button"
          className={styles['expand-button']}
          aria-label="Expand image"
          aria-haspopup="dialog"
          onClick={(e) => onExpand(e.currentTarget)}
        >
          <span className={styles['expand-icon']} aria-hidden>
            <ExpandIcon size="small" aria-hidden color="on-dark-primary" />
          </span>
        </button>
      )}
    </div>
  );
};
