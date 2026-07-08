import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Divider } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  RateReview as FeedbackIcon,
  Notifications as NotificationsIcon,
  BarChart as ChartIcon,
  People as PeopleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const getMenuItems = () => {
    const items = [];

    if (user?.role === 'ADMIN') {
      items.push({ text: 'Dashboard Admin', icon: <DashboardIcon />, path: '/admin/dashboard' });
      items.push({ text: 'Utilisateurs', icon: <PeopleIcon />, path: '/admin/users' });
      items.push({ text: 'Sessions de formation', icon: <SchoolIcon />, path: '/admin/formations' });
      items.push({ text: 'Historique Feedbacks', icon: <FeedbackIcon />, path: '/admin/feedbacks' });
      items.push({ text: 'Statistiques', icon: <ChartIcon />, path: '/statistics' });
      items.push({ text: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' });
    } else {
      items.push({ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' });
      items.push({ text: 'Mes Formations', icon: <SchoolIcon />, path: '/formations' });
      items.push({ text: 'Mes Feedbacks', icon: <FeedbackIcon />, path: '/my-feedbacks' });
      items.push({ text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' });
      items.push({ text: 'Mon Profil', icon: <PersonIcon />, path: '/profile' });
    }

    return items;
  };

  const menuItems = getMenuItems();

  const drawerContent = (
    <Box sx={{ height: '100%', bgcolor: '#ffffff', color: '#0f172a' }}>
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List sx={{ px: 1.5 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    bgcolor: isActive ? 'rgba(37,99,235,0.12)' : 'transparent',
                    color: isActive ? '#2563eb' : '#475569',
                    '&:hover': {
                      bgcolor: 'rgba(37,99,235,0.08)',
                      color: '#1d4ed8',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#2563eb' : '#6b7280',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            bgcolor: '#0b0c10',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            bgcolor: '#0b0c10',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
export { drawerWidth };
