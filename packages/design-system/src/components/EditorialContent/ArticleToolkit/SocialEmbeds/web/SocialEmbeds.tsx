'use client';

import React, { useMemo } from 'react';
import classNames from 'classnames';
import styles from '../SocialEmbeds.module.scss';
import { SocialEmbedsProps } from '../SocialEmbed.types';

export const SocialEmbeds: React.FC<SocialEmbedsProps> = ({
  children,
  platform,
  variant = 'standard',
  className,
  dataTestId,
  ...restProps
}) => {
  const containerClass = useMemo(
    () =>
      classNames(
        styles.socialEmbeds,
        styles[`variant-${variant}`],
        platform && styles[`platform-${platform}`],
        className
      ),
    [variant, platform, className]
  );

  return (
    <div
      data-testid={dataTestId || 'social-embeds'}
      data-platform={platform}
      className={containerClass}
      {...restProps}
    >
      <div className={styles.embedContainer}>{children}</div>
    </div>
  );
};

SocialEmbeds.displayName = 'SocialEmbeds';
