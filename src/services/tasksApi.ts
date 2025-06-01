import { TimelineEvent } from '../types/domains/timeline.types';

// Mock API service to fetch tasks from tasks.json
const API_BASE_URL = '/api';

export const tasksApi = {
  getTasks: async (): Promise<TimelineEvent[]> => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_BASE_URL}/tasks`);
      // return response.json();
      
      // For now, we'll use the tasks.json file directly
      const response = await fetch('/tasks.json');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  // Add other task-related API methods as needed
};
