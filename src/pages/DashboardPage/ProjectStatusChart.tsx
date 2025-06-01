import { Box, Card, CardContent, Typography, useTheme, Skeleton } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ProjectStatusData {
  status: string;
  count: number;
  color: string;
}

interface ProjectStatusChartProps {
  data: ProjectStatusData[];
  isLoading?: boolean;
}

export const ProjectStatusChart = ({ data, isLoading = false }: ProjectStatusChartProps) => {
  const theme = useTheme();

  const chartData: ChartData<'doughnut'> = {
    labels: data.map((item) => item.status),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: data.map((item) => item.color),
        borderWidth: 1,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        //boxShadow: theme.shadows[3],
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="div" gutterBottom>
          Projects by Status
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isLoading ? (
            <Skeleton variant="circular" width={200} height={200} />
          ) : (
            <Box sx={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
              <Doughnut data={chartData} options={options} />
            </Box>
          )}
        </Box>
        {!isLoading && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mt: 2,
            }}
          >
            {data.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    mr: 1,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.status}: {item.count}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusChart;
