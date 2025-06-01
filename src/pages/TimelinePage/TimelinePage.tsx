import { Box, Typography, Paper, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import type { TimelineEvent, Project, TeamMember, TimelineView as TimelineViewType } from '../../types/domains/timeline.types';
import TimelineView from './TimelineView';
import EventFormModal from './EventFormModal';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../services/api';

const TimelinePage = () => {
  const [view, setView] = useState<TimelineViewType>('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch events from the API and transform them to TimelineEvents
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const apiEvents = await api.getEvents({ limit: 50 });
      // Transform API events to TimelineEvents
      return apiEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        startDate: new Date(), // You'll need to set the correct date from the event
        endDate: new Date(),   // You'll need to set the correct date from the event
        project: 'default',    // You'll need to set the correct project ID
        assignee: 'user-1',    // You'll need to set the correct assignee
        status: 'planned',     // Default status
        priority: 'medium',    // Default priority
        color: '#4e73df',      // Default color
        createdAt: new Date(event.timestamp || Date.now()),
        updatedAt: new Date(event.timestamp || Date.now())
      }));
    }
  });

  // Mock projects and team members - replace with real data if available
  const projects: Project[] = [
    { id: 'default', name: 'Default Project', color: '#4e73df' }
  ];

  const teamMembers: TeamMember[] = [
    { id: 'user-1', name: 'Current User', role: 'User' }
  ];

  const handleEventClick = (event: any) => {
    // Handle event click
    console.log('Event clicked:', event);
  };

  const handleEventSubmit = (event: any) => {
    // Handle event submission
    console.log('Event submitted:', event);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Timeline
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          New Event
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <TimelineView
          view={view}
          events={events}
          onEventClick={handleEventClick}
          selectedDate={new Date()}
          projects={projects}
          teamMembers={teamMembers}
          onViewChange={(newView: TimelineViewType) => setView(newView)}
        />
      </Paper>

      <EventFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEventSubmit}
        projects={projects}
        teamMembers={teamMembers}
      />
    </Box>
  );
};

export default TimelinePage;
