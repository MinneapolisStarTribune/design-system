import React from 'react';
import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';

export const BUTTON_COLORS = ['neutral', 'brand', 'brand-accent'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export const BUTTON_VARIANTS = ['filled', 'outlined', 'ghost'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps extends Omit<MantineButtonProps, 'color' | 'variant' | 'size'> {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({ 
  color = 'neutral', 
  variant = 'filled',
  size = 'medium',
  label,
  children,
  className,
  ...props 
}) => {
  let mantineVariant;
  if (variant === 'ghost') {
    mantineVariant = 'subtle';
  } else {
    mantineVariant = variant;
  }

  return (
    <MantineButton 
      variant={mantineVariant} 
      color={color}
      size={size}
      {...props}
    >
      {label}
    </MantineButton>
  );
};