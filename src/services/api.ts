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
  const entities = ['clients', 'strategies', 'invoices', 'floorplans', 'dashboard', 'projects', 'tasks', 'devices', 'events'];
  
  for (const entity of entities) {
    if (!localStorage.getItem(`${LOCAL_STORAGE_KEY}-${entity}`)) {
      try {
        const response = await fetch(`${STATIC_DATA_BASE}/${entity}.json`);
        const data = await response.json();
        localStorage.setItem(`${LOCAL_STORAGE_KEY}-${entity}`, JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to initialize localStorage for ${entity}:`, error);
      }
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
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Device[]>('/devices');
  }
  
  try {
    const data = await getData('devices');
    return Array.isArray(data) ? data : (data.devices || []);
  } catch (error) {
    console.error('Error loading devices:', error);
    return [];
  }
};

export const getDevice = async (id: string): Promise<Device> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Device>(`/devices/${id}`);
  }
  
  const devices = await getDevices();
  const device = devices.find(d => d.id === id);
  if (!device) throw new Error('Device not found');
  return device;
};

export const createDevice = async (device: CreateDeviceDTO): Promise<Device> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Device>('/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  }
  
  const devices = await getDevices();
  const newDevice: Device = {
    ...device,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedDevices = [...devices, newDevice];
  saveData('devices', updatedDevices);
  
  return newDevice;
};

export const updateDevice = async (id: string, device: UpdateDeviceDTO): Promise<Device> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Device>(`/devices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(device),
    });
  }
  
  const devices = await getDevices();
  const deviceIndex = devices.findIndex(d => d.id === id);
  
  if (deviceIndex === -1) {
    throw new Error('Device not found');
  }
  
  const updatedDevice: Device = {
    ...devices[deviceIndex],
    ...device,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedDevices = [...devices];
  updatedDevices[deviceIndex] = updatedDevice;
  
  saveData('devices', updatedDevices);
  
  return updatedDevice;
};

export const deleteDevice = async (id: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    await fetchData(`/devices/${id}`, {
      method: 'DELETE',
    });
    return;
  }
  
  const devices = await getDevices();
  const updatedDevices = devices.filter(device => device.id !== id);
  
  if (updatedDevices.length === devices.length) {
    throw new Error('Device not found');
  }
  
  saveData('devices', updatedDevices);
};

// Events
export const getEvents = async (params: { 
  limit?: number; 
  type?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<Event[]> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.type) query.append('type', params.type);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    
    return fetchData<Event[]>(`/events?${query.toString()}`);
  }
  
  try {
    let data = await getData('events');
    let events = Array.isArray(data) ? data : (data.events || []);
    
    // Apply filters
    if (params.type) {
      events = events.filter((event: Event) => event.type === params.type);
    }
    if (params.startDate) {
      events = events.filter((event: Event) => event.timestamp >= params.startDate!);
    }
    if (params.endDate) {
      events = events.filter((event: Event) => event.timestamp <= params.endDate!);
    }
    if (params.limit) {
      events = events.slice(0, params.limit);
    }
    
    return events;
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const getEvent = async (id: string): Promise<Event> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Event>(`/events/${id}`);
  }
  
  const events = await getEvents();
  const event = events.find(e => e.id === id);
  if (!event) throw new Error('Event not found');
  return event;
};

export const createEvent = async (event: Omit<Event, 'id' | 'timestamp'>): Promise<Event> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }
  
  const events = await getEvents();
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  
  const updatedEvents = [...events, newEvent];
  saveData('events', updatedEvents);
  
  return newEvent;
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Event>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(event),
    });
  }
  
  const events = await getEvents();
  const eventIndex = events.findIndex(e => e.id === id);
  
  if (eventIndex === -1) {
    throw new Error('Event not found');
  }
  
  const updatedEvent: Event = {
    ...events[eventIndex],
    ...event,
  };
  
  const updatedEvents = [...events];
  updatedEvents[eventIndex] = updatedEvent;
  
  saveData('events', updatedEvents);
  
  return updatedEvent;
};

export const deleteEvent = async (id: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    await fetchData(`/events/${id}`, {
      method: 'DELETE',
    });
    return;
  }
  
  const events = await getEvents();
  const updatedEvents = events.filter(event => event.id !== id);
  
  if (updatedEvents.length === events.length) {
    throw new Error('Event not found');
  }
  
  saveData('events', updatedEvents);
};

