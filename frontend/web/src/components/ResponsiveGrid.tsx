import React from 'react';
import { clsx } from 'clsx';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
}

export default function ResponsiveGrid({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = { mobile: 4, tablet: 6, desktop: 8 },
  alignItems = 'stretch',
  justifyItems = 'start'
}: ResponsiveGridProps) {
  const getGridCols = () => {
    const mobileCols = cols.mobile || 1;
    const tabletCols = cols.tablet || mobileCols;
    const desktopCols = cols.desktop || tabletCols;
    const wideCols = cols.wide || desktopCols;

    return `grid-cols-${mobileCols} sm:grid-cols-${tabletCols} lg:grid-cols-${desktopCols} xl:grid-cols-${wideCols}`;
  };

  const getGap = () => {
    const mobileGap = gap.mobile || 4;
    const tabletGap = gap.tablet || mobileGap;
    const desktopGap = gap.desktop || tabletGap;

    return `gap-${mobileGap} sm:gap-${tabletGap} lg:gap-${desktopGap}`;
  };

  const gridClasses = clsx(
    'grid',
    getGridCols(),
    getGap(),
    `items-${alignItems}`,
    `justify-items-${justifyItems}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Predefined grid layouts
export function ResponsiveGrid2Col({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      cols={{ mobile: 1, tablet: 2, desktop: 2 }}
      gap={{ mobile: 4, tablet: 6, desktop: 8 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function ResponsiveGrid3Col({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      cols={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap={{ mobile: 4, tablet: 6, desktop: 8 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

export function ResponsiveGrid4Col({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveGrid
      cols={{ mobile: 1, tablet: 2, desktop: 3, wide: 4 }}
      gap={{ mobile: 4, tablet: 6, desktop: 8 }}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
}

// Auto-fit grid for flexible layouts
export function ResponsiveAutoGrid({ 
  children, 
  className = '',
  minWidth = '250px'
}: { 
  children: React.ReactNode; 
  className?: string;
  minWidth?: string;
}) {
  const autoGridClasses = clsx(
    'grid gap-4 sm:gap-6 lg:gap-8',
    className
  );

  const style = {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`
  };

  return (
    <div className={autoGridClasses} style={style}>
      {children}
    </div>
  );
}
