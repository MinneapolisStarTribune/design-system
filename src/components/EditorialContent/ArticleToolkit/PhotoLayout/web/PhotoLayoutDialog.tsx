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
  const hasCaption = caption && caption.trim() !== '';
  const hasCredit = imageCredit && imageCredit.trim() !== '';

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={image.altText}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Close expanded image"
        onClick={onClose}
      >
        <span className={styles.closeIcon} aria-hidden>
          <Icon name="close" color="on-dark-primary" />
        </span>
      </button>

      <div className={styles.dialogContent}>
        <div className={styles.dialogImageWrapper}>
          <Image
            {...image}
            alt={image.altText}
            className={styles.dialogImage}
            imgixParams={imgixParams}
          />
        </div>

        {(hasCaption || hasCredit) && (
          <aside className={styles.dialogCaption} role="region" aria-label="Image information">
            {hasCaption && <p className="typography-utility-label-small">{caption}</p>}

            {hasCredit && (
              <div className={styles.creditRow}>
                <Icon name="camera" className={styles.creditIcon} />
                <span className={classNames('typography-utility-label-small', styles.creditText)}>
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
