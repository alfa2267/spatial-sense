export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  progress: number;
  startDate: string;
  targetDate: string;
  budget: number;
  description: string;
  location: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  activeClients: number;
  clientGrowth: number;
  activeProjects: number;
  projectGrowth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  clientRating: number;
  reviewCount: number;
  recentProjects: Project[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
  metadata?: Record<string, any>;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  source: string;
  data?: Record<string, any>;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  notes?: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  settings: Record<string, any>;
  rules: Array<{
    id: string;
    type: string;
    condition: string;
    action: string;
    params: Record<string, any>;
  }>;
}

export interface Timeline {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  events: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    timestamp: string;
    data?: Record<string, any>;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
