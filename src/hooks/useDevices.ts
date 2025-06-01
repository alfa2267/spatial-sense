import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Device, CreateDeviceDTO, UpdateDeviceDTO } from '../types/domains/device.types';
import { getDevices, getDevice, createDevice, updateDevice, deleteDevice } from '../services/api';

export const useDevices = () => {
  return useQuery<Device[], Error>({
    queryKey: ['devices'],
    queryFn: getDevices,
  });
};

export const useDevice = (id: string) => {
  return useQuery<Device, Error>({
    queryKey: ['devices', id],
    queryFn: () => getDevice(id),
    enabled: !!id,
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Device, Error, CreateDeviceDTO>({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Device, Error, { id: string; data: UpdateDeviceDTO }>({
    mutationFn: ({ id, data }) => updateDevice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['devices', id] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};
