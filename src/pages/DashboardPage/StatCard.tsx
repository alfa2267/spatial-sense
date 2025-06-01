import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  growth: number;
  icon: ReactNode;
  color: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const StatCard = ({
  title,
  value,
  growth,
  icon,
  color,
  isLoading = false,
  onClick,
}: StatCardProps) => {
  const isPositive = growth >= 0;
  const GrowthIcon = isPositive ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rectangular" height={40} sx={{ my: 1 }} />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={color} gutterBottom>
              {value}
            </Typography>
            <Box 
              display="flex" 
              alignItems="center" 
              color={isPositive ? 'success.main' : 'error.main'}
            >
              <GrowthIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
              <Typography variant="caption" fontWeight={500}>
                {Math.abs(growth)}% {isPositive ? 'growth' : 'decline'}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}10`,
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
