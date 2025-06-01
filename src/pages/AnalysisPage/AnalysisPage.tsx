import { Box, Card, CardContent, Typography, LinearProgress, Alert, Paper } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PieChartIcon from '@mui/icons-material/PieChart';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
  },
}));

const StatCard = ({ title, value, color = 'primary' }: { title: string; value: number; color?: 'primary' | 'success' | 'warning' | 'error' | 'info' }) => (
  <Box mb={2}>
    <Box display="flex" justifyContent="space-between" mb={0.5}>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="body2" fontWeight="bold">{value}%</Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      color={color}
      sx={{ height: 8, borderRadius: 4 }}
    />
  </Box>
);

const ScenarioCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box display="flex" alignItems="center" mb={1}>
      <Box mr={1} color="primary.main">
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight="medium">{title}</Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

const AnalysisPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Analysis
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Smart Recommendations
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Create a floor plan to generate AI-powered automation recommendations.
              </Alert>
              
              <Box id="recommendationsList" mt={2}>
                {/* Recommendations will be dynamically added here */}
              </Box>
            </CardContent>
          </StyledCard>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <StyledCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <PieChartIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Efficiency Analysis
                </Typography>
              </Box>
              
              <StatCard 
                title="Energy Efficiency Potential" 
                value={78} 
                color="success"
              />
              <StatCard 
                title="Automation Coverage" 
                value={65} 
                color="primary"
              />
              <StatCard 
                title="Security Optimization" 
                value={92} 
                color="warning"
              />
            </CardContent>
          </StyledCard>
        </Box>
      </Box>
      
      <Typography variant="h5" component="h2" gutterBottom>
        Suggested Automation Scenarios
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'repeat(3, 1fr)' 
        }, 
        gap: 3 
      }}>
        <Box>
          <ScenarioCard
            title="Morning Routine"
            description="Gradual lighting, temperature adjustment, and news briefing when you wake up."
            icon={<LightbulbIcon />}
          />
        </Box>
        <Box>
          <ScenarioCard
            title="Away Mode"
            description="Security system activation, lights simulation, and energy saving when you're away."
            icon={<LightbulbIcon />}
          />
        </Box>
        <Box>
          <ScenarioCard
            title="Entertainment"
            description="Lighting, audio, and display settings optimized for movie nights."
            icon={<LightbulbIcon />}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AnalysisPage;