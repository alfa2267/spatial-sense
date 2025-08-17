import { Box } from '@mui/material';
import { StatCard } from './StatCard';
import { ProjectStatusChart } from './ProjectStatusChart';
import { RevenueChart } from './RevenueChart';
import { RecentActivities } from './RecentActivities';
import { Assignment, People, AttachMoney, CheckCircle } from '@mui/icons-material';
import { PageContainer, PageHeader } from '../../components';

// Define types for our mock data
interface ProjectStatusData {
  status: string;
  count: number;
  color: string;
}

interface RevenueData {
  labels: string[];
  values: number[];
}

interface Activity {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const DashboardPage = () => {
  // Mock data - replace with real data fetching
  const stats = [
    { 
      title: 'Total Projects', 
      value: '24', 
      growth: 12, 
      icon: <Assignment />,
      color: '#4caf50'
    },
    { 
      title: 'Active Clients', 
      value: '18', 
      growth: 5, 
      icon: <People />,
      color: '#2196f3'
    },
    { 
      title: 'Revenue', 
      value: '$42.5k', 
      growth: -2, 
      icon: <AttachMoney />,
      color: '#9c27b0'
    },
    { 
      title: 'Tasks Completed', 
      value: '156', 
      growth: 8, 
      icon: <CheckCircle />,
      color: '#ff9800'
    },
  ];

  // Mock data for charts
  const projectData: ProjectStatusData[] = [
    { status: 'Completed', count: 12, color: '#4caf50' },
    { status: 'In Progress', count: 8, color: '#2196f3' },
    { status: 'Not Started', count: 4, color: '#9e9e9e' },
  ];

  const revenueData: RevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [4000, 3000, 5000, 2780, 1890, 2390],
  };

  // Mock activities
  const activities: Activity[] = [
    { 
      id: 1, 
      title: 'New Project Created', 
      description: 'John Doe created a new project', 
      timestamp: '2 minutes ago',
      type: 'info'
    },
    { 
      id: 2, 
      title: 'Client Details Updated', 
      description: 'Jane Smith updated client details', 
      timestamp: '1 hour ago',
      type: 'info'
    },
    { 
      id: 3, 
      title: 'Task Completed', 
      description: 'Mike Johnson completed a task', 
      timestamp: '3 hours ago',
      type: 'success'
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />
      
      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        {stats.map((stat, index) => (
          <Box key={index}>
            <StatCard 
              title={stat.title}
              value={stat.value}
              growth={stat.growth}
              icon={stat.icon}
              color={stat.color}
            />
          </Box>
        ))}
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 3 }}>
        <Box>
          <ProjectStatusChart data={projectData} />
        </Box>
        <Box>
          <RevenueChart data={revenueData} timeRange="month" onTimeRangeChange={() => {}} />
        </Box>
      </Box>

      {/* Recent Activities */}
      <Box>
        <RecentActivities activities={activities} />
      </Box>
    </PageContainer>
  );
};

export default DashboardPage;
