import React from 'react';
import { 
  TimelineEvent, 
  TimelineView as TimelineViewType,
  Project,
  TeamMember
} from '../../types/domains/timeline.types';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Avatar,
  Stack,
  ButtonGroup,
  Button,
  useTheme
} from '@mui/material';
import { 
  format, 
  isSameDay, 
  isSameWeek, 
  isSameMonth, 
  isSameYear, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isToday,
  isBefore,
  isAfter,
  parseISO
} from 'date-fns';
import { CalendarMonth, ViewWeek, Today, ListAlt } from '@mui/icons-material';

type TimelineViewProps = {
  view: TimelineViewType;
  events: TimelineEvent[];
  onEventClick: (event: TimelineEvent) => void;
  selectedDate: Date;
  projects: Project[];
  teamMembers: TeamMember[];
  onViewChange: (view: TimelineViewType) => void;
};

const TimelineView: React.FC<TimelineViewProps> = ({
  view,
  events,
  onEventClick,
  selectedDate,
  projects,
  teamMembers,
  onViewChange,
}) => {
  const theme = useTheme();

  // Get project and team member info
  const getProject = (projectId: string) => 
    projects.find(p => p.id === projectId) || { name: 'Unknown', color: '#ccc' };
    
  const getTeamMember = (memberId: string) =>
    teamMembers.find(m => m.id === memberId) || { name: 'Unknown', role: '', avatar: '' };

  // Filter events based on the selected view and date
  const getFilteredEvents = () => {
    if (!events.length) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      
      switch (view) {
        case 'day':
          return isSameDay(eventDate, selectedDate);
        case 'week':
          const start = startOfWeek(selectedDate);
          const end = endOfWeek(selectedDate);
          return (eventDate >= start && eventDate <= end) || 
                 (eventEndDate >= start && eventEndDate <= end);
        case 'month':
          return isSameMonth(eventDate, selectedDate);
        case 'list':
        default:
          return true;
      }
    });
  };

  const filteredEvents = getFilteredEvents();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderEvent = (event: TimelineEvent) => {
    const project = getProject(event.project);
    const assignee = getTeamMember(event.assignee);
    
    return (
      <Paper 
        key={event.id} 
        onClick={() => onEventClick(event)}
        sx={{ 
          p: 2, 
          mb: 2, 
          cursor: 'pointer',
          borderLeft: `4px solid ${project?.color || '#ccc'}`,
          '&:hover': { 
            boxShadow: theme.shadows[2],
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" component="span">
              {event.title}
              <Chip 
                label={event.priority}
                size="small"
                color={getPriorityColor(event.priority)}
                variant="outlined"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  };

  // For other views (day, week, month), we'll implement a simple card view
  // In a real app, you might want to use a library like FullCalendar or similar
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        {view.charAt(0).toUpperCase() + view.slice(1)} View
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={2}>
        {filteredEvents.map((event) => (
          <Paper 
            key={event.id} 
            sx={{ 
              p: 2, 
              cursor: 'pointer',
              borderLeft: `4px solid ${event.color}`,
              '&:hover': {
                boxShadow: 3,
              },
            }}
            onClick={() => onEventClick(event)}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              <Chip 
                label={event.status.replace('-', ' ')}
                size="small"
                color={getStatusColor(event.status)}
                variant="outlined"
              />
              <Chip 
                label={event.priority}
                size="small"
                color={getPriorityColor(event.priority)}
                variant="outlined"
              />
            </Box>
          </Paper>
        ))}
      </Box>
      {filteredEvents.length === 0 && (
        <Box textAlign="center" p={4}>
          <Typography variant="body1" color="text.secondary">
            No events found for the selected period.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TimelineView;
