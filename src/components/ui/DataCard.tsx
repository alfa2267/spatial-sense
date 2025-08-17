import React from 'react';
import { Card, CardContent, CardActions, Box, Typography, Skeleton } from '@mui/material';

interface DataCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  selected?: boolean;
  variant?: 'elevation' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  loading = false,
  onClick,
  selected = false,
  variant = 'elevation',
  size = 'medium',
}) => {
  const sizeConfig = {
    small: { p: 1.5, spacing: 1 },
    medium: { p: 2, spacing: 1.5 },
    large: { p: 3, spacing: 2 },
  };

  const config = sizeConfig[size];

  if (loading) {
    return (
      <Card 
        variant={variant}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ p: config.p, flexGrow: 1 }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 0.5 }} />
          <Box sx={{ mt: config.spacing }}>
            <Skeleton variant="rectangular" height={60} />
          </Box>
        </CardContent>
        {actions && (
          <CardActions sx={{ p: config.p, pt: 0 }}>
            <Skeleton variant="rectangular" width={80} height={32} />
          </CardActions>
        )}
      </Card>
    );
  }

  return (
    <Card
      variant={variant}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        border: selected ? '2px solid' : undefined,
        borderColor: selected ? 'primary.main' : undefined,
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: config.p, flexGrow: 1 }}>
        {/* Header */}
        {(title || subtitle) && (
          <Box sx={{ mb: config.spacing }}>
            {title && (
              <Typography 
                variant="h6" 
                component="h3"
                sx={{ 
                  fontWeight: 600,
                  lineHeight: 1.2,
                  mb: subtitle ? 0.5 : 0
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ lineHeight: 1.4 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Content */}
        {children}
      </CardContent>

      {/* Actions */}
      {actions && (
        <CardActions sx={{ p: config.p, pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default DataCard;