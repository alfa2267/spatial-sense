import React from 'react';
import { Box, CircularProgress, Typography, Backdrop, Portal } from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  variant?: 'overlay' | 'inline' | 'backdrop';
  size?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message,
  variant = 'overlay',
  size = 40,
}) => {
  if (!loading) return null;

  const loadingContent = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  switch (variant) {
    case 'backdrop':
      return (
        <Portal>
          <Backdrop
            open={loading}
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {loadingContent}
          </Backdrop>
        </Portal>
      );

    case 'overlay':
      return (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          {loadingContent}
        </Box>
      );

    case 'inline':
    default:
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          {loadingContent}
        </Box>
      );
  }
};

export default LoadingOverlay;