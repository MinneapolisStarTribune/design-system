import type { SVGProps } from 'react';

export const ICON_PIXEL_SIZES = {
  'x-small': '14px',
  small: '16px',
  medium: '20px',
  large: '24px',
  'x-large': '32px',
} as const;

export type IconSize = keyof typeof ICON_PIXEL_SIZES;

export type IconComponent = React.ComponentType<SVGProps<SVGSVGElement>>;
