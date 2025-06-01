/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data (if successful) */
  data?: T;
  /** Error information (if not successful) */
  error?: {
    /** Error code */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Additional error details */
    details?: unknown;
  };
  /** Pagination information (if applicable) */
  pagination?: {
    /** Total number of items */
    total: number;
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * Paginated list response
 */
export interface PaginatedList<T> {
  /** Array of items */
  items: T[];
  /** Total number of items */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Standard error response from the API
 */
export interface ApiErrorResponse {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** HTTP status code */
  status: number;
  /** Additional error details */
  details?: unknown;
  /** Validation errors (if applicable) */
  validationErrors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * @deprecated Use ApiErrorResponse instead
 */
export type ErrorResponse = ApiErrorResponse;
