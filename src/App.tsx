import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Suspense } from 'react';

// Theme and styles
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { store } from './store/store';
import { queryClient } from './services/api';
import AppRoutes from './routes';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
