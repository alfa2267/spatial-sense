import { ApiResponse } from '../../types/api/response.types';

type EntityType = 
  | 'clients' 
  | 'projects' 
  | 'devices' 
  | 'strategies' 
  | 'dashboards' 
  | 'invoices' 
  | 'timeline' 
  | 'floorplans';

interface DataServiceConfig {
  baseUrl: string;
  useMockData: boolean;
  mockDataPath: string;
}

// Base interface for entities with common fields
interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type for create operations (without id, createdAt, updatedAt)
type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// Type for update operations (without createdAt, but can include updatedAt)
type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt'>>;

export abstract class BaseDataService {
  protected config: DataServiceConfig = {
    baseUrl: '/api',
    useMockData: true,
    mockDataPath: '/data'
  };

  /**
   * Configure the data service
   */
  public configure(config: Partial<DataServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generic fetch wrapper with error handling
   */
  protected async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (this.config.useMockData) {
      return this.mockFetch<T>(endpoint, options);
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If parsing JSON fails, use the default error message
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Mock implementation for local JSON files
   */
  private async mockFetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Clean and parse the endpoint
    const pathParts = endpoint.replace(/^\//, '').split('/').filter(Boolean);
    const [entityType, id] = pathParts;
    const method = options.method || 'GET';

    // Validate entity type
    if (!this.isValidEntityType(entityType)) {
      throw new Error(`Invalid entity type: ${entityType}`);
    }

    try {
      if (method === 'GET' && entityType && !id) {
        // GET /entities
        const response = await fetch(`${this.config.mockDataPath}/${entityType}.json`);
        if (!response.ok) {
          throw new Error(`Mock data file not found: ${entityType}.json`);
        }
        const data = await response.json();
        return { data, success: true } as ApiResponse<T>;
        
      } else if (method === 'GET' && entityType && id) {
        // GET /entities/:id
        const response = await fetch(`${this.config.mockDataPath}/${entityType}.json`);
        if (!response.ok) {
          throw new Error(`Mock data file not found: ${entityType}.json`);
        }
        const items = await response.json();
        const data = Array.isArray(items) ? items.find((item: any) => item.id === id) : null;
        
        if (!data) {
          throw new Error(`${this.getEntitySingular(entityType)} with id '${id}' not found`);
        }
        return { data, success: true } as ApiResponse<T>;
        
      } else if (method === 'POST' && entityType) {
        // POST /entities
        if (!options.body) {
          throw new Error('Request body is required for POST operations');
        }
        
        const newItem = JSON.parse(options.body as string);
        const now = new Date().toISOString();
        const mockEntity = {
          ...newItem,
          id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now
        };
        
        return { data: mockEntity, success: true } as ApiResponse<T>;
        
      } else if (method === 'PUT' && entityType && id) {
        // PUT /entities/:id
        if (!options.body) {
          throw new Error('Request body is required for PUT operations');
        }
        
        const updates = JSON.parse(options.body as string);
        const updatedEntity = {
          ...updates,
          id, // Ensure ID is preserved
          updatedAt: new Date().toISOString()
        };
        
        return { data: updatedEntity, success: true } as ApiResponse<T>;
        
      } else if (method === 'DELETE' && entityType && id) {
        // DELETE /entities/:id
        return { 
          data: { success: true, id } as T, 
          success: true 
        } as ApiResponse<T>;
      }
      
      throw new Error(`Unsupported operation: ${method} ${endpoint}`);
      
    } catch (error) {
      console.error('Mock fetch error:', error);
      throw error;
    }
  }

  /**
   * Validate if the entity type is supported
   */
  private isValidEntityType(entityType: string): entityType is EntityType {
    const validTypes: EntityType[] = [
      'clients', 'projects', 'devices', 'strategies', 
      'dashboards', 'invoices', 'timeline', 'floorplans'
    ];
    return validTypes.includes(entityType as EntityType);
  }

  /**
   * Get singular form of entity type for error messages
   */
  private getEntitySingular(entityType: EntityType): string {
    const singularMap: Record<EntityType, string> = {
      clients: 'client',
      projects: 'project',
      devices: 'device',
      strategies: 'strategy',
      dashboards: 'dashboard',
      invoices: 'invoice',
      timeline: 'timeline',
      floorplans: 'floorplan'
    };
    return singularMap[entityType] || entityType;
  }

  // Generic CRUD Operations with improved type safety
  protected async getAllEntities<T extends BaseEntity>(
    entityType: EntityType,
    params: Record<string, string | number | boolean> = {}
  ): Promise<T[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const query = searchParams.toString();
    const endpoint = `/${entityType}${query ? `?${query}` : ''}`;
    const response = await this.fetch<T[]>(endpoint);
    return response?.data || [];
  }

  protected async getEntityById<T extends BaseEntity>(
    entityType: EntityType,
    id: string
  ): Promise<T> {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid ID is required');
    }
    
    const response = await this.fetch<T>(`/${entityType}/${encodeURIComponent(id)}`);
    if (!response.data) {
      throw new Error(`No data returned for ${entityType} with id ${id}`);
    }
    return response.data;
  }

  protected async createEntity<T extends BaseEntity>(
    entityType: EntityType,
    data: CreateData<T>
  ): Promise<T> {
    if (!data || typeof data !== 'object') {
      throw new Error('Valid data object is required');
    }
    
    const response = await this.fetch<T>(`/${entityType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.data) {
      throw new Error(`Failed to create ${entityType}`);
    }
    return response.data;
  }

  protected async updateEntity<T extends BaseEntity>(
    entityType: EntityType,
    id: string,
    data: UpdateData<T>
  ): Promise<T> {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid ID is required');
    }
    if (!data || typeof data !== 'object') {
      throw new Error('Valid data object is required');
    }
    
    const response = await this.fetch<T>(`/${entityType}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.data) {
      throw new Error(`Failed to update ${entityType} with id ${id}`);
    }
    return response.data;
  }

  protected async deleteEntity(
    entityType: EntityType,
    id: string
  ): Promise<{ success: boolean; id: string }> {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid ID is required');
    }
    
    const response = await this.fetch<{ success: boolean; id: string }>(
      `/${entityType}/${encodeURIComponent(id)}`, 
      { method: 'DELETE' }
    );
    
    if (!response.data) {
      throw new Error(`Failed to delete ${entityType} with id ${id}`);
    }
    
    return { success: true, id };
  }
}