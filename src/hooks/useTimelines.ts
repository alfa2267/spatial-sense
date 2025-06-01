import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Timeline, CreateTimelineDTO, UpdateTimelineDTO } from '../types/domains/timeline.types';
import { getTimelines, getTimeline, createTimeline, updateTimeline, deleteTimeline } from '../services/api';

export const useTimelines = () => {
  return useQuery<Timeline[], Error>({
    queryKey: ['timelines'],
    queryFn: getTimelines,
  });
};

export const useTimeline = (id: string) => {
  return useQuery<Timeline, Error>({
    queryKey: ['timelines', id],
    queryFn: () => getTimeline(id),
    enabled: !!id,
  });
};

export const useCreateTimeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Timeline, Error, CreateTimelineDTO>({
    mutationFn: createTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
    },
  });
};

export const useUpdateTimeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Timeline, Error, { id: string; data: UpdateTimelineDTO }>({
    mutationFn: ({ id, data }) => updateTimeline(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
      queryClient.invalidateQueries({ queryKey: ['timelines', id] });
    },
  });
};

export const useDeleteTimeline = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteTimeline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
    },
  });
};
