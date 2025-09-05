import React from 'react';
import { clsx } from 'clsx';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  fluid?: boolean;
}

export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
  center = true,
  fluid = false
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
    none: ''
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16'
  };

  const containerClasses = clsx(
    'w-full',
    !fluid && maxWidthClasses[maxWidth],
    paddingClasses[padding],
    center && 'mx-auto',
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}

// Predefined container variants
export function ResponsiveContainerSm({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveContainer maxWidth="sm" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

export function ResponsiveContainerMd({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveContainer maxWidth="md" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

export function ResponsiveContainerLg({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveContainer maxWidth="lg" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

export function ResponsiveContainerXl({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveContainer maxWidth="xl" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

export function ResponsiveContainer2xl({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveContainer maxWidth="2xl" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

export function ResponsiveContainerFluid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveContainer fluid maxWidth="full" className={className}>
      {children}
    </ResponsiveContainer>
  );
}

// Section containers with different padding
export function ResponsiveSection({ 
  children, 
  className = '',
  padding = 'lg'
}: { 
  children: React.ReactNode; 
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const paddingClasses = {
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8',
    lg: 'py-8 sm:py-12 lg:py-16',
    xl: 'py-12 sm:py-16 lg:py-20'
  };

  return (
    <section className={clsx(paddingClasses[padding], className)}>
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </section>
  );
}

// Hero section container
export function ResponsiveHero({ 
  children, 
  className = '',
  minHeight = 'min-h-[60vh]'
}: { 
  children: React.ReactNode; 
  className?: string;
  minHeight?: string;
}) {
  return (
    <section className={clsx('flex items-center justify-center', minHeight, className)}>
      <ResponsiveContainer maxWidth="2xl" padding="lg">
        {children}
      </ResponsiveContainer>
    </section>
  );
}
