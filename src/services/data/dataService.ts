import { Project, Client } from '../../types';

export class DataService {
  fetch(arg0: string): import("../../types/api/response.types").ApiResponse<import("../../types").Strategy[]> | PromiseLike<import("../../types/api/response.types").ApiResponse<import("../../types").Strategy[]>> {
    throw new Error('Method not implemented.');
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Add more default projects as needed
    ];
  }
  
  // Add other data access methods here as needed
}

export const dataService = new DataService();
