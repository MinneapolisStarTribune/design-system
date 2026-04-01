import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Popover.module.scss';

export const PopoverBody: React.FC<{
  children: React.ReactNode;
  scrollable?: boolean;
}> = ({ children, scrollable }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);
  const [atTop, setAtTop] = useState(true);

  const TOP_THRESHOLD = 1;

  useEffect(() => {
    if (!scrollable) return;

    const el = ref.current;
    if (!el) return;

    const update = () => {
      const isTop = el.scrollTop <= TOP_THRESHOLD;
      setAtTop((prev) => (prev !== isTop ? isTop : prev));
    };

    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        update();
      });
    };

    update();

    el.addEventListener('scroll', onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [scrollable]);

  return (
    <div
      ref={ref}
      className={classNames(styles.body, {
        [styles.bodyAtTop]: atTop,
      })}
    >
      {children}
    </div>
  );
};
