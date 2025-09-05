import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  sizes?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  mobileSrc,
  tabletSrc,
  desktopSrc,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}: ResponsiveImageProps) {
  const baseClasses = 'w-full h-auto object-cover';
  const responsiveClasses = className ? `${baseClasses} ${className}` : baseClasses;

  // Agar turli o'lchamdagi rasmlar berilgan bo'lsa
  if (mobileSrc || tabletSrc || desktopSrc) {
    return (
      <picture>
        {mobileSrc && <source media="(max-width: 640px)" srcSet={mobileSrc} />}
        {tabletSrc && <source media="(min-width: 641px) and (max-width: 1024px)" srcSet={tabletSrc} />}
        {desktopSrc && <source media="(min-width: 1025px)" srcSet={desktopSrc} />}
        <img
          src={src}
          alt={alt}
          className={responsiveClasses}
          sizes={sizes}
          loading="lazy"
        />
      </picture>
    );
  }

  // Oddiy rasm uchun
  return (
    <img
      src={src}
      alt={alt}
      className={responsiveClasses}
      loading="lazy"
    />
  );
}
