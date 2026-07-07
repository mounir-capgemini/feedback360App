import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        if (user) {
          const res = await notificationService.getPendingCount();
          setNotificationCount(res.count);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du nombre de notifications:', err);
      }
    };

    fetchNotificationCount();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.18)',
        boxShadow: '0 1px 10px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Feedback360
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationsClick} sx={{ color: '#2563eb' }}>
              <Badge badgeContent={notificationCount} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {user && (
            <Box>
                <Tooltip title="Mon compte">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ p: 0.5, border: '1px solid rgba(59, 130, 246, 0.18)', ml: 1 }}
                >
                  <Avatar sx={{ bgcolor: '#2563eb', width: 32, height: 32, fontSize: '0.875rem', fontWeight: 600 }}>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    bgcolor: '#ffffff',
                    border: '1px solid rgba(59, 130, 246, 0.18)',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    color: '#0f172a',
                  },
                }}
              >
                <Box px={2} py={1} sx={{ borderBottom: '1px solid rgba(59,130,246,0.12)', minWidth: 150 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {user.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-block',
                      bgcolor: user.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: user.role === 'ADMIN' ? '#f87171' : '#34d399',
                      px: 1,
                      py: 0.2,
                      borderRadius: 1,
                      fontSize: '10px',
                      mt: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    {user.role}
                  </Typography>
                </Box>
                <MenuItem onClick={() => { handleClose(); navigate('/my-feedbacks'); }} sx={{ fontSize: '0.875rem' }}>
                  Mes Feedbacks
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ fontSize: '0.875rem', color: '#f87171', display: 'flex', gap: 1 }}>
                  <ExitToApp fontSize="small" /> Déconnexion
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
