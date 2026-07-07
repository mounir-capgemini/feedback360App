import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 35%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.12), transparent 45%), #eff6ff',
      }}
    >
      <CssBaseline />
      <Container maxWidth="xs">
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
