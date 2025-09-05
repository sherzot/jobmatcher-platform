import React from 'react';
import { clsx } from 'clsx';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'striped' | 'bordered' | 'compact';
  responsive?: boolean;
  hover?: boolean;
}

export default function ResponsiveTable({
  children,
  className = '',
  variant = 'default',
  responsive = true,
  hover = true
}: ResponsiveTableProps) {
  const baseClasses = 'w-full text-sm text-left';
  
  const variantClasses = {
    default: 'bg-white',
    striped: 'bg-white [&>tbody>tr:nth-child(odd)]:bg-slate-50',
    bordered: 'bg-white border border-slate-200',
    compact: 'bg-white [&>tbody>tr>td]:py-2'
  };

  const tableClasses = clsx(
    baseClasses,
    variantClasses[variant],
    hover && '[&>tbody>tr:hover]:bg-slate-50',
    className
  );

  const wrapperClasses = responsive ? 'overflow-x-auto' : '';

  return (
    <div className={wrapperClasses}>
      <table className={tableClasses}>
        {children}
      </table>
    </div>
  );
}

// Responsive table header
interface ResponsiveTableHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}

export function ResponsiveTableHeader({
  children,
  className = '',
  align = 'left',
  sortable = false,
  onSort,
  sortDirection
}: ResponsiveTableHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const headerClasses = clsx(
    'px-4 py-3 font-medium text-slate-900 bg-slate-50 border-b border-slate-200',
    alignClasses[align],
    sortable && 'cursor-pointer hover:bg-slate-100 transition-colors',
    className
  );

  const SortIcon = () => {
    if (!sortable) return null;
    
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    
    if (sortDirection === 'desc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  };

  return (
    <th className={headerClasses} onClick={sortable ? onSort : undefined}>
      <div className="flex items-center">
        {children}
        <SortIcon />
      </div>
    </th>
  );
}

// Responsive table cell
interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  nowrap?: boolean;
}

export function ResponsiveTableCell({
  children,
  className = '',
  align = 'left',
  nowrap = false
}: ResponsiveTableCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const cellClasses = clsx(
    'px-4 py-3 border-b border-slate-200',
    alignClasses[align],
    nowrap && 'whitespace-nowrap',
    className
  );

  return (
    <td className={cellClasses}>
      {children}
    </td>
  );
}

// Responsive table row
interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export function ResponsiveTableRow({
  children,
  className = '',
  onClick,
  clickable = false
}: ResponsiveTableRowProps) {
  const rowClasses = clsx(
    'border-b border-slate-200 last:border-b-0',
    clickable && 'cursor-pointer hover:bg-slate-50 transition-colors',
    className
  );

  return (
    <tr className={rowClasses} onClick={onClick}>
      {children}
    </tr>
  );
}

// Responsive table with mobile cards
interface ResponsiveTableWithCardsProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: Record<string, any>) => React.ReactNode;
    mobile?: boolean;
    align?: 'left' | 'center' | 'right';
  }>;
  className?: string;
  variant?: 'default' | 'striped' | 'bordered' | 'compact';
  onRowClick?: (row: Record<string, any>) => void;
}