// Invoices
export const getInvoices = async (params: { 
  clientId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<Invoice[]> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    const query = new URLSearchParams();
    if (params?.clientId) query.append('clientId', params.clientId);
    if (params?.status) query.append('status', params.status);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    
    return fetchData<Invoice[]>(`/invoices?${query.toString()}`);
  }
  
  try {
    let data = await getData('invoices');
    let invoices = Array.isArray(data) ? data : (data.invoices || []);
    
    // Apply filters
    if (params.clientId) {
      invoices = invoices.filter((invoice: Invoice) => invoice.clientId === params.clientId);
    }
    if (params.status) {
      invoices = invoices.filter((invoice: Invoice) => invoice.status === params.status);
    }
    if (params.startDate) {
      invoices = invoices.filter((invoice: Invoice) => invoice.invoiceDate >= params.startDate!);
    }
    if (params.endDate) {
      invoices = invoices.filter((invoice: Invoice) => invoice.invoiceDate <= params.endDate!);
    }
    
    return invoices;
  } catch (error) {
    console.error('Error loading invoices:', error);
    return [];
  }
};

export const getInvoice = async (id: string): Promise<Invoice> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Invoice>(`/invoices/${id}`);
  }
  
  const invoices = await getInvoices();
  const invoice = invoices.find(i => i.id === id);
  if (!invoice) throw new Error('Invoice not found');
  return invoice;
};

export const createInvoice = async (invoice: CreateInvoiceDTO): Promise<Invoice> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
  }
  
  const invoices = await getInvoices();
  const newInvoice: Invoice = {
    ...invoice,
    id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedInvoices = [...invoices, newInvoice];
  saveData('invoices', updatedInvoices);
  
  return newInvoice;
};

export const updateInvoice = async (id: string, invoice: UpdateInvoiceDTO): Promise<Invoice> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(invoice),
    });
  }
  
  const invoices = await getInvoices();
  const invoiceIndex = invoices.findIndex(i => i.id === id);
  
  if (invoiceIndex === -1) {
    throw new Error('Invoice not found');
  }
  
  const updatedInvoice: Invoice = {
    ...invoices[invoiceIndex],
    ...invoice,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedInvoices = [...invoices];
  updatedInvoices[invoiceIndex] = updatedInvoice;
  
  saveData('invoices', updatedInvoices);
  
  return updatedInvoice;
};

export const deleteInvoice = async (id: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    await fetchData(`/invoices/${id}`, {
      method: 'DELETE',
    });
    return;
  }
  
  const invoices = await getInvoices();
  const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
  
  if (updatedInvoices.length === invoices.length) {
    throw new Error('Invoice not found');
  }
  
  saveData('invoices', updatedInvoices);
};

// Floor Plans
export const getFloorPlans = async (): Promise<any[]> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<any[]>('/floorplans');
  }
  
  try {
    const data = await getData('floorplans');
    return data.floorplans || [];
  } catch (error) {
    console.error('Error loading floor plans:', error);
    return [];
  }
};

export const getFloorPlan = async (id: string): Promise<any> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<any>(`/floorplans/${id}`);
  }
  
  const floorPlans = await getFloorPlans();
  const floorPlan = floorPlans.find(fp => fp.id === id);
  if (!floorPlan) throw new Error('Floor plan not found');
  return floorPlan;
};

