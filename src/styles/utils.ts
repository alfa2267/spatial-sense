import { css } from '@emotion/react';
import { Theme } from '@mui/material/styles';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export const mediaQuery = (key: keyof typeof breakpoints) => {
  return (style: TemplateStringsArray | string) =>
    `@media (min-width: ${breakpoints[key]}px) { ${style} }`;
};

export const responsiveProp = (
  prop: string,
  values: Partial<Record<Breakpoint, string | number | undefined>>,
  theme: Theme
) => {
  const styles: string[] = [];
  
  Object.entries(breakpoints).forEach(([key, value]) => {
    if (values[key as Breakpoint] !== undefined) {
      styles.push(`
        @media (min-width: ${value}px) {
          ${prop}: ${values[key as Breakpoint]};
        }
      `);
    }
  });

  return css`${styles.join('')}`;
};

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const textEllipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const scrollbarStyles = (theme: Theme) => css`
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.palette.grey[100]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.palette.grey[400]};
    border-radius: 4px;
    
    &:hover {
      background: ${theme.palette.grey[500]};
    }
  }
`;
