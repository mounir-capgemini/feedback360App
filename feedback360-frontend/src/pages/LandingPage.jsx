import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../services/sessionService';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
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
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  ArrowForward as ArrowIcon,
  Close as CloseIcon,
  Stars as StarsIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // If already authenticated and visiting /, we can redirect or let them browse
    // The prompt says: "si l'utilisateur est déjà connecté, il accède à son tableau de bord participant ou admin"
    // Let's redirect only if they are logged in and want to go to their dashboard
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const fetchPublicSessions = async () => {
      try {
        const data = await sessionService.getPublicSessions(0, 6);
        setSessions(data.content || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les sessions publiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSessions();
  }, []);

  const handleOpenDetails = (session) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedSession(null);
    setModalOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#eff6ff' }}>
      {/* Header */}
      <Navbar publicMode={true} />
      
      {/* Spacer to push content below fixed header */}
      <Box sx={{ height: 64 }} />

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          color: '#ffffff',
          py: { xs: 10, md: 14 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 -20px 80px rgba(0,0,0,0.3)',
        }}
      >
        <Container maxWidth="md" className="animate-fade-in">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bienvenue sur Feedback360
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#94a3b8',
              mb: 5,
              fontWeight: 400,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6,
              fontFamily: 'Plus Jakarta Sans',
            }}
          >
            Donnez votre avis pour améliorer la qualité des formations.
          </Typography>
          <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/formations')}
              sx={{
                px: 4,
                py: 1.8,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2,
                bgcolor: '#2563eb',
                boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              📋 Mes formations
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/formations')}
              sx={{
                px: 4,
                py: 1.8,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2,
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              ⭐ Donner un feedback
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section À propos */}
      <Box
        id="about"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: '#ffffff',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Outfit',
                  color: '#0f172a',
                  mb: 3,
                }}
              >
                À propos de Feedback360
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.05rem' }}>
                Feedback360 est une plateforme d'évaluation continue conçue pour recueillir les avis des participants après chaque session de formation. En intégrant directement les données de TalentUp, nous créons un cercle vertueux d'amélioration continue.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <Avatar sx={{ bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                      <StarsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Évaluer les formations</Typography>
                      <Typography variant="body2" color="text.secondary">Mesurer la pertinence et la qualité des modules.</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Améliorer les contenus</Typography>
                      <Typography variant="body2" color="text.secondary">Adapter le matériel pédagogique aux besoins du marché.</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <Avatar sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                      <GroupIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Aider les formateurs</Typography>
                      <Typography variant="body2" color="text.secondary">Fournir des retours constructifs pour faire évoluer la pédagogie.</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <Avatar sx={{ bgcolor: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                      <InfoIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Satisfaction garantie</Typography>
                      <Typography variant="body2" color="text.secondary">Maximiser la réussite et l'engagement de chaque apprenant.</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: '#f8fafc',
                  border: '1px solid rgba(59,130,246,0.12)',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    bgcolor: 'rgba(37,99,235,0.05)',
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', color: '#1d4ed8', mb: 2 }}>
                  Pourquoi votre avis compte ?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  Chaque feedback est analysé anonymement par nos équipes administratives pour évaluer les points forts et les axes d'amélioration de nos parcours de formation.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Grâce à vos retours détaillés et vos notations sur 5 étoiles, nous pouvons ajuster nos programmes en temps réel et garantir des formations de niveau d'excellence.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/formations')}
                  endIcon={<ArrowIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    borderColor: '#2563eb',
                    color: '#2563eb',
                    '&:hover': {
                      borderColor: '#1d4ed8',
                      bgcolor: 'rgba(37,99,235,0.04)',
                    },
                  }}
                >
                  Accéder à mes formations
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Formations */}
      <Box id="formations" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#eff6ff' }}>
        <Container maxWidth="lg">
          <Box mb={6} textAlign="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit',
                color: '#0f172a',
                mb: 1.5,
              }}
            >
              Nos sessions de formation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Explorez les modules de formation actifs disponibles dans le catalogue Feedback360.
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
                    Aucune session de formation disponible pour le moment.
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
                          border: '1px solid rgba(59,130,246,0.12)',
                          boxShadow: '0 4px 20px rgba(15,23,42,0.02)',
                        }}
                      >
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                              <SchoolIcon />
                            </Avatar>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 700, color: '#0f172a', fontFamily: 'Outfit', fontSize: '1.05rem' }}
                            >
                              {session.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mt: 1, mb: 3, flexGrow: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                              <strong>Parcours :</strong> {session.parcoursName || 'Non spécifié'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                              <strong>Population :</strong> {session.populationName || 'Non spécifiée'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                              <strong>Type :</strong> {session.typeLabel || 'N/A'}
                            </Typography>
                            {session.trainer && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8 }}>
                                <strong>Formateur :</strong> {session.trainer}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                              {session.description || 'Explorez ce module de formation pour approfondir vos compétences professionnelles et valider vos acquis.'}
                            </Typography>
                          </Box>

                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleOpenDetails(session)}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 700,
                              borderColor: 'rgba(37,99,235,0.3)',
                              color: '#2563eb',
                              mt: 'auto',
                              '&:hover': {
                                borderColor: '#2563eb',
                                bgcolor: 'rgba(37,99,235,0.04)',
                              },
                            }}
                          >
                            Voir détails
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Section Comment ça marche */}
      <Box
        id="how-it-works"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: '#ffffff',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box mb={8} textAlign="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit',
                color: '#0f172a',
                mb: 1.5,
              }}
            >
              Comment ça marche ?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Une démarche simplifiée en 4 étapes pour soumettre et analyser vos avis de formation.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                step: '1',
                title: 'Participer à une formation',
                desc: 'Suivez vos modules de formation activement avec vos formateurs.',
                color: '#2563eb',
              },
              {
                step: '2',
                title: 'Recevoir une demande',
                desc: 'Une notification par email ou sur la plateforme vous invite à évaluer le module.',
                color: '#10b981',
              },
              {
                step: '3',
                title: 'Remplir le questionnaire',
                desc: 'Attribuez une note et saisissez vos commentaires de manière constructive.',
                color: '#f59e0b',
              },
              {
                step: '4',
                title: 'Consulter son historique',
                desc: 'Consultez le statut de tous vos feedbacks à tout moment sur votre espace personnel.',
                color: '#8b5cf6',
              },
            ].map((step, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    border: '1px solid rgba(59,130,246,0.1)',
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                    position: 'relative',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: step.color,
                      color: '#ffffff',
                      width: 50,
                      height: 50,
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      mx: 'auto',
                      mb: 2.5,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    {step.step}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontFamily: 'Outfit' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        id="contact"
        component="footer"
        sx={{
          bgcolor: '#0f172a',
          color: '#94a3b8',
          py: 6,
          mt: 'auto',
          borderTop: '1px solid #1e293b',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontFamily: 'Outfit',
                  mb: 2,
                }}
              >
                Feedback360
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ maxWidth: 400 }}>
                La plateforme ultime de gestion et d'évaluation continue de la qualité de vos formations professionnelles.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 4, justifyContent: { md: 'flex-end' }, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mb: 1.5 }}>Légal</Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button variant="text" sx={{ p: 0, minWidth: 0, color: '#94a3b8', fontSize: '0.85rem', textTransform: 'none', justifyContent: 'flex-start', '&:hover': { color: '#ffffff' } }}>
                    Mentions légales
                  </Button>
                  <Button variant="text" sx={{ p: 0, minWidth: 0, color: '#94a3b8', fontSize: '0.85rem', textTransform: 'none', justifyContent: 'flex-start', '&:hover': { color: '#ffffff' } }}>
                    Politique de confidentialité
                  </Button>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mb: 1.5 }}>Contact</Typography>
                <Typography variant="body2" color="#64748b">
                  Email: support@feedback360.com<br />
                  Tél: +33 (0) 1 00 00 00 00
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ borderColor: '#1e293b', mb: 3 }} />
          <Typography variant="body2" align="center" color="#64748b">
            &copy; {new Date().getFullYear()} Feedback360. Tous droits réservés.
          </Typography>
        </Container>
      </Box>

      {/* Interactive Session Details Dialog */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1.5,
            bgcolor: '#ffffff',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#0f172a' }}>
            Détails de la Session
          </Typography>
          <IconButton onClick={handleCloseDetails} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          {selectedSession && (
            <Box display="flex" flexDirection="column" gap={2.5} py={1}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Nom de la formation
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#2563eb', mt: 0.5 }}>
                  {selectedSession.name}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    Parcours associé
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mt: 0.5 }}>
                    {selectedSession.parcoursName || 'Non spécifié'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    Population cible
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', mt: 0.5 }}>
                    {selectedSession.populationName || 'Non spécifiée'}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    Type de module
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0f172a', mt: 0.5 }}>
                    {selectedSession.typeLabel || 'N/A'} (ID: {selectedSession.typeId || 'N/A'})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    Date d'importation
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0f172a', mt: 0.5 }}>
                    {selectedSession.createdAt ? new Date(selectedSession.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Description générale
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                  Ce module de formation fait partie de notre catalogue de développement professionnel continu. Il a été conçu pour apporter des compétences théoriques et pratiques de pointe, validées par des évaluations rigoureuses et des enquêtes de satisfaction des participants.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDetails}
            variant="outlined"
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Fermer
          </Button>
          <Button
            onClick={() => {
              handleCloseDetails();
              navigate('/formations');
            }}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            Donner un feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LandingPage;
export { LandingPage };
