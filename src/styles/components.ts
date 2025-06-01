import { styled } from '@mui/material/styles';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps, 
  Button as MuiButton, 
  Theme,
  PaperProps
} from '@mui/material';
import { css } from '@emotion/react';
import { flexCenter, scrollbarStyles } from './utils';

type CardVariant = 'elevation' | 'outlined' | 'filled';

interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: CardVariant;
  hoverable?: boolean;
}

interface StyledThemeProps {
  theme: Theme;
}

export const Card = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'hoverable',
})<CardProps>(({ theme, hoverable = false, variant = 'elevation' }) => {
  // Ensure variant is properly typed
  const cardVariant = variant as CardVariant;
  const baseStyles = {
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.shorter,
    }),
  };

  const hoverStyles = hoverable ? {
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
  } : {};

  return {
    ...baseStyles,
    ...hoverStyles,
    // Apply MUI's variant styles
    ...(cardVariant === 'outlined' && {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }),
    ...(cardVariant === 'filled' && {
      backgroundColor: theme.palette.background.paper,
      boxShadow: 'none',
    }),
  };
});

export const Button = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  '&.MuiButton-contained': {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  },
}));

export const IconButton = styled(Button)({
  minWidth: 'auto',
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: '50%',
  ...flexCenter,
});

export const Scrollable = styled('div')(({ theme }: StyledThemeProps) => ({
  overflowY: 'auto',
  ...scrollbarStyles(theme),
}));

interface FlexProps {
  gap?: number;
  justify?: string;
  align?: string;
  direction?: 'row' | 'column';
}

export const Flex = styled('div', {
  shouldForwardProp: (prop) => !['gap', 'justify', 'align', 'direction'].includes(prop as string),
})<FlexProps>(({ theme, gap = 1, justify = 'flex-start', align = 'center', direction = 'row' }) => ({
  display: 'flex',
  flexDirection: direction,
  justifyContent: justify,
  alignItems: align,
  gap: theme.spacing(gap),
}));

// Common container with max-width and centered content
export const Container = styled('div')(({ theme }: StyledThemeProps) => ({
  width: '100%',
  maxWidth: 1440,
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 3),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(0, 4),
  },
}));

// Common section component with consistent spacing
interface SectionProps {
  bgcolor?: string;
  py?: number;
}

export const Section = styled('section', {
  shouldForwardProp: (prop) => !['bgcolor', 'py'].includes(prop as string),
})<SectionProps>(({ theme, bgcolor = 'transparent', py = 6 }) => ({
  backgroundColor: bgcolor,
  padding: theme.spacing(py, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(py / 2, 0),
  },
}));
