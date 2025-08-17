import { QueryClient } from '@tanstack/react-query';
import { DashboardStats } from '../types/data';
import { Client } from '../types/domains/client.types';
import { mockApiClients } from './mockData';
import { Project, CreateProjectDTO, UpdateProjectDTO, ProjectFilters } from '../types/domains/project.types';
import { Device, CreateDeviceDTO, UpdateDeviceDTO } from '../types/domains/device.types';
import { Event } from '../types/domains/event.types';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../types/domains/invoice.types';
import { Strategy } from '../types/domains/strategy.types';
import { Timeline, CreateTimelineDTO, UpdateTimelineDTO } from '../types/domains/timeline.types';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// For GitHub Pages, we'll use static JSON files and localStorage
const USE_STATIC_DATA = true;
const STATIC_DATA_BASE = '/data';
const LOCAL_STORAGE_KEY = 'spatial-sense-data';

// Initialize localStorage with default data if empty
const initializeLocalStorage = async () => {
  if (!localStorage.getItem(`${LOCAL_STORAGE_KEY}-clients`)) {
    try {
      const response = await fetch(`${STATIC_DATA_BASE}/clients.json`);
      const data = await response.json();
      localStorage.setItem(`${LOCAL_STORAGE_KEY}-clients`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to initialize localStorage with default data:', error);
    }
  }
};

// Get data from localStorage or fallback to static file
const getData = async (key: string) => {
  if (USE_STATIC_DATA) {
    const storedData = localStorage.getItem(`${LOCAL_STORAGE_KEY}-${key}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
    const response = await fetch(`${STATIC_DATA_BASE}/${key}.json`);
    return response.json();
  }
  return {};
};

// Save data to localStorage
const saveData = (key: string, data: any) => {
  if (USE_STATIC_DATA) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}-${key}`, JSON.stringify(data));
  }
};

// Initialize localStorage with default data
initializeLocalStorage();

const API_BASE_URL = process.env.NODE_ENV === 'production' && !USE_STATIC_DATA ? '/api' : '';

async function fetchData<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

// Clients - Use static data in production
export const getClients = async (): Promise<Client[]> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return mockApiClients.getAll();
  }
  
  try {
    const data = await getData('clients');
    return Array.isArray(data) ? data : (data.clients || []);
  } catch (error) {
    console.error('Error loading clients:', error);
    return [];
  }
};

export const getClient = async (id: string): Promise<Client> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return mockApiClients.getById(id);
  }
  
  const clients = await getClients();
  const client = clients.find(c => c.id === id);
  if (!client) throw new Error('Client not found');
  return client;
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return mockApiClients.create(client);
  }
  
  const clients = await getClients();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedClients = [...clients, newClient];
  saveData('clients', updatedClients);
  
  return newClient;
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return mockApiClients.update(id, client);
  }
  
  const clients = await getClients();
  const clientIndex = clients.findIndex(c => c.id === id);
  
  if (clientIndex === -1) {
    throw new Error('Client not found');
  }
  
  const updatedClient: Client = {
    ...clients[clientIndex],
    ...client,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedClients = [...clients];
  updatedClients[clientIndex] = updatedClient;
  
  saveData('clients', updatedClients);
  
  return updatedClient;
};

export const deleteClient = async (id: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return mockApiClients.delete(id);
  }
  
  const clients = await getClients();
  const updatedClients = clients.filter(client => client.id !== id);
  
  if (updatedClients.length === clients.length) {
    throw new Error('Client not found');
  }
  
  saveData('clients', updatedClients);
};

// Projects
export const getProjects = async (filters: ProjectFilters = {}): Promise<Project[]> => {
  const query = new URLSearchParams();
  
  // Handle string or array values for clientId
  if (filters.clientId) {
    const clientIds = Array.isArray(filters.clientId) 
      ? filters.clientId 
      : [filters.clientId];
    clientIds.forEach(id => query.append('clientId', id));
  }
  
  // Handle status filter (single or multiple)
  if (filters.status) {
    const statuses = Array.isArray(filters.status)
      ? filters.status
      : [filters.status];
    statuses.forEach(status => query.append('status', status));
  }
  
  // Handle team member filter
  if (filters.teamMemberId) {
    query.append('teamMemberId', filters.teamMemberId);
  }
  
  // Handle date filters
  if (filters.startDateFrom) query.append('startDateFrom', filters.startDateFrom);
  if (filters.startDateTo) query.append('startDateTo', filters.startDateTo);
  if (filters.endDateFrom) query.append('endDateFrom', filters.endDateFrom);
  if (filters.endDateTo) query.append('endDateTo', filters.endDateTo);
  
  // Handle search query
  if (filters.search) query.append('search', filters.search);
  
  return fetchData<Project[]>(`/projects?${query.toString()}`);
};

