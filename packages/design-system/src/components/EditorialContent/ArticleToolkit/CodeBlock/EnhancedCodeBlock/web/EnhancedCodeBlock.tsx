import React from 'react';
import classNames from 'classnames';
import { DangerousCodeBlock } from '../../DangerousCodeBlock/web/DangerousCodeBlock';
import styles from './EnhancedCodeBlock.module.scss';
import type { EnhancedCodeBlockProps } from '../EnhancedCodeBlock.types';

/**
 * EnhancedCodeBlock wraps `DangerousCodeBlock` and applies `size` × `variant` styles
 * specific to enhanced code block layouts.
 */
export const EnhancedCodeBlock: React.FC<EnhancedCodeBlockProps> = ({
  size = 'full',
  variant = 'standard',
  cleanQuotes = true,
  dataTestId = 'enhanced-code-block',
  ...rest
}) => {
  return (
    <DangerousCodeBlock
      className={classNames(
        styles['enhanced-code-block'],
        styles[`variant-${variant}`],
        !cleanQuotes && styles[`size-${size}`]
      )}
      variant={variant}
      cleanQuotes={cleanQuotes}
      dataTestId={dataTestId}
      {...rest}
    />
  );
};

EnhancedCodeBlock.displayName = 'EnhancedCodeBlock';
