import React, { useMemo, useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import type { ArticleToolkitBaseProps, ImageData, PhotoLayoutType } from '../../types';
import { PhotoLayoutGrid } from './PhotoLayoutGrid';
import { PhotoLayoutDialog } from './PhotoLayoutDialog';
import styles from './PhotoLayout.module.scss';

export interface PhotoLayoutProps extends ArticleToolkitBaseProps {
  caption?: string;
  imageList: ImageData[];
  photoLayout?: PhotoLayoutType;
  imageCredit?: string;
  imgixParams?: string;
  variant?: 'immersive'; // Restricting variant to 'immersive' for now, can be expanded in the future if needed
  expandable?: boolean;
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (image) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = '';
    };
  }, [image]);

  const close = () => {
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
          openIndex={openIndex}
          dataTestId={dataTestId}
          imgixParams={imgixParams}
          lastTriggerRef={lastTriggerRef}
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
        <PhotoLayoutDialog
          caption={caption}
          image={image}
          imageCredit={imageCredit}
          imgixParams={imgixParams}
          dialogRef={dialogRef}
          onClose={close}
        />
      )}
    </>
  );
};

PhotoLayout.displayName = 'PhotoLayout';
