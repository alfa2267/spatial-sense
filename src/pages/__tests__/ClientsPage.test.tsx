import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClientsPage } from '../ClientsPage';
import { useClients } from '../../hooks/useClients';
import { Status } from '../../types';

// Mock the useClients hook
jest.mock('../../hooks/useClients');

const mockUseClients = useClients as jest.MockedFunction<typeof useClients>;

// Create a test query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      {children}
    </Router>
  </QueryClientProvider>
);

describe('ClientsPage', () => {
  const mockClients = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: Status.ACTIVE as const,
      company: 'Acme Inc',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      phone: '123-456-7890',
      notes: 'Important client',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'USA'
      }
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: Status.INACTIVE as const,
      company: 'Globex Corp',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
      phone: '987-654-3210',
      notes: 'Inactive client',
      address: {
        street: '456 Oak St',
        city: 'Othertown',
        state: 'NY',
        postalCode: '54321',
        country: 'USA'
      }
    },
  ] as const;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation
    mockUseClients.mockReturnValue({
      clients: mockClients,
      selectedClient: null,
      loading: false,
      error: null,
      searchTerm: '',
      statusFilter: 'all',
      sortBy: 'name-asc',
      setSearchTerm: jest.fn(),
      setStatusFilter: jest.fn(),
      setSortBy: jest.fn(),
      setSelectedClient: jest.fn(),
      addClient: jest.fn().mockResolvedValue({}),
      updateClient: jest.fn().mockResolvedValue({}),
      deleteClient: jest.fn().mockResolvedValue({}),
      refreshClients: jest.fn(),
    });
  });
  
  // Helper function to render the component with all required providers
  const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    return render(
      <QueryClientProvider client={queryClient}>
        <Router>
          {ui}
        </Router>
      </QueryClientProvider>
    );
  };

  it('renders the clients page with a list of clients', () => {
    render(<ClientsPage />, { wrapper });
    
    // Check if the page title is rendered
    expect(screen.getByText('Clients')).toBeInTheDocument();
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search clients...')).toBeInTheDocument();
    
    // Check if client names are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows loading state while fetching clients', () => {
    mockUseClients.mockReturnValue({
      ...mockUseClients(),
      loading: true,
      clients: [],
    });

    render(<ClientsPage />, { wrapper });
    
    // Check if loading state is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    mockUseClients.mockReturnValue({
      ...mockUseClients(),
      error: new Error('Failed to load clients'),
      clients: [],
    });

    render(<ClientsPage />, { wrapper });
    
    // Check if error message is shown
    expect(screen.getByText(/failed to load clients/i)).toBeInTheDocument();
  });

  it('allows searching for clients', async () => {
    const setSearchTerm = jest.fn();
    mockUseClients.mockReturnValue({
      ...mockUseClients(),
      setSearchTerm,
    });

    render(<ClientsPage />, { wrapper });
    
    // Type in the search input
    const searchInput = screen.getByPlaceholderText('Search clients...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Check if setSearchTerm was called
    await waitFor(() => {
      expect(setSearchTerm).toHaveBeenCalledWith('John');
    });
  });

  it('allows filtering clients by status', async () => {
    const setStatusFilter = jest.fn();
    mockUseClients.mockReturnValue({
      ...mockUseClients(),
      setStatusFilter,
    });

    render(<ClientsPage />, { wrapper });
    
    // Open the status filter dropdown
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusFilter);
    
    // Select 'Active' status
    const activeOption = screen.getByText('Active');
    fireEvent.click(activeOption);
    
    // Check if setStatusFilter was called with 'active'
    await waitFor(() => {
      expect(setStatusFilter).toHaveBeenCalledWith('active');
    });
  });

  it('allows sorting clients', async () => {
    const setSortBy = jest.fn();
    mockUseClients.mockReturnValue({
      ...mockUseClients(),
      setSortBy,
    });

    render(<ClientsPage />, { wrapper });
    
    // Open the sort dropdown
    const sortBy = screen.getByLabelText('Sort By');
    fireEvent.mouseDown(sortBy);
    
    // Select 'Name (Z-A)' sort option
    const sortOption = screen.getByText('Name (Z-A)');
    fireEvent.click(sortOption);
    
    // Check if setSortBy was called with 'name-desc'
    await waitFor(() => {
      expect(setSortBy).toHaveBeenCalledWith('name-desc');
    });
  });

  it('opens the add client form when the add button is clicked', () => {
    render(<ClientsPage />, { wrapper });
    
    // Click the add client button
    const addButton = screen.getByText('Add Client');
    fireEvent.click(addButton);
    
    // Check if the form dialog is opened
    expect(screen.getByText('Add New Client')).toBeInTheDocument();
  });

  it('selects a client when clicked', async () => {
    const setSelectedClient = jest.fn();
    mockUseClients.mockReturnValue({
      ...mockUseClients(),
      setSelectedClient,
    });

    render(<ClientsPage />, { wrapper });
    
    // Click on a client in the list
    const clientItem = screen.getByText('John Doe');
    fireEvent.click(clientItem);
    
    // Check if setSelectedClient was called with the correct client
    await waitFor(() => {
      expect(setSelectedClient).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
      }));
    });
  });
});
