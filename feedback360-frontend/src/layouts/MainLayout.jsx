import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar, { drawerWidth } from '../components/Sidebar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', bgcolor: '#eff6ff' }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
          }}
        >
          <Toolbar /> {/* Espace sous la Navbar fixée */}
          <Box sx={{ flex: 1, py: 2 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
