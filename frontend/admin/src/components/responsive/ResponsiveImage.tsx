import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height 
}: ResponsiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`max-w-full h-auto ${className}`}
    />
  );
}
