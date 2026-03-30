'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import type { PhotoLayoutType } from '../../types';
import type { PhotoLayoutProps } from '../PhotoLayout.types';
import { PhotoLayoutGrid } from './PhotoLayoutGrid';
import { ImageDialog } from '../../shared/ImageDialog/ImageDialog';
import styles from './PhotoLayout.module.scss';

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
  expandable = false,
  ...accessibilityProps
}) => {
  const images = useMemo(
    () => imageList.slice(0, layoutImageCount[photoLayout]),
    [imageList, photoLayout]
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const image = openIndex !== null ? images[openIndex] : null;
  const captionText = [caption, imageCredit && `(${imageCredit})`].filter(Boolean).join(' ');

  const onClose = () => {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  };

  const handleExpand = (index: number, el: HTMLButtonElement) => {
    lastTriggerRef.current = el;
    setOpenIndex(index);
  };

  return (
    <>
      <figure
        data-testid={dataTestId}
        className={classNames(
          styles['photo-layout'],
          styles[`layout-${photoLayout}`],
          styles[`variant-${variant}`],
          className
        )}
        {...accessibilityProps}
      >
        <PhotoLayoutGrid
          images={images}
          expandable={expandable}
          dataTestId={dataTestId}
          imgixParams={imgixParams}
          onExpand={handleExpand}
        />
        {captionText && (
          <figcaption
            className={classNames(styles['caption-text'], 'typography-utility-label-small')}
            data-testid={`${dataTestId}-caption`}
          >
            {captionText}
          </figcaption>
        )}
      </figure>

      {image && (
        <ImageDialog
          caption={caption}
          image={image}
          credit={imageCredit}
          imgixParams={imgixParams}
          dialogRef={dialogRef}
          isOpen={openIndex !== null}
          dataTestId={`${dataTestId}-dialog`}
          onClose={onClose}
        />
      )}
    </>
  );
};

PhotoLayout.displayName = 'PhotoLayout';
