import React from "react";
import { clsx } from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "red";
  loading?: boolean;
};
export function Button({
  className,
  variant = "red",
  loading,
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
    red: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  };
  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

type CardProps = {
  className?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};
export function Card({ className, children, title, subtitle }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="border-b border-slate-100 p-3 sm:p-4 lg:p-6">
          {title && <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">{title}</h3>}
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-3 sm:p-4 lg:p-6">{children}</div>
    </div>
  );
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
