'use client';

import { useEffect, useState } from 'react';

type Size = 'medium' | 'large';

export const useResponsiveSize = (override?: Size): Size => {
  const getInitialSize = (): Size => {
    if (typeof window === 'undefined') return 'large';
    return window.innerWidth < 1024 ? 'medium' : 'large';
  };

  const [size, setSize] = useState<Size>(getInitialSize);

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
