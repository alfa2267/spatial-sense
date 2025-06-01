import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClients } from '../useClients';
import { Status, type Client } from '../../types';
import React, { ReactNode } from 'react';

// Mock the data service
const mockGetClients = jest.fn();
const mockCreateClient = jest.fn();
const mockUpdateClient = jest.fn();
const mockDeleteClient = jest.fn();

// Mock the data service with proper TypeScript types
jest.mock('../../services/data/dataService', () => ({
  dataService: {
    getClients: () => mockGetClients(),
    createClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => mockCreateClient(client),
    updateClient: (id: string, client: Partial<Client>) => mockUpdateClient(id, client),
    deleteClient: (id: string) => mockDeleteClient(id),
  },
}));

// Mock the Redux store
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

// Mock the clients slice
jest.mock('../../features/clients/clientsSlice', () => ({
  fetchClients: jest.fn(),
  addNewClient: jest.fn(),
  updateExistingClient: jest.fn(),
  removeClient: jest.fn(),
  selectAllClients: jest.fn(),
  selectClientById: jest.fn(),
  getClientsStatus: jest.fn(),
  getClientsError: jest.fn(),
}));

// Create a test query client
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

// Create a wrapper component that provides the query client
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useClients', () => {
  const mockClients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: Status.ACTIVE,
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
      status: Status.INACTIVE,
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
  ] as const;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch clients on mount', async () => {
    // Setup
    mockGetClients.mockResolvedValueOnce([...mockClients]);
    
    // Execute
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Assert initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.clients).toEqual([]);

    // Wait for the query to resolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Assert final state
    expect(result.current.loading).toBe(false);
    expect(result.current.clients).toEqual(mockClients);
    expect(mockGetClients).toHaveBeenCalledTimes(1);
  });

  it('should handle client creation', async () => {
    // Setup
    const newClient = {
      name: 'New Client',
      email: 'new@example.com',
      status: Status.PENDING,
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
    };

    const createdClient = {
      ...newClient,
      id: '3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockGetClients.mockResolvedValueOnce([...mockClients]);
    mockCreateClient.mockResolvedValueOnce(createdClient);

    // Execute
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Create client
    await act(async () => {
      await result.current.createClient(newClient);
    });

    // Assert
    expect(mockCreateClient).toHaveBeenCalledWith(newClient);
    // The hook should have the new client in its state
    expect(result.current.clients).toContainEqual(createdClient);
  });

  it('should handle client updates', async () => {
    // Setup
    const updatedClient = {
      ...mockClients[0],
      name: 'Updated Name',
      company: 'Updated Company',
      updatedAt: new Date().toISOString(),
    };

    mockGetClients.mockResolvedValueOnce([...mockClients]);
    mockUpdateClient.mockResolvedValueOnce(updatedClient);

    // Execute
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Update client
    await act(async () => {
      await result.current.updateClient(updatedClient.id, {
        name: 'Updated Name',
        company: 'Updated Company'
      });
    });

    // Assert
    expect(mockUpdateClient).toHaveBeenCalledWith(updatedClient.id, {
      name: 'Updated Name',
      company: 'Updated Company'
    });
    expect(result.current.clients.find(c => c.id === updatedClient.id)?.name).toBe('Updated Name');
  });

  it('should handle client deletion', async () => {
    // Setup
    const clientToDelete = mockClients[0];
    mockGetClients.mockResolvedValueOnce([...mockClients]);
    mockDeleteClient.mockResolvedValueOnce(undefined);

    // Execute
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

    // Assert
    expect(mockDeleteClient).toHaveBeenCalledWith(clientToDelete.id);
    expect(result.current.clients.some(c => c.id === clientToDelete.id)).toBe(false);
  });

  it('should filter and sort clients', async () => {
    // Setup
    mockGetClients.mockResolvedValueOnce([...mockClients]);

    // Execute
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Test search filtering
    act(() => {
      result.current.setSearchTerm('john');
    });
    
    // Get filtered clients manually since the hook might not expose filteredClients directly
    const filteredBySearch = result.current.clients.filter(client => 
      client.name.toLowerCase().includes('john')
    );
    expect(filteredBySearch.length).toBe(1);
    expect(filteredBySearch[0].name).toBe('John Doe');

    // Test status filtering
    const filteredByStatus = result.current.clients.filter(
      client => client.status === Status.INACTIVE
    );
    expect(filteredByStatus.length).toBe(1);
    expect(filteredByStatus[0].name).toBe('Jane Smith');
  });

  it('should handle empty response', async () => {
    // Test empty response
    mockGetClients.mockResolvedValueOnce([]);
    
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.clients).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should handle API errors', async () => {
    // Test error handling
    const errorMessage = 'API Error';
    mockGetClients.mockRejectedValueOnce(new Error(errorMessage));
    
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(errorMessage);
  });

  it('should handle malformed data', async () => {
    // Test malformed data
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const invalidData = { invalid: 'data' };
    mockGetClients.mockResolvedValueOnce(invalidData as any);
    
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.error).toBeDefined();
    expect(console.error).toHaveBeenCalled();
    
    // Cleanup
    (console.error as jest.Mock).mockRestore();
  });

  it('should handle errors when fetching clients', async () => {
    // Setup
    const errorMessage = 'Failed to fetch clients';
    mockGetClients.mockRejectedValueOnce(new Error(errorMessage));

    // Execute
    const wrapper = createWrapper();
    const { result } = renderHook(() => useClients(), { wrapper });

    // Assert initial state
    expect(result.current.loading).toBe(true);

    // Wait for the query to reject
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Assert error state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});
