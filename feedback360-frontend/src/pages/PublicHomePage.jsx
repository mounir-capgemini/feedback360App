import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../services/sessionService';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Paper,
  TablePagination,
  Avatar,
} from '@mui/material';
import { School as SchoolIcon, Login as LoginIcon } from '@mui/icons-material';

const PublicHomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    // If user is already authenticated, redirect to their respective dashboard
    if (isAuthenticated()) {
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/'); // This will render DashboardParticipant in AppRoutes
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchPublicSessions = async () => {
      setLoading(true);
      try {
        const data = await sessionService.getPublicSessions(page, rowsPerPage);
        setSessions(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les sessions publiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSessions();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#eff6ff' }}>
      {/* Header / Navbar */}
      <AppBar
        position="static"
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.18)',
          boxShadow: '0 1px 10px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, mx: 'auto', width: '100%', px: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            Feedback360
          </Typography>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.14)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
              },
            }}
          >
            Se Connecter
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          color: '#ffffff',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Vos feedbacks façonnent nos formations
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#94a3b8',
              mb: 4,
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Consultez les sessions de formation publiques et connectez-vous pour soumettre vos évaluations et suivre vos parcours d'apprentissage.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: '#2563eb',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
            }}
          >
            Accéder à mon espace
          </Button>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        <Box mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit',
              color: '#0f172a',
              mb: 1,
            }}
          >
            Sessions de formation publiques
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Découvrez nos programmes de formation en cours et terminés.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {sessions.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  Aucune session publique disponible pour le moment.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {sessions.map((session) => (
                  <Grid item xs={12} sm={6} md={4} key={session.id}>
                    <Card
                      className="hover-card glass-panel"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                            <SchoolIcon />
                          </Avatar>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'Outfit' }}
                          >
                            {session.name}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Parcours :</strong> {session.parcoursName || 'Non spécifié'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            <strong>Population :</strong> {session.populationName || 'Non spécifiée'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Type :</strong> {session.typeLabel || 'N/A'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {totalElements > 0 && (
              <Box mt={4} display="flex" justifyContent="center">
                <TablePagination
                  component="div"
                  count={totalElements}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[6, 12, 24]}
                  labelRowsPerPage="Sessions par page"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#0f172a', color: '#94a3b8', py: 4, mt: 'auto', borderTop: '1px solid #1e293b' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} Feedback360. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicHomePage;
export { PublicHomePage };
