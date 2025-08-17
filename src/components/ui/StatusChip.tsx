import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type StatusVariant = 'active' | 'inactive' | 'pending' | 'completed' | 'draft' | 'archived' | 'error' | 'warning' | 'success' | 'info';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: StatusVariant;
  customColors?: Record<string, { bg: string; color: string }>;
}

const defaultStatusColors: Record<StatusVariant, { bg: string; color: string }> = {
  active: { bg: 'success.light', color: 'success.dark' },
  inactive: { bg: 'grey.300', color: 'grey.800' },
  pending: { bg: 'warning.light', color: 'warning.dark' },
  completed: { bg: 'success.light', color: 'success.dark' },
  draft: { bg: 'info.light', color: 'info.dark' },
  archived: { bg: 'grey.500', color: 'common.white' },
  error: { bg: 'error.light', color: 'error.dark' },
  warning: { bg: 'warning.light', color: 'warning.dark' },
  success: { bg: 'success.light', color: 'success.dark' },
  info: { bg: 'info.light', color: 'info.dark' },
};

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  customColors,
  sx,
  ...props
}) => {
  const colors = customColors?.[status] || defaultStatusColors[status] || defaultStatusColors.info;

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        '& .MuiChip-label': {
          px: 1.5,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default StatusChip;