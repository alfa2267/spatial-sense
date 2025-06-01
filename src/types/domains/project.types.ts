import { UserCreatedEntity } from '../utils/common.types';

/**
 * Project status type
 */
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';

/**
 * Represents a project in the system
 */
export interface Project extends UserCreatedEntity {
  /** Name of the project */
  name: string;
  /** ID of the client this project belongs to */
  clientId: string;
  /** Current status of the project */
  status: ProjectStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** ISO date string for project start */
  startDate: string;
  /** ISO date string for project target completion */
  targetDate: string;
  /** Budget amount in the system's base currency */
  budget: number;
  /** Detailed description of the project */
  description: string;
  /** Physical location of the project */
  location: string;
  /** Type/category of the project */
  type: string;
  /** Array of user IDs who are part of the project team */
  team: string[];
  /** Tags for categorization */
  tags?: string[];
  /** Priority of the project */
  priority?: 'low' | 'medium' | 'high' | 'critical';
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Data required to create a new project
 */
export type CreateProjectDTO = Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & {
  createdBy: string; // Required by UserCreatedEntity
  description: string; // Required by Project
};

/**
 * Data required to update an existing project
 */
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

/**
 * Project filter options
 */
export interface ProjectFilters {
  status?: ProjectStatus | ProjectStatus[];
  clientId?: string | string[];
  teamMemberId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  search?: string;
}
