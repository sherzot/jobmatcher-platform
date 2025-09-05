import React from 'react';
import { clsx } from 'clsx';

interface ResponsiveFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  spacing?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal' | 'grid';
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export default function ResponsiveForm({
  children,
  className = '',
  onSubmit,
  spacing = 'md',
  layout = 'vertical',
  cols = { mobile: 1, tablet: 2, desktop: 3 }
}: ResponsiveFormProps) {
  const spacingClasses = {
    sm: 'space-y-3 sm:space-y-4',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8'
  };

  const layoutClasses = {
    vertical: spacingClasses[spacing],
    horizontal: 'space-y-4 sm:space-y-6',
    grid: clsx(
      'grid gap-4 sm:gap-6 lg:gap-8',
      `grid-cols-${cols.mobile || 1}`,
      `sm:grid-cols-${cols.tablet || cols.mobile || 1}`,
      `lg:grid-cols-${cols.desktop || cols.tablet || cols.mobile || 1}`
    )
  };

  const formClasses = clsx(
    layoutClasses[layout],
    className
  );

  return (
    <form onSubmit={onSubmit} className={formClasses}>
      {children}
    </form>
  );
}

// Form field wrapper
interface ResponsiveFormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: 'sm' | 'md' | 'lg';
}

export function ResponsiveFormField({
  children,
  label,
  error,
  required = false,
  className = '',
  layout = 'vertical',
  labelWidth = 'md'
}: ResponsiveFormFieldProps) {
  const labelWidthClasses = {
    sm: 'w-20 sm:w-24',
    md: 'w-24 sm:w-32',
    lg: 'w-32 sm:w-40'
  };

  const layoutClasses = {
    vertical: 'space-y-2',
    horizontal: clsx(
      'flex flex-col sm:flex-row sm:items-start sm:gap-4',
      label && 'sm:items-center'
    )
  };

  const fieldClasses = clsx(
    layoutClasses[layout],
    className
  );

  const labelClasses = clsx(
    'block text-sm sm:text-base font-medium text-slate-700',
    layout === 'horizontal' && labelWidthClasses[labelWidth],
    layout === 'horizontal' && 'sm:flex-shrink-0'
  );

  return (
    <div className={fieldClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={layout === 'horizontal' ? 'flex-1' : ''}>
        {children}
        {error && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

// Responsive input
interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
}

export function ResponsiveInput({
  label,
  error,
  required = false,
  layout = 'vertical',
  labelWidth = 'md',
  size = 'md',
  className = '',
  ...props
}: ResponsiveInputProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base',
    lg: 'px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg'
  };

  const inputClasses = clsx(
    'w-full rounded-md border border-slate-300 bg-white transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'placeholder:text-slate-400',
    sizeClasses[size],
    className
  );

  return (
    <ResponsiveFormField
      label={label}
      error={error}
      required={required}
      layout={layout}
      labelWidth={labelWidth}
    >
      <input className={inputClasses} {...props} />
    </ResponsiveFormField>
  );
}

// Responsive textarea
interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
}

export function ResponsiveTextarea({
  label,
  error,
  required = false,
  layout = 'vertical',
  labelWidth = 'md',
  size = 'md',
  rows = 4,
  className = '',
  ...props
}: ResponsiveTextareaProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base',
    lg: 'px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg'
  };

  const textareaClasses = clsx(
    'w-full rounded-md border border-slate-300 bg-white transition-colors resize-vertical',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'placeholder:text-slate-400',
    sizeClasses[size],
    className
  );

  return (
    <ResponsiveFormField
      label={label}
      error={error}
      required={required}
      layout={layout}
      labelWidth={labelWidth}
    >
      <textarea 
        className={textareaClasses} 
        rows={rows}
        {...props} 
      />
    </ResponsiveFormField>
  );
}

// Responsive select
interface ResponsiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  layout?: 'vertical' | 'horizontal';
  labelWidth?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export function ResponsiveSelect({
  label,
  error,
  required = false,
  layout = 'vertical',
  labelWidth = 'md',
  size = 'md',
  options,
  className = '',
  ...props
}: ResponsiveSelectProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base',
    lg: 'px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg'
  };

  const selectClasses = clsx(
    'w-full rounded-md border border-slate-300 bg-white transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    sizeClasses[size],
    className
  );

  return (
    <ResponsiveFormField
      label={label}
      error={error}
      required={required}
      layout={layout}
      labelWidth={labelWidth}
    >
      <select className={selectClasses} {...props}>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </ResponsiveFormField>
  );
}

// Form actions
interface ResponsiveFormActionsProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'left' | 'center' | 'right' | 'space-between';
}

export function ResponsiveFormActions({
  children,
  className = '',
  layout = 'left'
}: ResponsiveFormActionsProps) {
  const layoutClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between'
  };

  const actionsClasses = clsx(
    'flex flex-col sm:flex-row gap-3 sm:gap-4',
    layoutClasses[layout],
    className
  );

  return (
    <div className={actionsClasses}>
      {children}
    </div>
  );
}
