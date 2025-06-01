/**
 * Base interface for pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort order ('asc' or 'desc') */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Base interface for filter parameters
 */
export interface FilterParams {
  /** Search query string */
  q?: string;
  /** Filter criteria as key-value pairs */
  [key: string]: unknown;
}

/**
 * Standard query parameters for list endpoints
 */
export interface ListQueryParams extends PaginationParams, FilterParams {}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  /** Whether to include metadata in the response */
  includeMetadata?: boolean;
  /** Fields to include in the response */
  fields?: string[];
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Request options for file uploads
 */
export interface UploadOptions extends RequestOptions {
  /** File to upload */
  file: File | Blob;
  /** Upload progress callback */
  onProgress?: (progress: number) => void;
  /** Whether to show a progress indicator */
  showProgress?: boolean;
}
