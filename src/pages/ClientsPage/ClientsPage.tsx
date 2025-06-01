import { Box, Typography, Paper } from '@mui/material';

const ClientsPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Clients
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>Clients content will be displayed here.</Typography>
      </Paper>
    </Box>
  );
};

export default ClientsPage;
