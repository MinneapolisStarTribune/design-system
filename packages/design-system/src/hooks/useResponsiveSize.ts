import { useEffect, useState } from 'react';

type Size = 'medium' | 'large';

export const useResponsiveSize = (override?: Size): Size => {
  const [size, setSize] = useState<Size>('large');

  useEffect(() => {
    if (override) return;

    const update = () => {
      const width = window.innerWidth;

      if (width < 1024) {
        setSize('medium'); // mobile + tablet
      } else {
        setSize('large'); // desktop
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [override]);

  return override ?? size;
};
