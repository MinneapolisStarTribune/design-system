import React from 'react';
import { Image } from '@/index.web';
import { ExpandButton } from '../../shared/ExpandButton/ExpandButton';
import { type ImageData } from '../../types';
import styles from './InlineImage.module.scss';

interface InlineImageContentProps {
  images: ImageData[];
  imgixParams?: string;
  expandable?: boolean;
  onExpand: (index: number, el: HTMLButtonElement) => void;
  dataTestId: string;
  style?: React.CSSProperties;
  objectFit?: 'cover' | 'contain';
}

export const InlineImageContent: React.FC<InlineImageContentProps> = ({
  images,
  imgixParams,
  expandable,
  onExpand,
  dataTestId,
  style,
  objectFit = 'cover',
}) => {
  return (
    <div className={styles['image-wrapper']}>
      {images.map((img, index) => (
        <div
          key={`${img.src}-${index}`}
          className={styles['image-container']}
          data-test-id={`${dataTestId}-image-container`}
        >
          <Image
            src={img.src}
            alt={img.altText}
            imgixParams={imgixParams}
            className={styles.image}
            loading="lazy"
            decoding="async"
            dataTestId={`${dataTestId}-image`}
            style={{ ...style, objectFit }}
          />
          {expandable && <ExpandButton onClick={(e) => onExpand(index, e.currentTarget)} />}
        </div>
      ))}
    </div>
  );
};
