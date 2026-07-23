'use client';

import React, { useEffect, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { Caption, Image } from '@/components/index.web';
import { CloseIcon } from '@/icons';
import type { CtaLinkProps } from '@/types';
import { hasPurchaseLink } from '../PurchaseLink/resolvePurchaseLink';
import { type ImageData } from '../../types';
import styles from './ImageDialog.module.scss';

export interface ImageDialogProps {
  image: ImageData;
  caption?: string;
  credit?: string;
  imgixParams?: string;
  aspectRatio?: string;
  purchaseLink?: CtaLinkProps;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  onClose: () => void;
  currentIndex?: number;
  totalItems?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  loopNavigation?: boolean;
  dataTestId?: string;
  /** Applied to the dialog's close button, alongside its default styles. */
  closeButtonClassName?: string;
  /** Applied to the previous/next navigation buttons rendered by the dialog's Caption. */
  navButtonClassName?: string;
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
  aspectRatio,
  purchaseLink,
  dialogRef,
  isOpen,
  onClose,
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  loopNavigation = false,
  dataTestId = 'image-dialog',
  closeButtonClassName,
  navButtonClassName,
}) => {
  const hasCaptionContent = Boolean(
    caption?.trim() ||
      credit?.trim() ||
      hasPurchaseLink(purchaseLink) ||
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
        className={classNames(styles['dialog-close-button'], closeButtonClassName)}
        aria-label="Close expanded image"
        onClick={onClose}
        data-testid={`${dataTestId}-close-button`}
      >
        <span className={styles['dialog-close-icon']} aria-hidden>
          <CloseIcon size="large" aria-hidden color="on-dark-primary" />
        </span>
      </button>

      <figure className={styles['dialog-content']}>
        <div
          className={styles['dialog-image-wrapper']}
          style={aspectRatio ? { aspectRatio } : undefined}
        >
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
            purchaseLink={purchaseLink}
            variant="lightbox"
            currentIndex={currentIndex}
            totalItems={totalItems}
            onPrevious={onPrevious}
            onNext={onNext}
            loopNavigation={loopNavigation}
            className={styles['dialog-caption']}
            navButtonClassName={navButtonClassName}
            dataTestId={`${dataTestId}-caption`}
          />
        )}
      </figure>
    </dialog>
  );
};

ImageDialog.displayName = 'ImageDialog';