export const createFloorPlan = async (floorPlan: any): Promise<any> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<any>('/floorplans', {
      method: 'POST',
      body: JSON.stringify(floorPlan),
    });
  }
  
  const floorPlans = await getFloorPlans();
  const newFloorPlan = {
    ...floorPlan,
    id: `fp-${new Date().getFullYear()}-${String(floorPlans.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const data = await getData('floorplans');
  const updatedData = {
    ...data,
    floorplans: [...floorPlans, newFloorPlan],
    metadata: {
      ...data.metadata,
      totalFloorplans: floorPlans.length + 1
    }
  };
  
  saveData('floorplans', updatedData);
  return newFloorPlan;
};

export const updateFloorPlan = async (id: string, floorPlan: any): Promise<any> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<any>(`/floorplans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(floorPlan),
    });
  }
  
  const floorPlans = await getFloorPlans();
  const floorPlanIndex = floorPlans.findIndex(fp => fp.id === id);
  
  if (floorPlanIndex === -1) {
    throw new Error('Floor plan not found');
  }
  
  const updatedFloorPlan = {
    ...floorPlans[floorPlanIndex],
    ...floorPlan,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedFloorPlans = [...floorPlans];
  updatedFloorPlans[floorPlanIndex] = updatedFloorPlan;
  
  const data = await getData('floorplans');
  const updatedData = {
    ...data,
    floorplans: updatedFloorPlans
  };
  
  saveData('floorplans', updatedData);
  return updatedFloorPlan;
};

export const deleteFloorPlan = async (id: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    await fetchData(`/floorplans/${id}`, {
      method: 'DELETE',
    });
    return;
  }
  
  const floorPlans = await getFloorPlans();
  const updatedFloorPlans = floorPlans.filter(fp => fp.id !== id);
  
  if (updatedFloorPlans.length === floorPlans.length) {
    throw new Error('Floor plan not found');
  }
  
  const data = await getData('floorplans');
  const updatedData = {
    ...data,
    floorplans: updatedFloorPlans,
    metadata: {
      ...data.metadata,
      totalFloorplans: updatedFloorPlans.length
    }
  };
  
  saveData('floorplans', updatedData);
};

// Floor Plan Editor - Save/Load reactive flow data
export const saveFloorPlanEditor = async (editorData: { nodes: any[], edges: any[], backgroundImage?: string }): Promise<void> => {
  if (USE_STATIC_DATA) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}-floorplan-editor`, JSON.stringify(editorData));
  }
};

export const loadFloorPlanEditor = async (): Promise<{ nodes: any[], edges: any[], backgroundImage?: string } | null> => {
  if (USE_STATIC_DATA) {
    const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}-floorplan-editor`);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Strategies
export const getStrategies = async (): Promise<Strategy[]> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Strategy[]>('/strategies');
  }
  
  try {
    const data = await getData('strategies');
    return Array.isArray(data) ? data : (data.strategies || []);
  } catch (error) {
    console.error('Error loading strategies:', error);
    return [];
  }
};

export const getStrategy = async (id: string): Promise<Strategy> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Strategy>(`/strategies/${id}`);
  }
  
  const strategies = await getStrategies();
  const strategy = strategies.find(s => s.id === id);
  if (!strategy) throw new Error('Strategy not found');
  return strategy;
};

export const createStrategy = async (strategy: Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Strategy> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Strategy>('/strategies', {
      method: 'POST',
      body: JSON.stringify(strategy),
    });
  }
  
  const strategies = await getStrategies();
  const newStrategy: Strategy = {
    ...strategy,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user' // You might want to get this from auth context
  };
  
  const updatedStrategies = [...strategies, newStrategy];
  saveData('strategies', updatedStrategies);
  
  return newStrategy;
};

export const updateStrategy = async (id: string, strategy: Partial<Strategy>): Promise<Strategy> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    return fetchData<Strategy>(`/strategies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(strategy),
    });
  }
  
  const strategies = await getStrategies();
  const strategyIndex = strategies.findIndex(s => s.id === id);
  
  if (strategyIndex === -1) {
    throw new Error('Strategy not found');
  }
  
  const updatedStrategy: Strategy = {
    ...strategies[strategyIndex],
    ...strategy,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedStrategies = [...strategies];
  updatedStrategies[strategyIndex] = updatedStrategy;
  
  saveData('strategies', updatedStrategies);
  
  return updatedStrategy;
};

export const deleteStrategy = async (id: string): Promise<void> => {
  if (process.env.NODE_ENV === 'development' && !USE_STATIC_DATA) {
    await fetchData(`/strategies/${id}`, {
      method: 'DELETE',
    });
    return;
  }
  
  const strategies = await getStrategies();
  const updatedStrategies = strategies.filter(strategy => strategy.id !== id);
  
  if (updatedStrategies.length === strategies.length) {
    throw new Error('Strategy not found');
  }
  
  saveData('strategies', updatedStrategies);
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
