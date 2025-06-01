import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

// Theme and styles
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { store } from './store/store';
import { queryClient } from './services/api';
import router from './routes';

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
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
