import React, { useEffect } from 'react';
import { clsx } from 'clsx';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export default function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}: ResponsiveModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-xl lg:max-w-2xl',
    xl: 'max-w-xl sm:max-w-2xl lg:max-w-4xl',
    full: 'max-w-full h-full'
  };

  const modalClasses = clsx(
    'fixed inset-0 z-50 flex items-center justify-center p-4',
    className
  );

  const overlayClasses = clsx(
    'absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm',
    closeOnOverlayClick && 'cursor-pointer'
  );

  const contentClasses = clsx(
    'relative bg-white rounded-lg shadow-xl w-full max-h-full overflow-hidden',
    sizeClasses[size]
  );

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className={modalClasses}>
      <div className={overlayClasses} onClick={handleOverlayClick} />
      <div className={contentClasses}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Responsive modal with actions
interface ResponsiveModalWithActionsProps extends ResponsiveModalProps {
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }>;
  loading?: boolean;
}

export function ResponsiveModalWithActions({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  actions = [],
  loading = false,
  ...props
}: ResponsiveModalWithActionsProps) {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      {...props}
    >
      <div className="space-y-6">
        {/* Content */}
        <div>{children}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4 border-t border-slate-200">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled || loading}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  action.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50',
                  action.variant === 'secondary' && 'bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50',
                  action.variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
                  !action.variant && 'bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50'
                )}
              >
                {loading ? 'Loading...' : action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
}

// Responsive confirmation modal
interface ResponsiveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ResponsiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
  loading = false
}: ResponsiveConfirmationModalProps) {
  const variantClasses = {
    danger: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600'
  };

  const confirmButtonClasses = {
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-amber-600 text-white hover:bg-amber-700',
    info: 'bg-blue-600 text-white hover:bg-blue-700'
  };

  return (
    <ResponsiveModalWithActions
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      actions={[
        {
          label: cancelLabel,
          onClick: onClose,
          variant: 'secondary'
        },
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: variant === 'danger' ? 'danger' : 'primary',
          disabled: loading
        }
      ]}
      loading={loading}
    >
      <div className="flex items-start space-x-3">
        <div className={clsx('flex-shrink-0', variantClasses[variant])}>
          {variant === 'danger' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {variant === 'warning' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {variant === 'info' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm sm:text-base text-slate-600">{message}</p>
        </div>
      </div>
    </ResponsiveModalWithActions>
  );
}

// Responsive drawer modal
interface ResponsiveDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
}

export function ResponsiveDrawerModal({
  isOpen,
  onClose,
  children,
  title,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  className = ''
}: ResponsiveDrawerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  const sizeClasses = {
    sm: position === 'left' || position === 'right' ? 'w-64 sm:w-80' : 'h-64 sm:h-80',
    md: position === 'left' || position === 'right' ? 'w-80 sm:w-96' : 'h-80 sm:h-96',
    lg: position === 'left' || position === 'right' ? 'w-96 sm:w-[28rem]' : 'h-96 sm:h-[28rem]',
    xl: position === 'left' || position === 'right' ? 'w-[28rem] sm:w-[32rem]' : 'h-[28rem] sm:h-[32rem]',
    full: position === 'left' || position === 'right' ? 'w-full' : 'h-full'
  };

  const transformClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full'
  };

  const modalClasses = clsx(
    'fixed inset-0 z-50 flex',
    position === 'left' || position === 'right' ? 'items-stretch' : 'items-end',
    className
  );

  const overlayClasses = 'absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm';

  const contentClasses = clsx(
    'relative bg-white shadow-xl flex flex-col',
    positionClasses[position],
    sizeClasses[size],
    'transform transition-transform duration-300 ease-in-out',
    transformClasses[position]
  );

  return (
    <div className={modalClasses}>
      <div className={overlayClasses} onClick={onClose} />
      <div className={contentClasses}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                aria-label="Close drawer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
