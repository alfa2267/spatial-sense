import { FC } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MapIcon from '@mui/icons-material/Map';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import React from 'react';

interface SidebarProps {
  onClose?: () => void;
}

const StyledNavItem = styled(ListItem)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1.5),
  padding: theme.spacing(1, 2),
  width: 'auto',
}));

const StyledNavItemIcon = styled(ListItemIcon)({
  minWidth: 40,
  color: 'inherit',
});

const NavSection: FC<{ title: string }> = ({ title }) => (
  <Box sx={{ px: 2, py: 1.5 }}>
    <Typography variant="overline" color="text.secondary" fontWeight="medium">
      {title}
    </Typography>
  </Box>
);

const navItems = [
  { text: 'Overview', icon: <DashboardIcon />, path: '/' },
  { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
];

const analysisItems = [
  { text: 'AI Analysis', icon: <PsychologyIcon />, path: '/analysis' },
  { text: 'Automation Strategy', icon: <LightbulbIcon />, path: '/strategy' },
  { text: 'Floor Map', icon: <MapIcon />, path: '/floorplan' },
];

const otherItems = [
  { text: 'Timeline', icon: <TimelineIcon />, path: '/timeline' },
  { text: 'Invoicing', icon: <ReceiptIcon />, path: '/invoicing' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export const Sidebar: FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const renderNavItems = (items: typeof navItems) =>
    items.map((item) => (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          component={RouterLink}
          to={item.path}
          selected={location.pathname === item.path}
          onClick={onClose}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <StyledNavItemIcon>{item.icon}</StyledNavItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ));

  return (
    <Box sx={{ width: 240 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
          SSP
        </Typography>
      </Box>
      
      <List>
        <NavSection title="Dashboard" />
        {renderNavItems(navItems)}
        
        <NavSection title="Analysis" />
        {renderNavItems(analysisItems)}
        
        <NavSection title="Other" />
        {renderNavItems(otherItems)}
      </List>
    </Box>
  );
};

export default Sidebar;
