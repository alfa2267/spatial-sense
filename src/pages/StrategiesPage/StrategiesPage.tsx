import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Strategy } from '../../types/domains/strategy.types';
import { dataService } from '../../services/data/dataService';
import { ApiResponse } from '../../types/api/response.types';
import { 
  PageContainer, 
  PageHeader, 
  DataCard, 
  StatusChip, 
  EmptyState,
  LoadingOverlay
} from '../../components';

const StrategiesPage = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStrategies = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Strategy[]> = await dataService.fetch('/strategies');
        if (response.success && response.data) {
          setStrategies(response.data);
        } else {
          setError('Failed to load strategies');
        }
      } catch (err) {
        console.error('Error loading strategies:', err);
        setError('An error occurred while loading strategies');
      } finally {
        setLoading(false);
      }
    };

    loadStrategies();
  }, []);

  const handleCreateStrategy = () => {
    // Navigate to create strategy page or open a dialog
    console.log('Navigate to create strategy');
  };


  return (
    <PageContainer>
      <PageHeader
        title="Strategies"
        actions={[
          {
            label: 'New Strategy',
            onClick: handleCreateStrategy,
            icon: <AddIcon />,
          },
        ]}
        loading={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {loading && strategies.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <DataCard key={index} loading />
          ))
        ) : (
          strategies.map((strategy) => (
            <DataCard
              key={strategy.id}
              title={strategy.name}
              subtitle={strategy.description}
              onClick={() => console.log('View strategy:', strategy.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <StatusChip status={strategy.status as any} />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {strategy.lastUpdated}
                </Typography>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </Box>
            </DataCard>
          ))
        )}
      </Box>

      {!loading && strategies.length === 0 && !error && (
        <Box sx={{ mt: 4 }}>
          <EmptyState
            title="No Strategies Found"
            description="Get started by creating your first strategy"
            actionLabel="Create Strategy"
            onAction={handleCreateStrategy}
            icon={<AddIcon />}
          />
        </Box>
      )}

      <LoadingOverlay loading={loading && strategies.length > 0} variant="inline" />
    </PageContainer>
  );
};

export default StrategiesPage;
