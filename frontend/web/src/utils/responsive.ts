// Responsive utility functions

// Breakpoint definitions
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Responsive class generators
export const responsiveClasses = {
  // Grid classes
  grid: {
    cols: (cols: Record<ScreenSize, number>) => {
      return `grid-cols-${cols.xs} sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} xl:grid-cols-${cols.xl} 2xl:grid-cols-${cols['2xl']}`;
    },
    gap: (gap: Record<ScreenSize, number>) => {
      return `gap-${gap.xs} sm:gap-${gap.sm} md:gap-${gap.md} lg:gap-${gap.lg} xl:gap-${gap.xl} 2xl:gap-${gap['2xl']}`;
    }
  },

  // Spacing classes
  spacing: {
    padding: (padding: Record<ScreenSize, number>) => {
      return `p-${padding.xs} sm:p-${padding.sm} md:p-${padding.md} lg:p-${padding.lg} xl:p-${padding.xl} 2xl:p-${padding['2xl']}`;
    },
    margin: (margin: Record<ScreenSize, number>) => {
      return `m-${margin.xs} sm:m-${margin.sm} md:m-${margin.md} lg:m-${margin.lg} xl:m-${margin.xl} 2xl:m-${margin['2xl']}`;
    },
    spaceY: (space: Record<ScreenSize, number>) => {
      return `space-y-${space.xs} sm:space-y-${space.sm} md:space-y-${space.md} lg:space-y-${space.lg} xl:space-y-${space.xl} 2xl:space-y-${space['2xl']}`;
    },
    spaceX: (space: Record<ScreenSize, number>) => {
      return `space-x-${space.xs} sm:space-x-${space.sm} md:space-x-${space.md} lg:space-x-${space.lg} xl:space-x-${space.xl} 2xl:space-x-${space['2xl']}`;
    }
  },

  // Typography classes
  typography: {
    text: (size: Record<ScreenSize, string>) => {
      return `text-${size.xs} sm:text-${size.sm} md:text-${size.md} lg:text-${size.lg} xl:text-${size.xl} 2xl:text-${size['2xl']}`;
    },
    leading: (leading: Record<ScreenSize, string>) => {
      return `leading-${leading.xs} sm:leading-${leading.sm} md:leading-${leading.md} lg:leading-${leading.lg} xl:leading-${leading.xl} 2xl:leading-${leading['2xl']}`;
    }
  },

  // Layout classes
  layout: {
    flex: (direction: Record<ScreenSize, 'row' | 'col'>) => {
      return `flex flex-${direction.xs} sm:flex-${direction.sm} md:flex-${direction.md} lg:flex-${direction.lg} xl:flex-${direction.xl} 2xl:flex-${direction['2xl']}`;
    },
    justify: (justify: Record<ScreenSize, string>) => {
      return `justify-${justify.xs} sm:justify-${justify.sm} md:justify-${justify.md} lg:justify-${justify.lg} xl:justify-${justify.xl} 2xl:justify-${justify['2xl']}`;
    },
    align: (align: Record<ScreenSize, string>) => {
      return `items-${align.xs} sm:items-${align.sm} md:items-${align.md} lg:items-${align.lg} xl:items-${align.xl} 2xl:items-${align['2xl']}`;
    }
  },

  // Display classes
  display: {
    show: (screens: ScreenSize[]) => {
      return screens.map(screen => `${screen}:block`).join(' ');
    },
    hide: (screens: ScreenSize[]) => {
      return screens.map(screen => `${screen}:hidden`).join(' ');
    }
  }
};

// Responsive value utilities
export const responsiveValue = {
  // Get value based on screen size
  get: <T>(values: Record<ScreenSize, T>, currentSize: ScreenSize): T => {
    return values[currentSize];
  },

  // Get value for current breakpoint and above
  getAbove: <T>(values: Record<ScreenSize, T>, currentSize: ScreenSize): T => {
    const sizes: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = sizes.indexOf(currentSize);
    
    for (let i = currentIndex; i >= 0; i--) {
      if (values[sizes[i]] !== undefined) {
        return values[sizes[i]];
      }
    }
    
    return values.xs;
  },

  // Get value for current breakpoint and below
  getBelow: <T>(values: Record<ScreenSize, T>, currentSize: ScreenSize): T => {
    const sizes: ScreenSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = sizes.indexOf(currentSize);
    
    for (let i = currentIndex; i < sizes.length; i++) {
      if (values[sizes[i]] !== undefined) {
        return values[sizes[i]];
      }
    }
    
    return values['2xl'];
  }
};

