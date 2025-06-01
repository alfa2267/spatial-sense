import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { Add as AddIcon, Devices, Schedule, Settings } from '@mui/icons-material';
import { Strategy, StrategyStatus } from '../../types/domains/strategy.types';
import { dataService } from '../../services/data/dataService';
import { ApiResponse } from '../../types/api/response.types';

const StrategiesPage = () => {
  const theme = useTheme();
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

  const getStatusColor = (status: StrategyStatus) => {
    switch (status) {
      case 'active':
        return { bg: 'success.light', color: 'success.dark' };
      case 'inactive':
        return { bg: 'grey.300', color: 'grey.800' };
      case 'draft':
        return { bg: 'warning.light', color: 'warning.dark' };
      case 'archived':
        return { bg: 'grey.500', color: 'common.white' };
      default:
        return { bg: 'info.light', color: 'info.dark' };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">Strategies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateStrategy}
        >
          New Strategy
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {strategies.map((strategy) => (
          <Box key={strategy.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {strategy.name}
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        strategy.status === 'active'
                          ? 'success.light'
                          : strategy.status === 'draft'
                          ? 'warning.light'
                          : 'info.light',
                      color:
                        strategy.status === 'active'
                          ? 'success.dark'
                          : strategy.status === 'draft'
                          ? 'warning.dark'
                          : 'info.dark',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {strategy.status}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {strategy.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {strategy.lastUpdated}
                  </Typography>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </Box>
                  </CardContent>
            </Card>
          </Box>
        ))}

        {strategies.length === 0 && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No Strategies Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Get started by creating your first strategy
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateStrategy}
              >
                Create Strategy
              </Button>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StrategiesPage;
