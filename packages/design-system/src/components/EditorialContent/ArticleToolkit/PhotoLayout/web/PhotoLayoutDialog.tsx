import React from 'react';
import { Icon, Image } from '@/components/index.web';
import type { ImageData } from '../../types';
import styles from './PhotoLayout.module.scss';
import classNames from 'classnames';

interface PhotoLayoutDialogProps {
  image: ImageData;
  caption?: string;
  imageCredit?: string;
  imgixParams?: string;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}

export const PhotoLayoutDialog: React.FC<PhotoLayoutDialogProps> = ({
  image,
  caption,
  imageCredit,
  imgixParams,
  dialogRef,
  onClose,
}) => {
  const hasCaption = Boolean(caption?.trim());
  const hasCredit = Boolean(imageCredit?.trim());

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={image.altText}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        className={styles['dialog-close-button']}
        aria-label="Close expanded image"
        onClick={onClose}
      >
        <span className={styles['dialog-close-icon']} aria-hidden>
          <Icon name="close" color="on-dark-primary" />
        </span>
      </button>

      <div className={styles['dialog-content']}>
        <div className={styles['dialog-image-wrapper']}>
          <Image
            {...image}
            alt={image.altText}
            className={styles['dialog-image']}
            imgixParams={imgixParams}
            loading="eager"
            decoding="async"
          />
        </div>

        {(hasCaption || hasCredit) && (
          <aside className={styles['dialog-caption']} role="region" aria-label="Image information">
            {hasCaption && (
              <p
                className={classNames(
                  'typography-utility-label-small',
                  styles['dialog-caption-text']
                )}
              >
                {caption}
              </p>
            )}

            {hasCredit && (
              <div className={styles['dialog-credit-row']}>
                <Icon name="camera" className={styles['dialog-credit-icon']} />
                <span
                  className={classNames(
                    'typography-utility-label-small',
                    styles['dialog-credit-text']
                  )}
                >
                  {imageCredit}
                </span>
              </div>
            )}
          </aside>
        )}
      </div>
    </dialog>
  );
};

PhotoLayoutDialog.displayName = 'PhotoLayoutDialog';
