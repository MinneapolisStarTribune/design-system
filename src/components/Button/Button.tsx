import { twMerge } from 'tailwind-merge';
import React from 'react';

export type ButtonProps = {
  className?: string | string[];
  variant?: 'primary' | 'secondary' | 'text';
  color?: 'black' | 'green';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconClassName?: string | string[];
  iconPosition?: 'start' | 'end';
  label: string;
  disabled?: boolean;
} & (
  {
    // External link — consumer must pass an element
    as: React.ElementType;
    href: string;
    onClick?: never;
  } | {
    // Regular button
    as?: never;
    href?: never;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }
);

export const Button = ({
  className = '',
  variant = 'text',
  color = 'black',
  size = 'md',
  icon,
  iconClassName = '',
  iconPosition = 'end',
  label,
  disabled = false,
  onClick,
  as: LinkComponent,
  href,
}: ButtonProps) => {
  const classList = twMerge(
    ['ds:inline-flex', 'ds:items-center', 'ds:gap-1', 'ds:cursor-pointer'],
    (variant === 'primary' || variant === 'secondary') && [
      'ds:rounded-full', 
      'ds:px-5', 
      'ds:py-2', 
      'ds:font-semibold', 
      'ds:uppercase'
    ],
    variant === 'primary' && [
      'ds:bg-base-black', 
      'ds:hover:bg-gray-700', 
      'ds:text-base-white', 
      'ds:max-xl:text-xs', 
      'ds:max-xl:px-4'
    ],
    variant === 'secondary' && [
      'ds:border'
    ],
    color === 'green' && [
      'ds:bg-linear-to-r ds:from-lime-300 ds:to-spring-400 ds:text-base-black ds:border-1 ds:border-transparent', 
      'ds:hover:bg-none ds:hover:border-1 ds:hover:border-bright-green ds:hover:text-base-white'
    ],
    size === 'sm' && 'ds:text-xs',
    size === 'md' && ['ds:text-sm', 'ds:px-6', 'ds:py-3'],
    size === 'lg' && ['ds:text-base', 'ds:px-6', 'ds:py-4'],
    className,
  );

  const inners = (
    <>
      {label}
      {icon && (
        <span className={twMerge(
          'ds:flex',
          'ds:flex-col',
          size === 'sm' && ['ds:w-[12px]', 'ds:h-[12px]'],
          (size === 'lg' || size === 'md') && ['ds:w-[1em]', 'ds:h-[1em]'],
          iconPosition === 'start' && 'ds:order-first',
          iconClassName,
        )}>
          {icon}
        </span>
      )}
    </>
  );

  if (!label) return null;

  if (onClick) {
    return (
      <button
        className={classList}
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {inners}
      </button>
    );
  }

  if (LinkComponent && href) {
    return (
      <LinkComponent className={classList} href={href}>
        {inners}
      </LinkComponent>
    );
  }

  return null;
}
