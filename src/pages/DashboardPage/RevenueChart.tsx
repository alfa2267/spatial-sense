import { Box, Card, CardContent, Typography, ButtonGroup, Button, Skeleton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@mui/material/styles';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = 'week' | 'month' | 'year';

interface RevenueChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading?: boolean;
}

export const RevenueChart = ({
  data,
  timeRange,
  onTimeRangeChange,
  isLoading = false,
}: RevenueChartProps) => {
  const theme = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.values,
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: theme.palette.primary.dark,
        pointHoverBorderColor: '#fff',
        pointHitRadius: 10,
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        boxShadow: theme.shadows[3],
        callbacks: {
          label: function(context: any) {
            return `£${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: (value: any) => `£${value / 1000}k`,
        },
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Revenue Trend
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            <Button
              variant={timeRange === 'week' ? 'contained' : 'outlined'}
              onClick={() => onTimeRangeChange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'contained' : 'outlined'}
              onClick={() => onTimeRangeChange('month')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'year' ? 'contained' : 'outlined'}
              onClick={() => onTimeRangeChange('year')}
            >
              Year
            </Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ flex: 1, minHeight: 300 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={300} />
          ) : (
            <Line data={chartData} options={options} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
