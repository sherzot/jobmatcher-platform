import React from 'react';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveNavigation({ children, className = '' }: ResponsiveNavigationProps) {
  return (
    <nav className={`bg-white shadow-sm ${className}`}>
      {children}
    </nav>
  );
}
