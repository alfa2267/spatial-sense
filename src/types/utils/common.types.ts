/**
 * Common enums used throughout the application
 */

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  COMPLETED = 'completed',
  ON_HOLD = 'on-hold',
  CANCELLED = 'cancelled',
  MAINTENANCE = 'maintenance',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  LEAD = 'lead',
  PAUSED = 'paused',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PLANNING = 'planning'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer'
}

export enum MeasurementUnit {
  METERS = 'meters',
  FEET = 'feet'
}

export enum EventType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

/**
 * Base interface for all entities with common fields
 */
export interface BaseEntity {
  /** Unique identifier */
  id: string;
  /** ISO timestamp of when the entity was created */
  createdAt: string;
  /** ISO timestamp of when the entity was last updated */
  updatedAt: string;
}

/**
 * Base interface for user-created entities
 */
export interface UserCreatedEntity extends BaseEntity {
  /** ID of the user who created this entity */
  createdBy: string;
  /** Optional description */
  description?: string;
  /** Optional tags for categorization */
  tags?: string[];
}

/**
 * Utility Types
 * ============
 */

/**
 * Makes all properties in T optional, including nested objects
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Makes all properties in T required, including nested objects
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Makes all properties in T readonly, including nested objects
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Makes all properties in T mutable, including nested objects
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

/**
 * Extracts the type of a property from a type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Creates a type that is T with a set of properties K set to required
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Creates a type that is T with a set of properties K set to optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Creates a type that is T with a set of properties K set to never
 */
export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Creates a type that is T with a set of properties K set to never (alias for Without)
 */
export type Omit<T, K extends keyof T> = Without<T, K>;

/**
 * Creates a type that is T with a set of properties K set to the specified type
 */
export type Override<T, K extends keyof T, V> = Omit<T, K> & { [P in K]: V };

/**
 * Creates a type that is the union of all values of T
 */
export type Values<T> = T[keyof T];

/**
 * Creates a type that is an array of the keys of T
 */
export type Keys<T> = Array<keyof T>;

/**
 * Creates a type that is a union of all possible values of T
 */
export type ValueOfUnion<T> = T extends { [key: string]: infer U } ? U : never;

/**
 * Creates a type that is the type of the first argument of a function
 */
export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any ? U : never;

/**
 * Creates a type that is the return type of a function
 */
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

/**
 * Creates a type that is a promise that resolves to T
 */
export type PromiseType<T> = T extends Promise<infer U> ? U : T;

/**
 * Creates a type that is a dictionary with string keys and values of type T
 */
export type Dictionary<T> = { [key: string]: T };

/**
 * Creates a type that is a readonly dictionary with string keys and values of type T
 */
export type ReadonlyDictionary<T> = { readonly [key: string]: T };

/**
 * Creates a type that is a partial dictionary with string keys and values of type T
 */
export type PartialDictionary<T> = { [key: string]: T | undefined };
