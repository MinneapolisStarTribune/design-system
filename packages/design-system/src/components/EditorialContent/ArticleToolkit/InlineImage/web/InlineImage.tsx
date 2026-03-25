import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { InlineImageProps } from '../InlineImage.types';
import styles from './InlineImage.module.scss';
import { InlineImageContent } from './InlineImageContent';
import { ImageDialog } from '../../shared/ImageDialog/ImageDialog';

export const InlineImage: React.FC<InlineImageProps> = ({
  expandable = false,
  image,
  size = 'medium',
  caption,
  className,
  credit,
  dataTestId = 'inline-image',
  imgixParams,
  objectFit = 'cover',
  style,
  variant = 'standard',
  ...accessibilityProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const captionText = [caption, credit && `(${credit})`].filter(Boolean).join(' ');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
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
  }, [isOpen]);

  const onExpand = (el: HTMLButtonElement) => {
    lastTriggerRef.current = el;
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    lastTriggerRef.current?.focus();
  };
  return (
    <>
      <figure
        data-testid={dataTestId}
        className={classNames(
          styles['inline-image'],
          styles[`size-${size}`],
          styles[`variant-${variant}`],
          className
        )}
        {...accessibilityProps}
      >
        <InlineImageContent
          image={image}
          imgixParams={imgixParams}
          expandable={expandable}
          onExpand={onExpand}
          dataTestId={dataTestId}
          style={style}
          objectFit={objectFit}
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
      <ImageDialog
        image={image}
        caption={caption}
        credit={credit}
        imgixParams={imgixParams}
        dialogRef={dialogRef}
        onClose={onClose}
      />
    </>
  );
};

InlineImage.displayName = 'InlineImage';
