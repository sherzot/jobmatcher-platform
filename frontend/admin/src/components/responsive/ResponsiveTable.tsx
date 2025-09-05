import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export default function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}
