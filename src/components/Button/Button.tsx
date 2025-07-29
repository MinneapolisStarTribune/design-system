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
    ['inline-flex', 'items-center', 'gap-1', 'cursor-pointer'],
    (variant === 'primary' || variant === 'secondary') && ['rounded-full', 'px-5', 'py-2', 'font-semibold', 'uppercase'],
    variant === 'primary' && ['bg-base-black', 'hover:bg-gray-700', 'text-base-white', 'max-xl:text-xs', 'max-xl:px-4'],
    variant === 'secondary' && ['border'],
    color === 'green' && ['bg-linear-to-r from-lime-300 to-spring-400 text-base-black border-1 border-transparent', 'hover:bg-none hover:border-1 hover:border-bright-green hover:text-base-white'],
    size === 'sm' && 'text-xs',
    size === 'md' && ['text-sm', 'px-6', 'py-3'],
    size === 'lg' && ['text-base', 'px-6', 'py-4'],
    className,
  );

  const inners = (
    <>
      {label}
      {icon && (
        <span className={twMerge(
          'flex',
          'flex-col',
          size === 'sm' && ['w-[12px]', 'h-[12px]'],
          (size === 'lg' || size === 'md') && ['w-[1em]', 'h-[1em]'],
          iconPosition === 'start' && 'order-first',
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