export const getProject = async (id: string): Promise<Project> => {
  return fetchData<Project>(`/projects/${id}`);
};

export const createProject = async (project: CreateProjectDTO): Promise<Project> => {
  return fetchData<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  });
};

export const updateProject = async (id: string, project: UpdateProjectDTO): Promise<Project> => {
  return fetchData<Project>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(project),
  });
};

export const deleteProject = async (id: string): Promise<void> => {
  await fetchData(`/projects/${id}`, {
    method: 'DELETE',
  });
};

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return fetchData<DashboardStats>('/dashboard/stats');
};

// Devices
export const getDevices = async (): Promise<Device[]> => {
  return fetchData<Device[]>('/devices');
};

export const getDevice = async (id: string): Promise<Device> => {
  return fetchData<Device>(`/devices/${id}`);
};

export const createDevice = async (device: CreateDeviceDTO): Promise<Device> => {
  return fetchData<Device>('/devices', {
    method: 'POST',
    body: JSON.stringify(device),
  });
};

export const updateDevice = async (id: string, device: UpdateDeviceDTO): Promise<Device> => {
  return fetchData<Device>(`/devices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(device),
  });
};

export const deleteDevice = async (id: string): Promise<void> => {
  await fetchData(`/devices/${id}`, {
    method: 'DELETE',
  });
};

// Events
export const getEvents = async (params: { 
  limit?: number; 
  type?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<Event[]> => {
  const query = new URLSearchParams();
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.type) query.append('type', params.type);
  if (params?.startDate) query.append('startDate', params.startDate);
  if (params?.endDate) query.append('endDate', params.endDate);
  
  return fetchData<Event[]>(`/events?${query.toString()}`);
};

export const getEvent = async (id: string): Promise<Event> => {
  return fetchData<Event>(`/events/${id}`);
};

export const createEvent = async (event: Omit<Event, 'id' | 'timestamp'>): Promise<Event> => {
  return fetchData<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  return fetchData<Event>(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(event),
  });
};

export const deleteEvent = async (id: string): Promise<void> => {
  await fetchData(`/events/${id}`, {
    method: 'DELETE',
  });
};

// Invoices
export const getInvoices = async (params: { 
  clientId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<Invoice[]> => {
  const query = new URLSearchParams();
  if (params?.clientId) query.append('clientId', params.clientId);
  if (params?.status) query.append('status', params.status);
  if (params?.startDate) query.append('startDate', params.startDate);
  if (params?.endDate) query.append('endDate', params.endDate);
  
  return fetchData<Invoice[]>(`/invoices?${query.toString()}`);
};

export const getInvoice = async (id: string): Promise<Invoice> => {
  return fetchData<Invoice>(`/invoices/${id}`);
};

export const createInvoice = async (invoice: CreateInvoiceDTO): Promise<Invoice> => {
  return fetchData<Invoice>('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoice),
  });
};

export const updateInvoice = async (id: string, invoice: UpdateInvoiceDTO): Promise<Invoice> => {
  return fetchData<Invoice>(`/invoices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(invoice),
  });
};

export const deleteInvoice = async (id: string): Promise<void> => {
  await fetchData(`/invoices/${id}`, {
    method: 'DELETE',
  });
};

// Strategies
export const getStrategies = async (): Promise<Strategy[]> => {
  return fetchData<Strategy[]>('/strategies');
};

export const getStrategy = async (id: string): Promise<Strategy> => {
  return fetchData<Strategy>(`/strategies/${id}`);
};

export const createStrategy = async (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Strategy> => {
  return fetchData<Strategy>('/strategies', {
    method: 'POST',
    body: JSON.stringify(strategy),
  });
};

export const updateStrategy = async (id: string, strategy: Partial<Strategy>): Promise<Strategy> => {
  return fetchData<Strategy>(`/strategies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(strategy),
  });
};

export const deleteStrategy = async (id: string): Promise<void> => {
  await fetchData(`/strategies/${id}`, {
    method: 'DELETE',
  });
};

// Timelines
export const getTimelines = async (): Promise<Timeline[]> => {
  return fetchData<Timeline[]>('/timelines');
};

export const getTimeline = async (id: string): Promise<Timeline> => {
  return fetchData<Timeline>(`/timelines/${id}`);
};

export const createTimeline = async (timeline: CreateTimelineDTO): Promise<Timeline> => {
  return fetchData<Timeline>('/timelines', {
    method: 'POST',
    body: JSON.stringify(timeline),
  });
};

export const updateTimeline = async (id: string, timeline: UpdateTimelineDTO): Promise<Timeline> => {
  return fetchData<Timeline>(`/timelines/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(timeline),
  });
};

export const deleteTimeline = async (id: string): Promise<void> => {
  await fetchData(`/timelines/${id}`, {
    method: 'DELETE',
  });
};
