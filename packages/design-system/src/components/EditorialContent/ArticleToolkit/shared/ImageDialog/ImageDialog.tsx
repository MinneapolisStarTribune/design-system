import React from 'react';
import { Image } from '@/components/index.web';
import { CameraIcon, CloseIcon } from '@/icons';
import { type ImageData } from '../../types';
import styles from './ImageDialog.module.scss';
import classNames from 'classnames';

export interface ImageDialogProps {
  image: ImageData;
  caption?: string;
  credit?: string;
  imgixParams?: string;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  dataTestId?: string;
}

export const ImageDialog: React.FC<ImageDialogProps> = ({
  image,
  caption,
  credit,
  imgixParams,
  dialogRef,
  onClose,
  dataTestId = 'image-dialog',
}) => {
  const hasCaption = Boolean(caption?.trim());
  const hasCredit = Boolean(credit?.trim());

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
      data-testid={dataTestId}
    >
      <button
        type="button"
        className={styles['dialog-close-button']}
        aria-label="Close expanded image"
        onClick={onClose}
        data-testid={`${dataTestId}-close-button`}
      >
        <span className={styles['dialog-close-icon']} aria-hidden>
          <CloseIcon size="large" aria-hidden color="on-dark-primary" />
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
                <CameraIcon size="medium" aria-hidden className={styles['dialog-credit-icon']} />
                <span
                  className={classNames(
                    'typography-utility-label-small',
                    styles['dialog-credit-text']
                  )}
                >
                  {credit}
                </span>
              </div>
            )}
          </aside>
        )}
      </div>
    </dialog>
  );
};

ImageDialog.displayName = 'ImageDialog';
