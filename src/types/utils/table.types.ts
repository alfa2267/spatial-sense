import { ReactNode } from 'react';

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  /** Unique key for the column */
  key: string;
  /** Column header */
  header: string | ReactNode;
  /** Function to render cell content */
  cell?: (row: T, index: number) => ReactNode;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Custom sort function */
  sortFn?: (a: T, b: T) => number;
  /** Column width */
  width?: string | number;
  /** Minimum column width */
  minWidth?: string | number;
  /** Maximum column width */
  maxWidth?: string | number;
  /** Whether the column is resizable */
  resizable?: boolean;
  /** Whether the column is visible */
  visible?: boolean;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Column class name */
  className?: string;
  /** Header class name */
  headerClassName?: string;
  /** Cell class name */
  cellClassName?: string | ((row: T, index: number) => string);
  /** Whether to truncate text with ellipsis */
  ellipsis?: boolean;
  /** Tooltip content */
  tooltip?: string | ((row: T) => string);
  /** Whether the column is sticky */
  sticky?: boolean | 'left' | 'right';
  /** Additional props for the column header */
  headerProps?: Record<string, unknown>;
  /** Additional props for the column cells */
  cellProps?: Record<string, unknown> | ((row: T, index: number) => Record<string, unknown>);
}

/**
 * Table sort configuration
 */
export interface TableSort {
  /** Sort key */
  key: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Table pagination configuration
 */
export interface TablePagination {
  /** Current page (1-based) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Whether to show page size options */
  showSizeOptions?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Whether to show quick jump */
  showQuickJumper?: boolean;
  /** Whether to show total */
  showTotal?: boolean;
  /** Custom total renderer */
  renderTotal?: (total: number, range: [number, number]) => ReactNode;
}

/**
 * Table selection configuration
 */
export interface TableSelection<T> {
  /** Selected row keys */
  selectedRowKeys: React.Key[];
  /** Whether to show selection checkboxes */
  showCheckbox?: boolean;
  /** Selection type */
  type?: 'checkbox' | 'radio';
  /** Whether to select rows on click */
  selectOnClickRow?: boolean;
  /** Whether to highlight selected rows */
  highlightSelectedRows?: boolean;
  /** Whether to preserve selection on page change */
  preserveSelectedRowKeys?: boolean;
  /** Callback when selection changes */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  /** Custom row selection configuration */
  getCheckboxProps?: (row: T) => {
    disabled?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Table row expansion configuration
 */
export interface TableRowExpansion<T> {
  /** Expanded row keys */
  expandedRowKeys: React.Key[];
  /** Whether to expand rows by default */
  defaultExpandedRowKeys?: React.Key[];
  /** Whether to expand rows on click */
  expandOnClickRow?: boolean;
  /** Whether to show expand/collapse all */
  showExpandAll?: boolean;
  /** Whether to show expanded rows on hover */
  showHoverExpand?: boolean;
  /** Custom expanded row renderer */
  expandedRowRender?: (row: T, index: number) => ReactNode;
  /** Callback when expanded rows change */
  onExpandedRowsChange?: (expandedRowKeys: React.Key[]) => void;
  /** Row class name */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Expand icon */
  expandIcon?: (props: { expanded: boolean; row: T; onExpand: () => void }) => ReactNode;
}

/**
 * Table filter configuration
 */
export interface TableFilter<T = any> {
  /** Filter key */
  key: string;
  /** Filter label */
  label: string;
  /** Filter type */
  type: 'text' | 'select' | 'multi-select' | 'date' | 'date-range' | 'number' | 'number-range' | 'custom';
  /** Filter options (for select/multi-select) */
  options?: Array<{ label: string; value: any }>;
  /** Filter placeholder */
  placeholder?: string;
  /** Default value */
  defaultValue?: any;
  /** Custom filter component */
  component?: React.ComponentType<{
    value: any;
    onChange: (value: any) => void;
    [key: string]: any;
  }>;
  /** Additional props for the filter component */
  componentProps?: Record<string, unknown>;
  /** Custom filter function */
  filterFn?: (value: any, row: T) => boolean;
  /** Whether to show filter icon */
  showFilterIcon?: boolean;
  /** Whether the filter is visible */
  visible?: boolean;
}
