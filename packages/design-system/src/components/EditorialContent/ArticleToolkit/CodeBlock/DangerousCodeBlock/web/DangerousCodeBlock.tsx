import React, { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './DangerousCodeBlock.module.scss';
import type { DangerousCodeBlockProps } from '../DangerousCodeBlock.types';

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
  size,
  className,
  dataTestId = 'dangerous-code-block',
  ...accessibilityProps
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanMarkup = useCallback(
    (html: string): string => {
      if (!html || !cleanQuotes) return html ?? '';

      let cleaned = html.replace(/[’‘]/g, "'");
      cleaned = cleaned.replace(/[“”″]/g, '"');

      return cleaned;
    },
    [cleanQuotes]
  );

  const content = useMemo(() => {
    return cleanMarkup(markup);
  }, [markup, cleanMarkup]);

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

  const sizeClass = !cleanQuotes && size ? styles[`size-${size}`] : undefined;

  return (
    <div
      ref={elRef}
      data-testid={dataTestId}
      className={classNames(
        styles['dangerous-code-block'],
        styles[`variant-${variant}`],
        sizeClass,
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
      {...accessibilityProps}
    />
  );
};

DangerousCodeBlock.displayName = 'DangerousCodeBlock';