// Responsive media query utilities
export const responsiveMedia = {
  // Generate media query for breakpoint
  min: (breakpoint: Breakpoint): string => {
    return `@media (min-width: ${BREAKPOINTS[breakpoint]}px)`;
  },

  // Generate media query for breakpoint and below
  max: (breakpoint: Breakpoint): string => {
    return `@media (max-width: ${BREAKPOINTS[breakpoint] - 1}px)`;
  },

  // Generate media query between breakpoints
  between: (min: Breakpoint, max: Breakpoint): string => {
    return `@media (min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`;
  },

  // Generate media query for orientation
  orientation: (orientation: 'portrait' | 'landscape'): string => {
    return `@media (orientation: ${orientation})`;
  },

  // Generate media query for aspect ratio
  aspectRatio: (ratio: string): string => {
    return `@media (aspect-ratio: ${ratio})`;
  }
};

// Responsive CSS utilities
export const responsiveCSS = {
  // Generate responsive CSS properties
  property: (property: string, values: Record<ScreenSize, string | number>): string => {
    const css = Object.entries(values).map(([breakpoint, value]) => {
      if (breakpoint === 'xs') {
        return `${property}: ${value};`;
      }
      return `${responsiveMedia.min(breakpoint as Breakpoint)} { ${property}: ${value}; }`;
    }).join('\n');
    
    return css;
  },

  // Generate responsive CSS with multiple properties
  properties: (properties: Record<string, Record<ScreenSize, string | number>>): string => {
    return Object.entries(properties).map(([property, values]) => {
      return responsiveCSS.property(property, values);
    }).join('\n');
  }
};

// Responsive component utilities
export const responsiveComponent = {
  // Generate responsive props
  props: <T>(props: Record<ScreenSize, T>, currentSize: ScreenSize): T => {
    return responsiveValue.get(props, currentSize);
  },

  // Generate responsive styles
  styles: (styles: Record<ScreenSize, React.CSSProperties>, currentSize: ScreenSize): React.CSSProperties => {
    return responsiveValue.get(styles, currentSize);
  },

  // Generate responsive classes
  classes: (classes: Record<ScreenSize, string>, currentSize: ScreenSize): string => {
    return responsiveValue.get(classes, currentSize);
  }
};

// Responsive validation utilities
export const responsiveValidation = {
  // Check if screen size is mobile
  isMobile: (size: ScreenSize): boolean => {
    return ['xs', 'sm'].includes(size);
  },

  // Check if screen size is tablet
  isTablet: (size: ScreenSize): boolean => {
    return size === 'md';
  },

  // Check if screen size is desktop
  isDesktop: (size: ScreenSize): boolean => {
    return ['lg', 'xl', '2xl'].includes(size);
  },

  // Check if screen size is large desktop
  isLargeDesktop: (size: ScreenSize): boolean => {
    return ['xl', '2xl'].includes(size);
  },

  // Get device type from screen size
  getDeviceType: (size: ScreenSize): 'mobile' | 'tablet' | 'desktop' | 'large-desktop' => {
    if (responsiveValidation.isMobile(size)) return 'mobile';
    if (responsiveValidation.isTablet(size)) return 'tablet';
    if (responsiveValidation.isLargeDesktop(size)) return 'large-desktop';
    return 'desktop';
  }
};

// Responsive performance utilities
export const responsivePerformance = {
  // Debounce resize events
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle resize events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Responsive storage utilities
export const responsiveStorage = {
  // Save responsive state to localStorage
  save: (key: string, value: any): void => {
    try {
      localStorage.setItem(`responsive_${key}`, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save responsive state:', error);
    }
  },

  // Load responsive state from localStorage
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`responsive_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn('Failed to load responsive state:', error);
      return defaultValue;
    }
  },

  // Remove responsive state from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(`responsive_${key}`);
    } catch (error) {
      console.warn('Failed to remove responsive state:', error);
    }
  }
};

// Responsive debugging utilities
export const responsiveDebug = {
  // Log responsive information
  log: (info: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Responsive Debug]:', info);
    }
  },

  // Log responsive breakpoint changes
  logBreakpoint: (from: ScreenSize, to: ScreenSize): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Responsive Debug]: Breakpoint changed from ${from} to ${to}`);
    }
  },

  // Log responsive component updates
  logComponent: (componentName: string, props: any): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Responsive Debug]: ${componentName} updated with props:`, props);
    }
  }
};

// Export all utilities
export default {
  BREAKPOINTS,
  responsiveClasses,
  responsiveValue,
  responsiveMedia,
  responsiveCSS,
  responsiveComponent,
  responsiveValidation,
  responsivePerformance,
  responsiveStorage,
  responsiveDebug
};
