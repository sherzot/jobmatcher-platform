import React from 'react';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ResponsiveCard({ children, className = '', onClick }: ResponsiveCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
