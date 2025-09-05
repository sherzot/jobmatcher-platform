import React from 'react';
import { clsx } from 'clsx';

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error' | 'white' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
}

export default function ResponsiveText({
  children,
  className = '',
  variant = 'p',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  truncate = false,
  leading = 'normal'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
    '4xl': 'text-4xl sm:text-5xl lg:text-6xl',
    '5xl': 'text-5xl sm:text-6xl lg:text-7xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const colorClasses = {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    muted: 'text-slate-500',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    white: 'text-white',
    black: 'text-black'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const leadingClasses = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  const textClasses = clsx(
    sizeClasses[size],
    weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    leadingClasses[leading],
    truncate && 'truncate',
    className
  );

  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Component className={textClasses}>
      {children}
    </Component>
  );
}

// Predefined text components
export function ResponsiveHeading1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="h1" size="4xl" weight="bold" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveHeading2({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="h2" size="3xl" weight="semibold" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveHeading3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="h3" size="2xl" weight="semibold" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveHeading4({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="h4" size="xl" weight="medium" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveParagraph({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="p" size="base" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveSmall({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="p" size="sm" color="muted" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveCaption({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText variant="p" size="xs" color="muted" className={className}>
      {children}
    </ResponsiveText>
  );
}

// Responsive text with different alignments
export function ResponsiveTextCenter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText align="center" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveTextRight({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText align="right" className={className}>
      {children}
    </ResponsiveText>
  );
}

// Responsive text with different colors
export function ResponsiveTextMuted({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText color="muted" className={className}>
      {children}
    </ResponsiveText>
  );
}

export function ResponsiveTextSecondary({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveText color="secondary" className={className}>
      {children}
    </ResponsiveText>
  );
}
