import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
  IconButton,
  useTheme,
  styled,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Lightbulb as StrategyIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 1),
  justifyContent: 'flex-start',
  minHeight: '64px',
}));

type SidebarProps = {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerClose: () => void;
  handleDrawerTransitionEnd: () => void;
};

const mainNavItems = [
  { text: 'Overview', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
  { text: 'Strategy', icon: <StrategyIcon />, path: '/strategy' },
  { text: 'Floor Plan', icon: <MapIcon />, path: '/floorplan' },
  { text: 'Devices', icon: <FilterIcon />, path: '/devices' },
  { text: 'Timeline', icon: <FilterIcon />, path: '/timeline' },
  { text: 'Invoices', icon: <ReportIcon />, path: '/invoices' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export const Sidebar = ({
  drawerWidth,
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
}: SidebarProps) => {
  const theme = useTheme();
  const location = useLocation();
  const [openFilter, setOpenFilter] = useState(true);

  const handleFilterClick = () => {
    setOpenFilter(!openFilter);
  };

  const drawer = (
    <>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2 }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            SpatialSense
          </Typography>
        </Box>
      </DrawerHeader>
      
      <Divider />
      
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {mainNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <List>
          <ListItemButton onClick={handleFilterClick}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FilterIcon />
            </ListItemIcon>
            <ListItemText primary="Filters" />
            {openFilter ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={openFilter} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="All Strategies" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Active" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="In Progress" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Completed" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;
