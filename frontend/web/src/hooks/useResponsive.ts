import { useState, useEffect } from 'react';

// Screen size breakpoints
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Screen size types
export type Breakpoint = keyof typeof BREAKPOINTS;
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Responsive hook interface
interface UseResponsiveReturn {
  // Screen size information
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  
  // Breakpoint checks
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  
  // Responsive utilities
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
  
  // Window dimensions
  width: number;
  height: number;
  
  // Orientation
  isPortrait: boolean;
  isLandscape: boolean;
}

// Main responsive hook
export function useResponsive(): UseResponsiveReturn {
  const [screenSize, setScreenSize] = useState<ScreenSize>('lg');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);

  useEffect(() => {
    const updateScreenSize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setWidth(newWidth);
      setHeight(newHeight);

      // Determine screen size
      let newScreenSize: ScreenSize = 'lg';
      
      if (newWidth >= BREAKPOINTS['2xl']) {
        newScreenSize = '2xl';
      } else if (newWidth >= BREAKPOINTS.xl) {
        newScreenSize = 'xl';
      } else if (newWidth >= BREAKPOINTS.lg) {
        newScreenSize = 'lg';
      } else if (newWidth >= BREAKPOINTS.md) {
        newScreenSize = 'md';
      } else if (newWidth >= BREAKPOINTS.sm) {
        newScreenSize = 'sm';
      } else {
        newScreenSize = 'xs';
      }
      
      setScreenSize(newScreenSize);
    };

    // Initial call
    updateScreenSize();

    // Add event listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Computed values
  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;
  const isLargeDesktop = width >= BREAKPOINTS.xl;

  const isXs = screenSize === 'xs';
  const isSm = screenSize === 'sm';
  const isMd = screenSize === 'md';
  const isLg = screenSize === 'lg';
  const isXl = screenSize === 'xl';
  const is2xl = screenSize === '2xl';

  const isPortrait = height > width;
  const isLandscape = width > height;

  // Utility functions
  const isAbove = (breakpoint: Breakpoint): boolean => {
    return width >= BREAKPOINTS[breakpoint];
  };

  const isBelow = (breakpoint: Breakpoint): boolean => {
    return width < BREAKPOINTS[breakpoint];
  };

  const isBetween = (min: Breakpoint, max: Breakpoint): boolean => {
    return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
  };

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isAbove,
    isBelow,
    isBetween,
    width,
    height,
    isPortrait,
    isLandscape
  };
}

// Hook for responsive values
export function useResponsiveValue<T>(
  mobile: T,
  tablet?: T,
  desktop?: T,
  largeDesktop?: T
): T {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  if (isLargeDesktop && largeDesktop !== undefined) {
    return largeDesktop;
  }
  
  if (isDesktop && desktop !== undefined) {
    return desktop;
  }
  
  if (isTablet && tablet !== undefined) {
    return tablet;
  }
  
  return mobile;
}

// Hook for responsive styles
export function useResponsiveStyles(styles: {
  mobile?: React.CSSProperties;
  tablet?: React.CSSProperties;
  desktop?: React.CSSProperties;
  largeDesktop?: React.CSSProperties;
}): React.CSSProperties {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  if (isLargeDesktop && styles.largeDesktop) {
    return { ...styles.mobile, ...styles.tablet, ...styles.desktop, ...styles.largeDesktop };
  }
  
  if (isDesktop && styles.desktop) {
    return { ...styles.mobile, ...styles.tablet, ...styles.desktop };
  }
  
  if (isTablet && styles.tablet) {
    return { ...styles.mobile, ...styles.tablet };
  }
  
  return styles.mobile || {};
}

// Hook for responsive classes
export function useResponsiveClasses(classes: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  largeDesktop?: string;
}): string {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  const classList: string[] = [];

  if (classes.mobile) {
    classList.push(classes.mobile);
  }
  
  if (isTablet && classes.tablet) {
    classList.push(classes.tablet);
  }
  
  if (isDesktop && classes.desktop) {
    classList.push(classes.desktop);
  }
  
  if (isLargeDesktop && classes.largeDesktop) {
    classList.push(classes.largeDesktop);
  }

  return classList.join(' ');
}

// Hook for responsive breakpoint
export function useResponsiveBreakpoint(): Breakpoint {
  const { screenSize } = useResponsive();
  return screenSize;
}

// Hook for responsive orientation
export function useResponsiveOrientation() {
  const { isPortrait, isLandscape } = useResponsive();
  return { isPortrait, isLandscape };
}

// Hook for responsive dimensions
export function useResponsiveDimensions() {
  const { width, height } = useResponsive();
  return { width, height };
}

// Hook for responsive media query
export function useResponsiveMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const updateMatches = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateMatches);

    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

// Hook for responsive scroll
export function useResponsiveScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrollX(window.scrollX);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, scrollX };
}

// Hook for responsive viewport
export function useResponsiveViewport() {
  const { width, height } = useResponsive();
  const { scrollY, scrollX } = useResponsiveScroll();

  return {
    width,
    height,
    scrollY,
    scrollX,
    viewportHeight: height,
    viewportWidth: width
  };
}
