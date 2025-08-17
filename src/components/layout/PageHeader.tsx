import React from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface ActionButton {
  label: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
  loading?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ActionButton[];
  loading?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          {subtitle && <Skeleton variant="text" width={300} height={20} sx={{ mt: 0.5 }} />}
        </Box>
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
      sx={{
        py: 1.5,
        px: 2,
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary' 
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {actions.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              startIcon={action.icon || (action.variant === 'contained' ? <AddIcon /> : undefined)}
              onClick={(e) => action.onClick?.(e)}
              disabled={action.disabled || action.loading}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 3,
                boxShadow: action.variant === 'contained' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  boxShadow: action.variant === 'contained' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                }
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;