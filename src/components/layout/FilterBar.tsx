import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  size?: number; // Grid size
}

interface FilterBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Filter[];
  resultCount?: number;
  resultLabel?: string;
  loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  resultCount,
  resultLabel = 'items',
  loading = false,
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2, mb: 2, borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Grid>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 3 }}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  // Calculate grid sizes dynamically
  const hasSearch = !!onSearchChange;
  const filterCount = filters.length;
  const totalElements = (hasSearch ? 1 : 0) + filterCount + (resultCount !== undefined ? 1 : 0);
  
  const getGridSize = (index: number) => {
    if (totalElements <= 2) return { xs: 12, md: 6 };
    if (totalElements === 3) return { xs: 12, md: 4 };
    if (totalElements === 4) return { xs: 12, md: 3 };
    return { xs: 12, md: 2 };
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        {onSearchChange && (
          <Grid size={getGridSize(0)}>
            <TextField
              fullWidth
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        )}

        {/* Filters */}
        {filters.map((filter, index) => (
          <Grid key={filter.id} size={filter.size ? { xs: 12, md: filter.size } : getGridSize(index + (hasSearch ? 1 : 0))}>
            <FormControl fullWidth>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filter.value}
                label={filter.label}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        {/* Result Count */}
        {resultCount !== undefined && (
          <Grid size={getGridSize(totalElements - 1)}>
            <Typography variant="body2" color="textSecondary">
              {resultCount} {resultLabel}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default FilterBar;