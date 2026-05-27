'use client';

import React from 'react';
import classNames from 'classnames';
import { Caption } from '@/index.web';
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
  return (
    <figure
      data-testid={dataTestId}
      className={classNames(
        styles['inline-video'],
        styles[`variant-${variant}`],
        styles[`orientation-${orientation}`],
        className
      )}
      {...accessibilityProps}
    >
      <div className={classNames(styles['player-wrapper'])} data-testid={`${dataTestId}-player`}>
        {children}
      </div>

      <Caption
        caption={caption}
        credit={videoCredit}
        variant="inline"
        className={styles.caption}
        dataTestId={`${dataTestId}-caption`}
      />
    </figure>
  );
};

InlineVideo.displayName = 'InlineVideo';
