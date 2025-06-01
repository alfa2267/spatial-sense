import { Box, Typography, Paper } from '@mui/material';

const InvoicesPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Invoices
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>Invoices content will be displayed here.</Typography>
      </Paper>
    </Box>
  );
};

export default InvoicesPage;
