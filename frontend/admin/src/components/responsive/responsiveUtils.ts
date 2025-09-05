// Responsive utility functions

export const getResponsiveValue = <T>(
  values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  },
  currentBreakpoint: string
): T | undefined => {
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i] as keyof typeof values;
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return undefined;
};

export const getResponsiveClasses = (classes: {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string => {
  return Object.entries(classes)
    .filter(([_, value]) => value)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'xs') return value;
      return `${breakpoint}:${value}`;
    })
    .join(' ');
};

export const isBreakpoint = (breakpoint: string, currentBreakpoint: string): boolean => {
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return currentIndex >= targetIndex;
};
