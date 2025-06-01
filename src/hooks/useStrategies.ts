import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Strategy } from '../types/domains/strategy.types';
import { getStrategies, getStrategy, createStrategy, updateStrategy, deleteStrategy } from '../services/api';

export const useStrategies = () => {
  return useQuery<Strategy[]>({
    queryKey: ['strategies'],
    queryFn: getStrategies,
  });
};

export const useStrategy = (id: string) => {
  return useQuery<Strategy>({
    queryKey: ['strategies', id],
    queryFn: () => getStrategy(id),
    enabled: !!id,
  });
};

export const useCreateStrategy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Strategy, Error, Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>({
    mutationFn: createStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
  });
};

export const useUpdateStrategy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Strategy, Error, { id: string; data: Partial<Strategy> }>({
    mutationFn: ({ id, data }) => updateStrategy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      queryClient.invalidateQueries({ queryKey: ['strategies', id] });
    },
  });
};

export const useDeleteStrategy = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
    },
  });
};
