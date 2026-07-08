import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        textAlign="center"
        className="animate-fade-in"
      >
        <SecurityIcon sx={{ fontSize: 100, color: '#ef4444', mb: 3 }} />
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            mb: 2,
            color: '#0f172a',
          }}
        >
          Accès Refusé
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            boxShadow: '0 4px 14px rgba(37,99,235,0.14)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
            },
          }}
        >
          Retourner à l'accueil
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
export { UnauthorizedPage };
