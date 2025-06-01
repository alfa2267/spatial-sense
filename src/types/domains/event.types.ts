import { UserCreatedEntity } from '../utils/common.types';

export interface Event extends UserCreatedEntity {
  id: string;
  title: string;
  description: string;
  type: EventType;
  timestamp: string;
  source: string;
  data?: Record<string, any>;
}

export type EventType = 'info' | 'warning' | 'error' | 'success';

export type EventFilters = {
  type?: EventType;
  source?: string;
  startDate?: string;
  endDate?: string;
};
