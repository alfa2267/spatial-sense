import { Project } from './project.types';

/**
 * Statistics for the dashboard
 */
export interface DashboardStats {
  /** Number of active clients */
  activeClients: number;
  /** Growth percentage of clients */
  clientGrowth: number;
  /** Number of active projects */
  activeProjects: number;
  /** Growth percentage of projects */
  projectGrowth: number;
  /** Monthly revenue amount */
  monthlyRevenue: number;
  /** Revenue growth percentage */
  revenueGrowth: number;
  /** Average client rating */
  clientRating: number;
  /** Number of reviews */
  reviewCount: number;
  /** List of recent projects */
  recentProjects: Pick<Project, 'id' | 'name' | 'status' | 'progress'>[];
}

/**
 * Project status with count and color
 */
export interface ProjectStatusData {
  /** Status type */
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  /** Number of projects with this status */
  count: number;
  /** Color code for display */
  color: string;
}

/**
 * Recent activity item
 */
export interface RecentActivity {
  /** Unique identifier */
  id: string;
  /** Activity title */
  title: string;
  /** Activity description */
  description: string;
  /** Time of the activity */
  time: string;
  /** Icon name */
  icon: string;
  /** Color code */
  color: string;
}

/**
 * Revenue data point
 */
export interface RevenueDataPoint {
  /** Date string */
  date: string;
  /** Revenue amount */
  revenue: number;
}

/**
 * Complete dashboard data
 */
export interface DashboardData {
  /** Dashboard statistics */
  stats: DashboardStats;
  /** Project status distribution */
  projectStatus: ProjectStatusData[];
  /** Recent activities */
  recentActivities: RecentActivity[];
  /** Revenue data over time */
  revenueData: RevenueDataPoint[];
}
