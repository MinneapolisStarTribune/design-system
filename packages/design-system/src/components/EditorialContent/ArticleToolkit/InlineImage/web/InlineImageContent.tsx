import React from 'react';
import { Image } from '@/index.web';
import { ExpandButton } from '../../shared/ExpandButton/ExpandButton';
import { type ImageData } from '../../types';
import styles from './InlineImage.module.scss';

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

      {expandable && <ExpandButton onClick={(e) => onExpand(e.currentTarget)} />}
    </div>
  );
};
