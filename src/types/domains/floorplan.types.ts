import { MeasurementUnit } from '../utils/common.types';

/**
 * Represents a floor plan in the system
 */
export interface FloorPlan {
  /** Unique identifier for the floor plan */
  id: string;
  /** Name of the floor plan */
  name: string;
  /** ID of the project this floor plan belongs to */
  projectId: string;
  /** URL to the floor plan image */
  imageUrl: string;
  /** Width of the floor plan in the specified units */
  width: number;
  /** Height of the floor plan in the specified units */
  height: number;
  /** Scale of the floor plan (e.g., 1:100) */
  scale: number;
  /** Units of measurement */
  units: MeasurementUnit;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** ISO timestamp of when the floor plan was created */
  createdAt: string;
  /** ISO timestamp of when the floor plan was last updated */
  updatedAt: string;
}

/**
 * Data required to create a new floor plan
 */
export type CreateFloorPlanDTO = Omit<FloorPlan, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Data required to update an existing floor plan
 */
export type UpdateFloorPlanDTO = Partial<Omit<FloorPlan, 'id' | 'createdAt' | 'updatedAt'>>;
