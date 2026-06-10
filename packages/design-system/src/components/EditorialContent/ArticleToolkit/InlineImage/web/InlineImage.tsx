'use client';

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Caption } from '@/index.web';
import type { InlineImageProps } from '../InlineImage.types';
import styles from './InlineImage.module.scss';
import { InlineImageContent } from './InlineImageContent';
import { ImageDialog } from '../../shared/ImageDialog/ImageDialog';
import { resolvePurchaseLink } from '../../shared/PurchaseLink/resolvePurchaseLink';

export const InlineImage: React.FC<InlineImageProps> = ({
  expandable = false,
  image,
  purchaseLink,
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

  const onExpand = (el: HTMLButtonElement) => {
    lastTriggerRef.current = el;
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    lastTriggerRef.current?.focus();
  };
  const resolvedPurchaseLink = resolvePurchaseLink(purchaseLink);

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
        <Caption
          caption={caption}
          credit={credit}
          variant="inline"
          purchaseLink={resolvedPurchaseLink}
          dataTestId={`${dataTestId}-caption`}
        />
      </figure>
      <ImageDialog
        image={image}
        caption={caption}
        credit={credit}
        purchaseLink={resolvedPurchaseLink}
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
