import React from 'react';
import { Client } from '../../types';
import { Card, CardContent, Typography, Avatar, Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StyledClientCardProps {
  selected?: boolean;
}

const StyledClientCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<StyledClientCardProps>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  marginBottom: theme.spacing(2),
}));

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
  loading: boolean;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  selectedClient,
  onSelectClient,
  loading,
}) => {
  if (loading) {
    return (
      <Box>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={80} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  if (clients.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="textSecondary">
          No clients found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {clients.map((client) => (
        <StyledClientCard
          key={client.id}
          selected={selectedClient?.id === client.id}
          onClick={() => onSelectClient(client)}
          elevation={2}
        >
          <CardContent>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {client.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  {client.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {client.company || 'No company'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {client.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </StyledClientCard>
      ))}
    </Box>
  );
};
