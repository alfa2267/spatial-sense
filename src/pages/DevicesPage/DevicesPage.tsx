import { Box, Typography, Paper } from '@mui/material';

const DevicesPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Devices
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>Devices content will be displayed here.</Typography>
      </Paper>
    </Box>
  );
};

export default DevicesPage;
