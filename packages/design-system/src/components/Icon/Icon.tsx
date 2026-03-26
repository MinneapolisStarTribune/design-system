import React from 'react';
import type { SVGProps } from 'react';
import {
  ICON_COLOR_TOKENS,
  ICON_PIXEL_SIZES,
  type IconComponent,
  type IconSize,
  type IconWrapperProps,
} from './Icon.types';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  size?: IconSize;
  component: IconComponent;
};

export const Icon: React.FC<IconProps> = ({ component: Component, size = 'medium', ...rest }) => {
  const pixel = ICON_PIXEL_SIZES[size];
  return <Component width={pixel} height={pixel} size={size} {...rest} />;
};

/**
 * Creates a wrapped icon component that accepts design-system size and semantic color props.
 * Default size: medium. Default color: on-light-primary.
 * Use e.g. <CameraIcon size="small" color="on-dark-secondary" />.
 */
export function createIconWrapper(Component: IconComponent): React.FC<IconWrapperProps> {
  const WrappedIcon: React.FC<IconWrapperProps> = ({
    size = 'medium',
    color = 'on-light-primary',
    // Button may pass in width, height props to override the default size.
    width,
    height,
    style,
    ...rest
  }) => {
    const pixel = ICON_PIXEL_SIZES[size];
    const resolvedWidth = width ?? pixel;
    const resolvedHeight = height ?? pixel;
    const resolvedStyle: React.CSSProperties = {
      width: resolvedWidth,
      height: resolvedHeight,
      color: ICON_COLOR_TOKENS[color],
      ...style,
    };
    return (
      <Component width={resolvedWidth} height={resolvedHeight} style={resolvedStyle} {...rest} />
    );
  };
  WrappedIcon.displayName = `Icon(${Component.displayName ?? Component.name ?? 'Unknown'})`;
  return WrappedIcon;
}
