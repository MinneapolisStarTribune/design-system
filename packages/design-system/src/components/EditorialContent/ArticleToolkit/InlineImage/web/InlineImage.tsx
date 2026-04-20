'use client';

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import type { InlineImageProps } from '../InlineImage.types';
import styles from './InlineImage.module.scss';
import { InlineImageContent } from './InlineImageContent';
import { ImageDialog } from '../../shared/ImageDialog/ImageDialog';

export const InlineImage: React.FC<InlineImageProps> = ({
  expandable = false,
  image,
  caption,
  className,
  credit,
  dataTestId = 'inline-image',
  imgixParams,
  objectFit = 'cover',
  style,
  variant = 'standard',
  purchaseLink,
  ...accessibilityProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const captionText = [caption, credit && `(${credit})`].filter(Boolean).join(' ');

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
        className={classNames(styles['inline-image'], styles[`variant-${variant}`], className)}
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
            {purchaseLink && (
              <>
                <span className={styles['purchase-link-separator']}>•</span>
                <a href={purchaseLink} className={styles['purchase-link']}>
                  Buy Reprint
                </a>
              </>
            )}
          </figcaption>
        )}
      </figure>
      <ImageDialog
        image={image}
        caption={caption}
        credit={credit}
        imgixParams={imgixParams}
        dialogRef={dialogRef}
        isOpen={isOpen}
        onClose={onClose}
        dataTestId={`${dataTestId}-dialog`}
      />
    </>
  );
};

InlineImage.displayName = 'InlineImage';
