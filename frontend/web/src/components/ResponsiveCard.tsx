import React from "react";
import { clsx } from "clsx";

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export default function ResponsiveCard({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
  clickable = false,
  onClick,
}: ResponsiveCardProps) {
  const baseClasses = "rounded-lg border transition-all duration-200";

  const variantClasses = {
    default: "bg-white border-slate-200 shadow-sm",
    elevated: "bg-white border-slate-200 shadow-md",
    outlined: "bg-transparent border-slate-300",
    filled: "bg-slate-50 border-slate-200",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6 lg:p-8",
    lg: "p-6 sm:p-8 lg:p-10",
    xl: "p-8 sm:p-10 lg:p-12",
  };

  const interactiveClasses = clsx(
    clickable && "cursor-pointer",
    hover && "hover:shadow-lg hover:border-slate-300",
    clickable && "active:scale-[0.98]"
  );

  const cardClasses = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    interactiveClasses,
    className
  );

  const Component = clickable ? "button" : "div";
  const componentProps = clickable ? { onClick, type: "button" as const } : {};

  return (
    <Component className={cardClasses} {...componentProps}>
      {children}
    </Component>
  );
}

// Predefined card variants
export function ResponsiveCardElevated({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ResponsiveCard variant="elevated" className={className}>
      {children}
    </ResponsiveCard>
  );
}

export function ResponsiveCardOutlined({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ResponsiveCard variant="outlined" className={className}>
      {children}
    </ResponsiveCard>
  );
}

export function ResponsiveCardFilled({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ResponsiveCard variant="filled" className={className}>
      {children}
    </ResponsiveCard>
  );
}

export function ResponsiveCardClickable({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <ResponsiveCard clickable hover onClick={onClick} className={className}>
      {children}
    </ResponsiveCard>
  );
}

// Card with header
interface ResponsiveCardWithHeaderProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function ResponsiveCardWithHeader({
  title,
  subtitle,
  children,
  className = "",
  variant = "default",
  padding = "md",
}: ResponsiveCardWithHeaderProps) {
  return (
    <ResponsiveCard variant={variant} padding="none" className={className}>
      {(title || subtitle) && (
        <div className="border-b border-slate-100 p-4 sm:p-6 lg:p-8">
          {title && (
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600">{subtitle}</p>
          )}
        </div>
      )}
      <div
        className={clsx(
          padding === "none"
            ? ""
            : padding === "sm"
            ? "p-3 sm:p-4"
            : padding === "md"
            ? "p-4 sm:p-6 lg:p-8"
            : padding === "lg"
            ? "p-6 sm:p-8 lg:p-10"
            : "p-8 sm:p-10 lg:p-12"
        )}
      >
        {children}
      </div>
    </ResponsiveCard>
  );
}

// Card grid layout
export function ResponsiveCardGrid({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3 },
}: {
  children: React.ReactNode;
  className?: string;
  cols?: { mobile?: number; tablet?: number; desktop?: number };
}) {
  const gridClasses = clsx(
    "grid gap-4 sm:gap-6 lg:gap-8",
    `grid-cols-${cols.mobile || 1}`,
    `sm:grid-cols-${cols.tablet || cols.mobile || 1}`,
    `lg:grid-cols-${cols.desktop || cols.tablet || cols.mobile || 1}`,
    className
  );

  return <div className={gridClasses}>{children}</div>;
}

// Responsive card list
export function ResponsiveCardList({
  children,
  className = "",
  spacing = "md",
}: {
  children: React.ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}) {
  const spacingClasses = {
    sm: "space-y-3 sm:space-y-4",
    md: "space-y-4 sm:space-y-6",
    lg: "space-y-6 sm:space-y-8",
  };

  return (
    <div className={clsx(spacingClasses[spacing], className)}>{children}</div>
  );
}
