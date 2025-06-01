import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0d6efd',
      light: '#3d8bfd',
      dark: '#084298',
      contrastText: '#fff',
    },
    secondary: {
      main: '#6c757d',
      light: '#8f98a3',
      dark: '#4b545c',
      contrastText: '#fff',
    },
    success: {
      main: '#198754',
    },
    warning: {
      main: '#fd7e14',
    },
    error: {
      main: '#dc3545',
    },
    info: {
      main: '#0dcaf0',
    },
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
  },
});
