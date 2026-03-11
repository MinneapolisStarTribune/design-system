import React from 'react';
import type { SVGProps } from 'react';
import { ICON_PIXEL_SIZES, type IconSize, type IconComponent } from './Icon.types';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  size?: IconSize;
  component: IconComponent;
};

export const Icon: React.FC<IconProps> = ({ component: Component, size = 'medium', ...rest }) => {
  const pixel = ICON_PIXEL_SIZES[size];
  return <Component width={pixel} height={pixel} {...rest} />;
};
