import { useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Components
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

type MainLayoutProps = {
  children?: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <TopBar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
      />
      <Main
        open={mobileOpen}
        sx={{
          backgroundColor: theme.palette.background.default,
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {children || <Outlet />}
      </Main>
    </Box>
  );
};

export default MainLayout;
