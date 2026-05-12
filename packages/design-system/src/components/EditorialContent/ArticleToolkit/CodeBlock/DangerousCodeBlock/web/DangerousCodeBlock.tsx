'use client';

import React, { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './DangerousCodeBlock.module.scss';
import type { BaseDangerousCodeBlockProps } from '../DangerousCodeBlock.types';
import { cleanMarkup } from '../DangerousCodeBlock.utils';

export type DangerousCodeBlockProps = BaseDangerousCodeBlockProps;

/**
 * DangerousCodeBlock renders raw HTML using React's
 * `dangerouslySetInnerHTML` and excutes any `<scripts> elements
 * contained within that markup.
 *
 * Security: The provided `markup` must come from a trusted source. This component
 * intentionally bypasses React's HTML escaping and can executes scripts.
 */
export const DangerousCodeBlock: React.FC<DangerousCodeBlockProps> = ({
  markup,
  variant = 'standard',
  cleanQuotes = true,
  className,
  dataTestId = 'dangerous-code-block',
  ...accessibilityProps
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const content = useMemo(() => {
    return cleanMarkup(markup, cleanQuotes);
  }, [markup, cleanQuotes]);

  const executeScripts = useCallback(() => {
    const el = elRef.current;

    if (!el) return;

    const scripts = el.querySelectorAll('script');
    if (scripts.length === 0) return;

    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');

      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }

      if (!newScript.defer) newScript.defer = true;

      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, []);

  useLayoutEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(executeScripts, 500);

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [content, executeScripts]);

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
      {...accessibilityProps}
    />
  );
};

DangerousCodeBlock.displayName = 'DangerousCodeBlock';
