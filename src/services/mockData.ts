import { Client } from '../types/domains/client.types';

// Mock data for development
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+44 7123 456789',
    company: 'Johnson & Associates',
    address: '123 Smart Street, London, SW1A 1AA, UK',
    status: 'active',
    notes: 'Interested in full home automation system. Has a Victorian house in Kensington.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '2', 
    name: 'Marcus Chen',
    email: 'marcus.chen@techcorp.com',
    phone: '+44 7987 654321',
    company: 'TechCorp Solutions',
    address: '456 Innovation Ave, Shoreditch, London, E1 6AN, UK',
    status: 'lead',
    notes: 'Looking for smart office solutions. Modern apartment in Shoreditch.',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-05T11:20:00Z'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@luxury.co.uk',
    phone: '+44 7456 789123',
    company: 'Luxury Properties Ltd',
    address: '789 Executive Tower, Canary Wharf, London, E14 5AB, UK',
    status: 'active',
    notes: 'Premium client interested in luxury automation for penthouse.',
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-25T09:30:00Z'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'david.thompson@gmail.com',
    phone: '+44 7321 654987',
    company: '',
    address: '321 Residential Close, Richmond, London, TW9 2ND, UK',
    status: 'inactive',
    notes: 'Previous client - completed project last year. May be interested in future upgrades.',
    createdAt: '2023-12-05T14:20:00Z',
    updatedAt: '2023-12-20T10:15:00Z'
  },
  {
    id: '5',
    name: 'Jennifer Smith',
    email: 'jennifer.smith@startup.io',
    phone: '+44 7789 456123',
    company: 'StartupHub',
    address: '654 Creative Quarter, Hackney, London, E8 3RL, UK',
    status: 'lead',
    notes: 'Startup founder looking for affordable smart office solutions.',
    createdAt: '2024-02-10T13:45:00Z',
    updatedAt: '2024-02-12T15:30:00Z'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApiClients = {
  getAll: async (): Promise<Client[]> => {
    await delay(300); // Simulate network delay
    return [...mockClients];
  },
  
  getById: async (id: string): Promise<Client> => {
    await delay(200);
    const client = mockClients.find(c => c.id === id);
    if (!client) {
      throw new Error('Client not found');
    }
    return { ...client };
  },
  
  create: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    await delay(500);
    const newClient: Client = {
      ...clientData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockClients.push(newClient);
    return { ...newClient };
  },
  
  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    await delay(400);
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    
    const updatedClient = {
      ...mockClients[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    mockClients[index] = updatedClient;
    return { ...updatedClient };
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Client not found');
    }
    mockClients.splice(index, 1);
  }
};