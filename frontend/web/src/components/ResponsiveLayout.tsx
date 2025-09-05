import React from 'react';
import { clsx } from 'clsx';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export default function ResponsiveLayout({
  children,
  className = '',
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  padding = 'none',
  responsive = true
}: ResponsiveLayoutProps) {
  const directionClasses = {
    row: responsive ? 'flex flex-col sm:flex-row' : 'flex flex-row',
    col: responsive ? 'flex flex-col' : 'flex flex-col'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
    xl: 'gap-6 sm:gap-8 lg:gap-12'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-4',
    md: 'p-4 sm:p-6 lg:p-8',
    lg: 'p-6 sm:p-8 lg:p-12',
    xl: 'p-8 sm:p-12 lg:p-16'
  };

  const layoutClasses = clsx(
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    wrap && 'flex-wrap',
    gapClasses[gap],
    paddingClasses[padding],
    className
  );

  return (
    <div className={layoutClasses}>
      {children}
    </div>
  );
}

// Predefined layout components
export function ResponsiveRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveLayout direction="row" className={className}>
      {children}
    </ResponsiveLayout>
  );
}

export function ResponsiveCol({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveLayout direction="col" className={className}>
      {children}
    </ResponsiveLayout>
  );
}

export function ResponsiveCenter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveLayout align="center" justify="center" className={className}>
      {children}
    </ResponsiveLayout>
  );
}

export function ResponsiveBetween({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveLayout justify="between" className={className}>
      {children}
    </ResponsiveLayout>
  );
}

// Responsive sidebar layout
interface ResponsiveSidebarLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl';
  reverse?: boolean;
  className?: string;
}

export function ResponsiveSidebarLayout({
  sidebar,
  main,
  sidebarWidth = 'md',
  reverse = false,
  className = ''
}: ResponsiveSidebarLayoutProps) {
  const sidebarWidthClasses = {
    sm: 'w-full lg:w-64',
    md: 'w-full lg:w-80',
    lg: 'w-full lg:w-96',
    xl: 'w-full lg:w-[28rem]'
  };

  const layoutClasses = clsx(
    'flex flex-col lg:flex-row gap-6 lg:gap-8',
    className
  );

  const sidebarClasses = clsx(
    'flex-shrink-0',
    sidebarWidthClasses[sidebarWidth]
  );

  const mainClasses = 'flex-1 min-w-0';

  return (
    <div className={layoutClasses}>
      {reverse ? (
        <>
          <div className={mainClasses}>{main}</div>
          <div className={sidebarClasses}>{sidebar}</div>
        </>
      ) : (
        <>
          <div className={sidebarClasses}>{sidebar}</div>
          <div className={mainClasses}>{main}</div>
        </>
      )}
    </div>
  );
}

// Responsive split layout
interface ResponsiveSplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  className?: string;
}

export function ResponsiveSplitLayout({
  left,
  right,
  ratio = '50-50',
  className = ''
}: ResponsiveSplitLayoutProps) {
  const ratioClasses = {
    '50-50': 'lg:grid-cols-2',
    '60-40': 'lg:grid-cols-5',
    '40-60': 'lg:grid-cols-5',
    '70-30': 'lg:grid-cols-10',
    '30-70': 'lg:grid-cols-10'
  };

  const leftSpanClasses = {
    '50-50': 'lg:col-span-1',
    '60-40': 'lg:col-span-3',
    '40-60': 'lg:col-span-2',
    '70-30': 'lg:col-span-7',
    '30-70': 'lg:col-span-3'
  };

  const rightSpanClasses = {
    '50-50': 'lg:col-span-1',
    '60-40': 'lg:col-span-2',
    '40-60': 'lg:col-span-3',
    '70-30': 'lg:col-span-3',
    '30-70': 'lg:col-span-7'
  };

  const layoutClasses = clsx(
    'grid grid-cols-1 gap-6 lg:gap-8',
    ratioClasses[ratio],
    className
  );

  return (
    <div className={layoutClasses}>
      <div className={leftSpanClasses[ratio]}>{left}</div>
      <div className={rightSpanClasses[ratio]}>{right}</div>
    </div>
  );
}

// Responsive masonry layout
interface ResponsiveMasonryLayoutProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveMasonryLayout({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md'
}: ResponsiveMasonryLayoutProps) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8'
  };

  const masonryClasses = clsx(
    'columns-1',
    `sm:columns-${cols.tablet || cols.mobile || 1}`,
    `lg:columns-${cols.desktop || cols.tablet || cols.mobile || 1}`,
    gapClasses[gap],
    'space-y-3 sm:space-y-4 lg:space-y-6',
    className
  );

  return (
    <div className={masonryClasses}>
      {React.Children.map(children, (child) => (
        <div className="break-inside-avoid mb-3 sm:mb-4 lg:mb-6">
          {child}
        </div>
      ))}
    </div>
  );
}

// Responsive stack layout
interface ResponsiveStackLayoutProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function ResponsiveStackLayout({
  children,
  className = '',
  spacing = 'md',
  align = 'stretch'
}: ResponsiveStackLayoutProps) {
  const spacingClasses = {
    none: '',
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-3 sm:space-y-4 lg:space-y-6',
    lg: 'space-y-4 sm:space-y-6 lg:space-y-8',
    xl: 'space-y-6 sm:space-y-8 lg:space-y-12'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const stackClasses = clsx(
    'flex flex-col',
    spacingClasses[spacing],
    alignClasses[align],
    className
  );

  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
}
