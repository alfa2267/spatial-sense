import type { ReactNode } from 'react';
import { UserCreatedEntity } from '../utils/common.types';

/**
 * Strategy status type
 */
export type StrategyStatus = 'active' | 'inactive' | 'draft' | 'archived';

/**
 * Strategy type/category
 */
export type StrategyType = 'home_automation' | 'energy_saving' | 'security' | 'custom' | 'client_project' | string;

/**
 * Device status in a strategy
 */
export interface StrategyDevice {
  /** Type of device */
  type: string;
  /** Icon name for the device */
  icon: string;
  /** Number of devices */
  count: number;
  /** Status of the device in the strategy */
  status: 'included' | 'recommended' | 'required';
  /** Reason for recommendation (if applicable) */
  reason?: string;
}

/**
 * Strategy trigger
 */
export interface StrategyTrigger {
  /** Type of trigger (e.g., Time, Motion, etc.) */
  type: string;
  /** Value of the trigger (e.g., time, sensor name) */
  value: string;
  /** Days of the week (for time-based triggers) */
  days?: string[];
  /** Additional condition */
  condition?: string;
}

/**
 * Strategy action
 */
export interface StrategyAction {
  /** Type of action */
  type: string;
  /** Target device or service */
  target: string;
  /** Action to perform */
  action: string;
  /** Action parameters */
  params?: Record<string, unknown>;
}

/**
 * Represents a strategy configuration
 */
export interface Strategy extends UserCreatedEntity {
  lastUpdated: ReactNode;
  /** Type of strategy */
  type: StrategyType;
  /** Name of the strategy */
  name: string;
  /** Description of the strategy */
  description: string;
  /** Category of the strategy */
  category?: string;
  /** Icon name for the strategy */
  icon?: string;
  /** Current status of the strategy */
  status: StrategyStatus;
  /** List of devices in this strategy */
  devices: StrategyDevice[];
  /** List of recommended devices for this strategy */
  recommendedDevices: StrategyDevice[];
  /** Triggers that activate this strategy */
  triggers: StrategyTrigger[];
  /** Actions performed by this strategy */
  actions: StrategyAction[];
  /** Client ID (for client-specific strategies) */
  clientId?: string;
  /** Client name (for display) */
  clientName?: string;
  /** Project ID (for project-specific strategies) */
  projectId?: string;
  /** Project name (for display) */
  projectName?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Additional settings */
  settings?: Record<string, unknown>;
  /** Rules for the strategy */
  rules: Array<{
    id: string;
    type: string;
    condition: string;
    action: string;
    params: Record<string, any>;
  }>;
}

/**
 * Data required to create a new strategy
 */
export type CreateStrategyDTO = Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Data required to update an existing strategy
 */
export type UpdateStrategyDTO = Partial<Omit<Strategy, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Strategy filter options
 */
export interface StrategyFilters {
  /** Filter by status */
  status?: StrategyStatus | StrategyStatus[];
  /** Filter by type */
  type?: StrategyType | StrategyType[];
  /** Filter by category */
  category?: string | string[];
  /** Filter by client ID */
  clientId?: string | string[];
  /** Filter by project ID */
  projectId?: string | string[];
  /** Search term */
  search?: string;
  /** Tags to filter by */
  tags?: string[];
}
