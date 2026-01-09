import React, { useEffect, useState } from 'react';
import layoutJson from '../../../../../tokens/breakpoint.json';

export const BreakpointIndicator: React.FC = () => {
  const [breakpoint, setBreakpoint] = useState('');
  const [viewportWidth, setViewportWidth] = useState(0);
  const [color, setColor] = useState('#1683F8');

  const largeMin = parseInt(layoutJson.breakpoint.large.min.value);
  const largeMax = parseInt(layoutJson.breakpoint.large.max.value);
  const mediumMin = parseInt(layoutJson.breakpoint.medium.min.value);
  const mediumMax = parseInt(layoutJson.breakpoint.medium.max.value);
  const smallMin = parseInt(layoutJson.breakpoint.small.min.value);
  const smallMax = parseInt(layoutJson.breakpoint.small.max.value);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setViewportWidth(width);

      const largeOnly = document.getElementById('large-only');
      const mediumOnly = document.getElementById('medium-only');
      const smallOnly = document.getElementById('small-only');

      let newBreakpoint = '';
      let newColor = '#1683F8';

      if (width >= largeMin) {
        newBreakpoint = `Large (≥ ${largeMin}px)`;
        newColor = '#1683F8';
        if (largeOnly) largeOnly.style.display = 'block';
        if (mediumOnly) mediumOnly.style.display = 'none';
        if (smallOnly) smallOnly.style.display = 'none';
      } else if (width >= mediumMin && width <= mediumMax) {
        newBreakpoint = `Medium (${mediumMin}px - ${mediumMax}px)`;
        newColor = '#F96A06';
        if (largeOnly) largeOnly.style.display = 'none';
        if (mediumOnly) mediumOnly.style.display = 'block';
        if (smallOnly) smallOnly.style.display = 'none';
      } else {
        newBreakpoint = `Small (≤ ${smallMax}px)`;
        newColor = '#F04C4C';
        if (largeOnly) largeOnly.style.display = 'none';
        if (mediumOnly) mediumOnly.style.display = 'none';
        if (smallOnly) smallOnly.style.display = 'block';
      }

      setBreakpoint(newBreakpoint);
      setColor(newColor);
    };

    // Initial update
    updateBreakpoint();

    // Debounce resize events
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [largeMin, largeMax, mediumMin, mediumMax, smallMin, smallMax]);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '1rem',
        backgroundColor: color,
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '2rem',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease',
      }}
    >
      Current Breakpoint: {breakpoint || 'Calculating...'}
      <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
        Viewport Width: {viewportWidth}px
      </div>
    </div>
  );
};