export function ResponsiveTableWithCards({
  data,
  columns,
  className = '',
  variant = 'default',
  onRowClick
}: ResponsiveTableWithCardsProps) {
  const mobileColumns = columns.filter(col => col.mobile !== false);
  const desktopColumns = columns;

  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <ResponsiveTable variant={variant}>
          <thead>
            <tr>
              {desktopColumns.map((column) => (
                <ResponsiveTableHeader
                  key={column.key}
                  align={column.align}
                >
                  {column.label}
                </ResponsiveTableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <ResponsiveTableRow
                key={rowIndex}
                clickable={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {desktopColumns.map((column) => (
                  <ResponsiveTableCell
                    key={column.key}
                    align={column.align}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </ResponsiveTableCell>
                ))}
              </ResponsiveTableRow>
            ))}
          </tbody>
        </ResponsiveTable>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={clsx(
              'bg-white rounded-lg border border-slate-200 p-4',
              onRowClick && 'cursor-pointer hover:bg-slate-50 transition-colors'
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            <div className="space-y-3">
              {mobileColumns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-slate-600 min-w-0 flex-1">
                    {column.label}
                  </span>
                  <span className="text-sm text-slate-900 text-right ml-4 min-w-0 flex-1">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Responsive table with expandable rows
interface ResponsiveTableWithExpandableRowsProps {
  data: Array<{
    id: string;
    [key: string]: any;
  }>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
  }>;
  expandedRows: string[];
  onToggleRow: (rowId: string) => void;
  renderExpandedContent: (row: any) => React.ReactNode;
  className?: string;
  variant?: 'default' | 'striped' | 'bordered' | 'compact';
}

export function ResponsiveTableWithExpandableRows({
  data,
  columns,
  expandedRows,
  onToggleRow,
  renderExpandedContent,
  className = '',
  variant = 'default'
}: ResponsiveTableWithExpandableRowsProps) {
  return (
    <ResponsiveTable variant={variant} className={className}>
      <thead>
        <tr>
          <ResponsiveTableHeader className="w-12">
            <span className="sr-only">Expand</span>
          </ResponsiveTableHeader>
          {columns.map((column) => (
            <ResponsiveTableHeader
              key={column.key}
              align={column.align}
            >
              {column.label}
            </ResponsiveTableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const isExpanded = expandedRows.includes(row.id);
          
          return (
            <React.Fragment key={row.id}>
              <ResponsiveTableRow>
                <ResponsiveTableCell>
                  <button
                    onClick={() => onToggleRow(row.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                  >
                    <svg
                      className={clsx(
                        'w-4 h-4 transition-transform',
                        isExpanded && 'rotate-90'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </ResponsiveTableCell>
                {columns.map((column) => (
                  <ResponsiveTableCell
                    key={column.key}
                    align={column.align}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </ResponsiveTableCell>
                ))}
              </ResponsiveTableRow>
              {isExpanded && (
                <ResponsiveTableRow>
                  <ResponsiveTableCell colSpan={columns.length + 1} className="bg-slate-50">
                    <div className="p-4">
                      {renderExpandedContent(row)}
                    </div>
                  </ResponsiveTableCell>
                </ResponsiveTableRow>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </ResponsiveTable>
  );
}

// Responsive table with selection
interface ResponsiveTableWithSelectionProps {
  data: Array<{
    id: string;
    [key: string]: any;
  }>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
  }>;
  selectedRows: string[];
  onSelectionChange: (selectedRows: string[]) => void;
  className?: string;
  variant?: 'default' | 'striped' | 'bordered' | 'compact';
}

export function ResponsiveTableWithSelection({
  data,
  columns,
  selectedRows,
  onSelectionChange,
  className = '',
  variant = 'default'
}: ResponsiveTableWithSelectionProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(data.map(row => row.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedRows, rowId]);
    } else {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    }
  };

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <ResponsiveTable variant={variant} className={className}>
      <thead>
        <tr>
          <ResponsiveTableHeader className="w-12">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </ResponsiveTableHeader>
          {columns.map((column) => (
            <ResponsiveTableHeader
              key={column.key}
              align={column.align}
            >
              {column.label}
            </ResponsiveTableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <ResponsiveTableRow key={row.id}>
            <ResponsiveTableCell>
              <input
                type="checkbox"
                checked={selectedRows.includes(row.id)}
                onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </ResponsiveTableCell>
            {columns.map((column) => (
              <ResponsiveTableCell
                key={column.key}
                align={column.align}
              >
                {column.render ? column.render(row[column.key], row) : row[column.key]}
              </ResponsiveTableCell>
            ))}
          </ResponsiveTableRow>
        ))}
      </tbody>
    </ResponsiveTable>
  );
}
