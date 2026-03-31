'use client';

import React from 'react';
import classNames from 'classnames';
import type { InlineVideoProps } from '../InlineVideo.types';
import styles from './InlineVideo.module.scss';

export type { InlineVideoProps } from '../InlineVideo.types';

export const InlineVideo: React.FC<InlineVideoProps> = ({
  variant = 'standard',
  orientation = 'horizontal',
  caption,
  videoCredit,
  children,
  className,
  dataTestId = 'inline-video',
  ...accessibilityProps
}) => {
  const captionText = [caption, videoCredit].filter(Boolean).join(' ');

  return (
    <figure
      data-testid={dataTestId}
      className={classNames(styles['inline-video'], styles[`variant-${variant}`], className)}
      {...accessibilityProps}
    >
      <div
        className={classNames(styles['player-wrapper'], styles[`player-wrapper-${orientation}`])}
        data-testid={`${dataTestId}-player`}
      >
        {children}
      </div>

      {captionText && (
        <figcaption
          className={classNames(styles['caption'], 'typography-utility-label-small')}
          data-testid={`${dataTestId}-caption`}
        >
          {captionText}
        </figcaption>
      )}
    </figure>
  );
};

InlineVideo.displayName = 'InlineVideo';
