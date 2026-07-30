import React from 'react';
import { Box, Container, Grid, Typography, Button, Divider, Stack, Chip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SchoolIcon from '@mui/icons-material/School';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = ({ dark = true }) => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: dark ? '#0f172a' : '#ffffff',
        color: dark ? '#94a3b8' : '#64748b',
        pt: 6,
        pb: 4,
        mt: 'auto',
        borderTop: dark ? '1px solid #1e293b' : '1px solid rgba(59, 130, 246, 0.15)',
        boxShadow: dark ? 'none' : '0 -2px 10px rgba(15, 23, 42, 0.03)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand Column */}
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
                onClick={() => navigate('/')}
              >
                Feedback360
              </Typography>
              <Chip
                label="TalentUp"
                size="small"
                icon={<SchoolIcon style={{ fontSize: '0.9rem', color: '#3b82f6' }} />}
                sx={{
                  bgcolor: dark ? 'rgba(59, 130, 246, 0.12)' : 'rgba(37, 99, 235, 0.08)',
                  color: '#3b82f6',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: dark ? '#94a3b8' : '#64748b', maxWidth: 380, lineHeight: 1.6, mb: 2 }}>
              La plateforme d'évaluation et de suivi de la qualité des formations professionnelles. Feedback 360° en temps réel pour apprenants et formateurs.
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{
                  color: dark ? '#94a3b8' : '#64748b',
                  bgcolor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  p: 1.2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#1877F2',
                    bgcolor: dark ? 'rgba(24, 119, 242, 0.15)' : 'rgba(24, 119, 242, 0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <FacebookIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{
                  color: dark ? '#94a3b8' : '#64748b',
                  bgcolor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  p: 1.2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#E4405F',
                    bgcolor: dark ? 'rgba(228, 64, 95, 0.15)' : 'rgba(228, 64, 95, 0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <InstagramIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                sx={{
                  color: dark ? '#94a3b8' : '#64748b',
                  bgcolor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                  p: 1.2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#0A66C2',
                    bgcolor: dark ? 'rgba(10, 102, 194, 0.15)' : 'rgba(10, 102, 194, 0.1)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <LinkedInIcon sx={{ fontSize: '1.4rem' }} />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="subtitle2" sx={{ color: dark ? '#ffffff' : '#0f172a', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.75rem' }}>
              Navigation
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="text"
                onClick={() => scrollToSection('home')}
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                Accueil
              </Button>
              <Button
                variant="text"
                onClick={() => scrollToSection('about')}
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justify: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                À propos
              </Button>
              <Button
                variant="text"
                onClick={() => scrollToSection('formations')}
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justify: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                Formations
              </Button>
              <Button
                variant="text"
                onClick={() => scrollToSection('testimonials')}
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justify: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                Avis & Témoignages
              </Button>
            </Stack>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="subtitle2" sx={{ color: dark ? '#ffffff' : '#0f172a', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.75rem' }}>
              Informations Légales
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="text"
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justify: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                Mentions légales
              </Button>
              <Button
                variant="text"
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justify: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                Politique de confidentialité
              </Button>
              <Button
                variant="text"
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  justify: 'flex-start',
                  width: 'fit-content',
                  '&:hover': { color: '#3b82f6', bgcolor: 'transparent' }
                }}
              >
                Conditions Générales d'Utilisation
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: dark ? '#1e293b' : 'rgba(59, 130, 246, 0.15)', mb: 3 }} />

        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="body2" color={dark ? '#64748b' : '#94a3b8'} sx={{ fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Feedback360. Tous droits réservés. Intégré avec TalentUp.
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <SecurityIcon sx={{ fontSize: '1rem', color: dark ? '#64748b' : '#94a3b8' }} />
            <Typography variant="caption" color={dark ? '#64748b' : '#94a3b8'}>
              Conforme RGPD & Qualiopi
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
