import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon 
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { isValid } from 'date-fns/isValid';

interface Activity {
  id: string | number;
  title: string;
  description: string;
  timestamp: Date | string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
  maxItems?: number;
}

/**
 * Safely formats a date to a relative time string
 * @param date Date object or string to format
 * @returns Formatted date string or a fallback message
 */
const formatDateSafely = (date: unknown): string => {
  // Handle undefined, null, or empty string
  if (!date) return 'Some time ago';
  
  // If it's already a valid date object
  if (date instanceof Date && isValid(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  // If it's a string that can be parsed as a date
  if (typeof date === 'string') {
    // Try to parse the date string
    const parsedDate = new Date(date);
    if (isValid(parsedDate)) {
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    }
    
    // Try to parse ISO string without timezone (common format)
    const isoDate = new Date(date + 'Z');
    if (isValid(isoDate)) {
      return formatDistanceToNow(isoDate, { addSuffix: true });
    }
    
    console.warn('Invalid date string provided:', date);
    return 'Some time ago';
  }
  
  // For any other case, log the type and return fallback
  console.warn('Unsupported date format:', { type: typeof date, value: date });
  return 'Some time ago';
};

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'info':
    default:
      return <InfoIcon color="info" />;
  }
};

export const RecentActivities = ({ 
  activities, 
  isLoading = false, 
  maxItems = 5 
}: RecentActivitiesProps) => {
  const displayedActivities = activities.slice(0, maxItems);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          <List>
            {[...Array(4)].map((_, index) => (
              <ListItem key={index}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}
        >
          <Typography variant="h6" component="div">
            Recent Activities
          </Typography>
          <Typography 
            variant="body2" 
            color="primary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            View All
            <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
          </Typography>
        </Box>
        
        {displayedActivities.length > 0 ? (
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {displayedActivities.map((activity) => (
              <ListItem 
                key={activity.id} 
                alignItems="flex-start"
                sx={{
                  px: 0,
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  {getActivityIcon(activity.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" component="div">
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {formatDateSafely(activity.timestamp)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'text.secondary',
              p: 4,
              textAlign: 'center'
            }}
          >
            <InfoIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No recent activities to display</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
