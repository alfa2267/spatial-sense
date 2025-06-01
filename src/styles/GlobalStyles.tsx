import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material';
import { css } from '@emotion/react';
import { scrollbarStyles } from './utils';

export const GlobalStyles = () => {
  const theme = useTheme();
  
  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        'html, body, #root, #__next': {
          height: '100%',
          width: '100%',
        },
        html: {
          WebkitTextSizeAdjust: '100%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          margin: 0,
          padding: 0,
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          lineHeight: 1.5,
          ...scrollbarStyles(theme),
        },
        '#__next': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
        'h1, h2, h3, h4, h5, h6': {
          margin: 0,
          fontWeight: 600,
          lineHeight: 1.2,
        },
        a: {
          color: theme.palette.primary.main,
          textDecoration: 'none',
          transition: theme.transitions.create('color'),
          '&:hover': {
            color: theme.palette.primary.dark,
            textDecoration: 'underline',
          },
        },
        'button, input, optgroup, select, textarea': {
          fontFamily: 'inherit',
          fontSize: '100%',
          lineHeight: 1.15,
          margin: 0,
        },
        'button, input': {
          overflow: 'visible',
        },
        'button, select': {
          textTransform: 'none',
        },
        'button, [type="button"], [type="reset"], [type="submit"]': {
          WebkitAppearance: 'button',
        },
        'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner': {
          borderStyle: 'none',
          padding: 0,
        },
        'button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring': {
          outline: '1px dotted ButtonText',
        },
        'img, svg, video, canvas, audio, iframe, embed, object': {
          display: 'block',
          verticalAlign: 'middle',
        },
        'img, video': {
          maxWidth: '100%',
          height: 'auto',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      }}
    />
  );
};
