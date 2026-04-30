'use client';

import { IconOnlyButtonSize } from '@/components/Button/web/Button.types';
import { useEffect, useState } from 'react';

export const useResponsiveSize = (override?: IconOnlyButtonSize): IconOnlyButtonSize => {
  const getInitialSize = (): IconOnlyButtonSize => {
    if (typeof window === 'undefined') return 'large';
    return window.innerWidth < 1024 ? 'medium' : 'large';
  };

  const [size, setSize] = useState<IconOnlyButtonSize>(getInitialSize);

  useEffect(() => {
    if (override || typeof window === 'undefined') return;

    const update = () => {
      const width = window.innerWidth;
      setSize(width < 1024 ? 'medium' : 'large');
    };

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [override]);

  return override ?? size;
};
