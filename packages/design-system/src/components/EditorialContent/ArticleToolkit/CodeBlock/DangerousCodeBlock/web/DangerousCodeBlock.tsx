'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import styles from './DangerousCodeBlock.module.scss';
import type { BaseDangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import { activateScripts, cleanMarkup, neutralizeScripts } from '../DangerousCodeBlock.utils';

export type DangerousCodeBlockProps = BaseDangerousCodeBlockProps;

/**
 * Renders trusted raw HTML via `dangerouslySetInnerHTML` and runs any <script>
 * tags inside it.
 *
 * Scripts are held inert during render and run once on the client (see
 * neutralizeScripts / activateScripts), so a fresh server-rendered load doesn't
 * run them twice — the flash this component fixes.
 *
 * Security: `markup` must come from a trusted source; this bypasses React's
 * escaping and executes scripts.
 */
export const DangerousCodeBlock: React.FC<DangerousCodeBlockProps> = ({
  markup,
  variant = 'standard',
  cleanQuotes = true,
  className,
  style,
  dataTestId = 'dangerous-code-block',
  ...accessibilityProps
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  const content = useMemo(() => {
    return neutralizeScripts(cleanMarkup(markup, cleanQuotes));
  }, [markup, cleanQuotes]);

  // Keyed on content so unrelated re-renders don't re-run scripts — only new markup does.
  useEffect(() => {
    if (elRef.current) {
      activateScripts(elRef.current);
    }
  }, [content]);

  return (
    <div
      ref={elRef}
      data-testid={dataTestId}
      className={classNames(
        styles['dangerous-code-block'],
        styles[`variant-${variant}`],
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
      style={style}
      {...accessibilityProps}
    />
  );
};

DangerousCodeBlock.displayName = 'DangerousCodeBlock';
