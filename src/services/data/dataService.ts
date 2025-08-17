import { Project, Client } from '../../types';
import { ApiResponse } from '../../types/api/response.types';
import { BaseDataService } from './BaseDataService';

export class DataService extends BaseDataService {
  // Expose the base protected fetch as a public method for consumers
  public async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return super.fetch<T>(endpoint, options);
  }
  private static async loadData<T>(file: string): Promise<T> {
    try {
      const response = await fetch(`/data/${file}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
      throw error;
    }
  }

  static async getClients(): Promise<Client[]> {
    return this.loadData<Client[]>('clients.json');
  }

  static async getProjects(): Promise<Project[]> {
    try {
      const projects = await this.loadData<Project[]>('projects.json');
      
      if (!projects || (Array.isArray(projects) && projects.length === 0) || 
          (typeof projects === 'object' && Object.keys(projects).length === 0)) {
        console.warn('No valid projects data found, using default data');
        return this.getDefaultProjects();
      }
      
      return projects;
    } catch (error) {
      console.warn('Error loading projects, using default data:', error);
      return this.getDefaultProjects();
    }
  }
  
  private static getDefaultProjects(): Project[] {
    return [
      {
        id: 'proj-001',
        name: 'Residential Property Analysis',
        clientId: 'client-001',
        status: 'active',
        progress: 65,
        startDate: new Date().toISOString(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        budget: 5000,
        description: 'Comprehensive analysis of residential property market trends',
        location: 'London',
        type: 'residential',
        team: ['user-001', 'user-002'],
        tags: ['residential', 'market-analysis', 'high-priority'],
        createdBy: 'user-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Add more default projects as needed
    ];
  }
  
  // Add other data access methods here as needed
}

export const dataService = new DataService();
