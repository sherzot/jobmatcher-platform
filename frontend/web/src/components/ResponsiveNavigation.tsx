import React, { useState } from 'react';
import { clsx } from 'clsx';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'header' | 'sidebar' | 'tabs' | 'breadcrumb';
  orientation?: 'horizontal' | 'vertical';
  mobileMenu?: boolean;
  mobileBreakpoint?: 'sm' | 'md' | 'lg';
}

export default function ResponsiveNavigation({
  children,
  className = '',
  variant = 'header',
  orientation = 'horizontal',
  mobileMenu = true,
  mobileBreakpoint = 'lg'
}: ResponsiveNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const baseClasses = 'flex items-center';
  
  const variantClasses = {
    header: 'bg-white border-b border-slate-200 shadow-sm',
    sidebar: 'bg-slate-50 border-r border-slate-200',
    tabs: 'border-b border-slate-200',
    breadcrumb: 'bg-slate-50 border-b border-slate-200'
  };

  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const mobileBreakpointClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden'
  };

  const navClasses = clsx(
    baseClasses,
    variantClasses[variant],
    orientationClasses[orientation],
    className
  );

  return (
    <nav className={navClasses}>
      {mobileMenu && (
        <button
          onClick={toggleMobileMenu}
          className={clsx(
            'p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors',
            mobileBreakpointClasses[mobileBreakpoint]
          )}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      )}
      
      <div className={clsx(
        'flex-1',
        mobileMenu && mobileBreakpointClasses[mobileBreakpoint],
        mobileMenu && isMobileMenuOpen && 'block',
        mobileMenu && !isMobileMenuOpen && 'hidden'
      )}>
        {children}
      </div>
    </nav>
  );
}

// Responsive navigation item
interface ResponsiveNavigationItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function ResponsiveNavigationItem({
  children,
  href,
  active = false,
  disabled = false,
  onClick,
  className = '',
  icon
}: ResponsiveNavigationItemProps) {
  const baseClasses = 'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors';
  
  const stateClasses = {
    active: 'bg-blue-100 text-blue-700',
    inactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    disabled: 'text-slate-400 cursor-not-allowed'
  };

  const itemClasses = clsx(
    baseClasses,
    disabled ? stateClasses.disabled : active ? stateClasses.active : stateClasses.inactive,
    className
  );

  const Component = href ? 'a' : 'button';
  const componentProps = href ? { href } : { onClick, type: 'button' as const };

  return (
    <Component className={itemClasses} {...componentProps}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Component>
  );
}

// Responsive tabs
interface ResponsiveTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function ResponsiveTabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default'
}: ResponsiveTabsProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const variantClasses = {
    default: 'border-b border-slate-200',
    pills: 'bg-slate-100 p-1 rounded-lg',
    underline: 'border-b border-slate-200'
  };

  const tabClasses = {
    default: 'px-3 py-2 text-sm font-medium border-b-2 transition-colors',
    pills: 'px-3 py-2 text-sm font-medium rounded-md transition-colors',
    underline: 'px-3 py-2 text-sm font-medium border-b-2 transition-colors'
  };

  const activeClasses = {
    default: 'border-blue-500 text-blue-600',
    pills: 'bg-white text-slate-900 shadow-sm',
    underline: 'border-blue-500 text-blue-600'
  };

  const inactiveClasses = {
    default: 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
    pills: 'text-slate-600 hover:text-slate-900',
    underline: 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
  };

  const tabsClasses = clsx(
    'flex flex-col sm:flex-row',
    variantClasses[variant],
    className
  );

  return (
    <div>
      <div className={tabsClasses}>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle tabs menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop tabs */}
        <div className="hidden sm:flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              disabled={tab.disabled}
              className={clsx(
                tabClasses[variant],
                activeTab === tab.id ? activeClasses[variant] : inactiveClasses[variant],
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile tabs */}
        <div className={clsx(
          'sm:hidden',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                disabled={tab.disabled}
                className={clsx(
                  'w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                  tab.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

// Responsive breadcrumb
interface ResponsiveBreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
  className?: string;
  separator?: React.ReactNode;
}

export function ResponsiveBreadcrumb({
  items,
  className = '',
  separator = '/'
}: ResponsiveBreadcrumbProps) {
  const breadcrumbClasses = clsx(
    'flex items-center space-x-2 text-sm',
    className
  );

  return (
    <nav className={breadcrumbClasses} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2 text-slate-400">{separator}</span>
          )}
          {item.current ? (
            <span className="text-slate-500 font-medium">{item.label}</span>
          ) : item.href ? (
            <a
              href={item.href}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-slate-600">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Responsive pagination
interface ResponsivePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  showPrevNext?: boolean;
}

export function ResponsivePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  showPrevNext = true
}: ResponsivePaginationProps) {
  const paginationClasses = clsx(
    'flex items-center justify-center space-x-1',
    className
  );

  const buttonClasses = 'px-3 py-2 text-sm font-medium rounded-md transition-colors';
  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  const disabledClasses = 'text-slate-400 cursor-not-allowed';

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <nav className={paginationClasses} aria-label="Pagination">
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            buttonClasses,
            currentPage === 1 ? disabledClasses : inactiveClasses
          )}
        >
          Previous
        </button>
      )}

      {showPageNumbers && (
        <div className="hidden sm:flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-slate-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={clsx(
                    buttonClasses,
                    currentPage === page ? activeClasses : inactiveClasses
                  )}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showPageNumbers && (
        <div className="sm:hidden">
          <span className="px-3 py-2 text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            buttonClasses,
            currentPage === totalPages ? disabledClasses : inactiveClasses
          )}
        >
          Next
        </button>
      )}
    </nav>
  );
}
