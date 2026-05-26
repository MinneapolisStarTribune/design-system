'use client';

import React, { useEffect, useLayoutEffect } from 'react';
import { Caption, Image } from '@/components/index.web';
import { CloseIcon } from '@/icons';
import { type ImageData } from '../../types';
import styles from './ImageDialog.module.scss';

export interface ImageDialogProps {
  image: ImageData;
  caption?: string;
  credit?: string;
  imgixParams?: string;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  onClose: () => void;
  currentIndex?: number;
  totalItems?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  dataTestId?: string;
}

// Keep track of active scroll locks
const activeScrollLocks = new Set<string>();

const lockScroll = (modalId: string) => {
  activeScrollLocks.add(modalId);
  document.body.style.overflow = 'hidden';
};

const unlockScroll = (modalId: string) => {
  activeScrollLocks.delete(modalId);
  if (activeScrollLocks.size === 0) {
    document.body.style.overflow = '';
  }
};

export const ImageDialog: React.FC<ImageDialogProps> = ({
  image,
  caption,
  credit,
  imgixParams,
  dialogRef,
  isOpen,
  onClose,
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  dataTestId = 'image-dialog',
}) => {
  const hasCaptionContent = Boolean(
    caption?.trim() ||
      credit?.trim() ||
      typeof currentIndex === 'number' ||
      typeof totalItems === 'number' ||
      onPrevious ||
      onNext
  );
  const dialogTitleId = `${dataTestId}-title`;

  // Open/close the native dialog.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      lockScroll(dataTestId);
      return () => {
        unlockScroll(dataTestId);
      };
    }

    if (dialog.open) {
      dialog.close();
    }
    unlockScroll(dataTestId);
  }, [dataTestId, dialogRef, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
      unlockScroll(dataTestId);
    };
  }, [dataTestId, dialogRef]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={dialogTitleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      data-testid={dataTestId}
    >
      <h2 id={dialogTitleId} className={styles['dialog-title-sr-only']}>
        Expanded image view
      </h2>
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

      <figure className={styles['dialog-content']}>
        <div className={styles['dialog-image-wrapper']}>
          <Image
            src={image.src}
            alt={image.altText}
            width={image.width}
            height={image.height}
            className={styles['dialog-image']}
            imgixParams={imgixParams}
            loading="eager"
            decoding="async"
          />
        </div>

        {hasCaptionContent && (
          <Caption
            caption={caption}
            credit={credit}
            variant="lightbox"
            currentIndex={currentIndex}
            totalItems={totalItems}
            onPrevious={onPrevious}
            onNext={onNext}
            className={styles['dialog-caption']}
            dataTestId={`${dataTestId}-caption`}
          />
        )}
      </figure>
    </dialog>
  );
};

ImageDialog.displayName = 'ImageDialog';
