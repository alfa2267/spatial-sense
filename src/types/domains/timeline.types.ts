import { UserCreatedEntity } from '../utils/common.types';

export type TimelineStatus = 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
export type TimelinePriority = 'low' | 'medium' | 'high' | 'critical';
export type TimelineView = 'month' | 'week' | 'day' | 'list';

/**
 * Represents an event in a timeline
 */
export interface TimelineEvent {
  /** Unique identifier for the event */
  id: string;
  /** Title of the event */
  title: string;
  /** Description of the event */
  description: string;
  /** Start date of the event */
  startDate: Date;
  /** End date of the event */
  endDate: Date;
  /** Project associated with the event */
  project: string;
  /** Assignee of the event */
  assignee: string;
  /** Status of the event */
  status: TimelineStatus;
  /** Priority of the event */
  priority: TimelinePriority;
  /** Color of the event */
  color: string;
  /** Whether the event is an all-day event */
  isAllDay?: boolean;
  /** When the event was created */
  createdAt: Date;
  /** When the event was last updated */
  updatedAt: Date;
}

/**
 * Represents a timeline of events
 */
export interface Timeline extends UserCreatedEntity {
  /** Name of the timeline */
  name: string;
  /** Description of the timeline */
  description: string;
  /** Start date of the timeline */
  startDate: string;
  /** End date of the timeline */
  endDate: string;
  /** Array of events in the timeline */
  events: TimelineEvent[];
}

/**
 * Represents a project in the timeline
 */
export interface TimelineProject {
  id: string;
  name: string;
  color: string;
}

/**
 * Represents a team member
 */
export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

/**
 * Timeline filter options
 */
export interface TimelineFilter {
  project: string;
  assignee: string;
  status: string;
  priority: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/**
 * Data required to create a new timeline
 */
export type CreateTimelineDTO = Omit<Timeline, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'events'>;

/**
 * Data required to update an existing timeline
 */
export type UpdateTimelineDTO = Partial<Omit<Timeline, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'events'>>;
