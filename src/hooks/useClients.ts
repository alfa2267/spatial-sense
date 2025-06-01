import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Client, CreateClientDTO, UpdateClientDTO } from '../types/domains/client.types';
import { getClients, getClient, createClient, updateClient, deleteClient } from '../services/api';
import { useState, useMemo } from 'react';

export const useClients = () => {
  const queryClient = useQueryClient();
  
  // Get all clients
  const { 
    data: clients = [], 
    isLoading, 
    error 
  } = useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // Get a single client by ID
  const useClient = (id: string) => {
    return useQuery<Client, Error>({
      queryKey: ['clients', id],
      queryFn: () => getClient(id),
      enabled: !!id,
    });
  };

  // Create a new client
  const createClientMutation = useMutation<Client, Error, CreateClientDTO>({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Update an existing client
  const updateClientMutation = useMutation<Client, Error, { id: string; data: UpdateClientDTO }>({
    mutationFn: ({ id, data }) => updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });

  // Delete a client
  const deleteClientMutation = useMutation<void, Error, string>({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  // Filter and sort clients
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name-asc');

  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        client =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          (client.company && client.company.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(client => client.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [clients, searchTerm, statusFilter, sortBy]);

  return {
    clients,
    filteredClients,
    loading: isLoading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    addClient: createClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClient: deleteClientMutation.mutateAsync,
    useClient,
  };
};
