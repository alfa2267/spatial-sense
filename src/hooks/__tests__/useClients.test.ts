import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClients } from '../useClients';
import { Client, Status } from '../../types/data';
import React, { ReactNode } from 'react';
import * as api from '../../services/api';

// Mock the data service
jest.mock('../../services/data/dataService', () => ({
  dataService: {
    getClients: jest.fn(),
    createClient: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
  },
}));

const { dataService } = require('../../services/data/dataService');

// Define a test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return Wrapper;
};

describe('useClients', () => {
  const mockClients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: Status.ACTIVE as const,
      company: 'Acme Inc',
      phone: '123-456-7890',
      notes: 'Important client',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'USA'
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: Status.INACTIVE as const,
      company: 'Globex Corp',
      phone: '987-654-3210',
      notes: 'Inactive client',
      address: {
        street: '456 Oak St',
        city: 'Othertown',
        state: 'NY',
        postalCode: '54321',
        country: 'USA'
      },
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ] as const satisfies readonly Client[];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Reset the query client
    queryClient.clear();
  });

  it('should fetch clients on mount', async () => {
    dataService.getClients.mockResolvedValueOnce([...mockClients]);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.clients).toEqual([]);

    // Wait for the query to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // After loading
    expect(result.current.loading).toBe(false);
    expect(result.current.clients).toEqual(mockClients);
    expect(dataService.getClients).toHaveBeenCalledTimes(1);
  });

  it('should filter clients by search term', async () => {
    dataService.getClients.mockResolvedValueOnce(mockClients);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Set search term
    act(() => {
      result.current.setSearchTerm('john');
    });

    // Should filter to only include John
    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clients[0]?.name).toBe('John Doe');
  });

  it('should filter clients by status', async () => {
    dataService.getClients.mockResolvedValueOnce(mockClients);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Set status filter to inactive
    act(() => {
      result.current.setStatusFilter('inactive');
    });

    // Should filter to only include inactive clients
    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clients[0]?.name).toBe('Jane Smith');
  });

  it('should sort clients by name', async () => {
    dataService.getClients.mockResolvedValueOnce(mockClients);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Set sort to name-desc
    act(() => {
      result.current.setSortBy('name-desc');
    });

    // Should be sorted by name Z-A
    expect(result.current.clients[0]?.name).toBe('John Doe');
    expect(result.current.clients[1]?.name).toBe('Jane Smith');

    // Set sort to name-asc
    act(() => {
      result.current.setSortBy('name-asc');
    });

    // Should be sorted by name A-Z
    expect(result.current.clients[0]?.name).toBe('Jane Smith');
    expect(result.current.clients[1]?.name).toBe('John Doe');
  });

  it('should handle client creation', async () => {
    const newClient = {
      id: '3',
      name: 'New Client',
      email: 'new@example.com',
      status: Status.PENDING as const,
      company: 'New Company',
      phone: '555-555-5555',
      notes: 'New client',
      address: {
        street: '789 Pine St',
        city: 'New City',
        state: 'CA',
        postalCode: '90210',
        country: 'USA'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.getClients.mockResolvedValueOnce([...mockClients]);
    dataService.createClient.mockResolvedValueOnce(newClient);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Create new client
    await act(async () => {
      await result.current.createClient(newClient);
    });

    expect(dataService.createClient).toHaveBeenCalledWith(newClient);
    expect(result.current.clients).toContainEqual(newClient);
  });

  it('should handle client update', async () => {
    const updatedClient = {
      ...mockClients[0],
      name: 'Updated Name',
    };

    dataService.getClients.mockResolvedValueOnce([...mockClients]);
    dataService.updateClient.mockResolvedValueOnce(updatedClient);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Update client
    await act(async () => {
      await result.current.updateClient(updatedClient);
    });

    expect(dataService.updateClient).toHaveBeenCalledWith(updatedClient);
    expect(result.current.clients).toContainEqual(updatedClient);
  });

  it('should handle client deletion', async () => {
    const clientToDelete = mockClients[0];

    dataService.getClients.mockResolvedValueOnce([...mockClients]);
    dataService.deleteClient.mockResolvedValueOnce(undefined);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Delete client
    await act(async () => {
      await result.current.deleteClient(clientToDelete.id);
    });

    expect(dataService.deleteClient).toHaveBeenCalledWith(clientToDelete.id);
    expect(result.current.clients).not.toContainEqual(clientToDelete);
  });

  it('should handle errors when fetching clients', async () => {
    const errorMessage = 'Failed to fetch clients';
    dataService.getClients.mockRejectedValueOnce(new Error(errorMessage));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Initial state
    expect(result.current.loading).toBe(true);

    // Wait for the query to reject
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should have error state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});
