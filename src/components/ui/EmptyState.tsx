import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  actionIcon?: React.ReactNode;
  variant?: 'paper' | 'box';
  size?: 'small' | 'medium' | 'large';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  actionIcon,
  variant = 'paper',
  size = 'medium',
}) => {
  const sizeConfig = {
    small: { p: 2, iconSize: 40, titleVariant: 'h6' as const, spacing: 1 },
    medium: { p: 4, iconSize: 60, titleVariant: 'h5' as const, spacing: 2 },
    large: { p: 6, iconSize: 80, titleVariant: 'h4' as const, spacing: 3 },
  };

  const config = sizeConfig[size];

  const content = (
    <Box sx={{ textAlign: 'center', p: config.p }}>
      {/* Icon */}
      <Box
        sx={{
          mb: config.spacing,
          color: 'text.disabled',
          '& > *': {
            fontSize: config.iconSize,
          },
        }}
      >
        {icon || <InboxIcon fontSize="inherit" />}
      </Box>

      {/* Title */}
      <Typography 
        variant={config.titleVariant} 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          color: 'text.secondary',
          mb: description ? 1 : config.spacing
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: config.spacing }}
        >
          {description}
        </Typography>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={actionIcon || <AddIcon />}
          onClick={(e) => onAction?.(e)}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 3,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );

  if (variant === 'paper') {
    return <Paper>{content}</Paper>;
  }

  return content;
};

export default EmptyState;