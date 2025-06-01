// Core types and utilities

// Domain-specific types
export * from './domains/client.types';
export * from './domains/project.types';
export * from './domains/device.types';
export * from './domains/strategy.types';
export * from './domains/dashboard.types';
export * from './domains/invoice.types';
export * from './domains/timeline.types';

// API types
export * from './api';

// Utility types
export * from './utils/common.types';
export * from './utils/form.types';
export * from './utils/table.types';

// Re-export the global type augmentations
export * from './global.d';
