/**
 * Standard error codes used in the application
 */
export enum ErrorCode {
  // General errors (1000-1999)
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_REQUEST = 'BAD_REQUEST',
  TIMEOUT = 'TIMEOUT',
  CONFLICT = 'CONFLICT',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Authentication & Authorization (2000-2099)
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  INVALID_VERIFICATION_TOKEN = 'INVALID_VERIFICATION_TOKEN',

  // Resource errors (3000-3999)
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_IN_USE = 'RESOURCE_IN_USE',
  RESOURCE_LIMIT_EXCEEDED = 'RESOURCE_LIMIT_EXCEEDED',
  INVALID_RESOURCE_STATE = 'INVALID_RESOURCE_STATE',

  // Validation errors (4000-4999)
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PHONE = 'INVALID_PHONE',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_URL = 'INVALID_URL',
  VALUE_TOO_SHORT = 'VALUE_TOO_SHORT',
  VALUE_TOO_LONG = 'VALUE_TOO_LONG',
  VALUE_OUT_OF_RANGE = 'VALUE_OUT_OF_RANGE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_CHOICE = 'INVALID_CHOICE',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
}

/**
 * Standard error response format
 */
export interface ApiError extends Error {
  /** Error code */
  code: ErrorCode | string;
  /** HTTP status code */
  status: number;
  /** Additional error details */
  details?: unknown;
  /** Validation errors (if applicable) */
  validationErrors?: Array<{
    /** Field that failed validation */
    field: string;
    /** Error message */
    message: string;
    /** Error code */
    code: string;
    /** Additional context */
    context?: Record<string, unknown>;
  }>;
  /** Whether the error is a client error (4xx) */
  isClientError: boolean;
  /** Whether the error is a server error (5xx) */
  isServerError: boolean;
  /** Whether the error is a network error */
  isNetworkError: boolean;
}

import { ApiErrorResponse } from './response.types';

/**
 * @deprecated Use ApiErrorResponse from './response.types' instead
 */
export type ErrorResponse = ApiErrorResponse;
