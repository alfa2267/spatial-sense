import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event } from '../types/domains/event.types';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../services/api';

type EventFilters = {
  type?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
};

export const useEvents = (filters: EventFilters = {}) => {
  return useQuery<Event[], Error>({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });
};

export const useEvent = (id: string) => {
  return useQuery<Event, Error>({
    queryKey: ['events', id],
    queryFn: () => getEvent(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Event, Error, Omit<Event, 'id' | 'timestamp'>>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Event, Error, { id: string; data: Partial<Event> }>({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
