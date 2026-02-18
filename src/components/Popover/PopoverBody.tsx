import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mantine/core';
import classNames from 'classnames';
import styles from './Popover.module.scss';

export const PopoverBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);
  const [atTop, setAtTop] = useState(true);

  // Config: tweak threshold for when we consider "at top"
  const TOP_THRESHOLD = 1; // px

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateAtTop = () => {
      const isAtTop = el.scrollTop <= TOP_THRESHOLD;
      setAtTop((prev) => (prev !== isAtTop ? isAtTop : prev));
    };

    // rAF-throttled scroll handler to reduce state churn
    const onScroll = () => {
      if (rafId.current != null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        updateAtTop();
      });
    };

    // Initialize once on mount
    updateAtTop();

    el.addEventListener('scroll', onScroll, { passive: true });

    // Keep state in sync on layout/content changes
    const ro = new ResizeObserver(updateAtTop);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <Box ref={ref} className={classNames(styles.body, { [styles.bodyAtTop]: atTop })}>
      {children}
    </Box>
  );
};
