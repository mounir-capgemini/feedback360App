import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../services/sessionService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
  Chip,
  Rating,
  TextField,
  Snackbar,
  InputAdornment,
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
  FormatQuote as QuoteIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

/**
 * ============================================================================
 * PAGE : LandingPage (Page de Présentation / Vitrine Publique)
 * ============================================================================
 * Rôle : Page d'accueil publique mettant en valeur les fonctionnalités de Feedback360.
 * 
 * Fonctionnalités clés :
 * - Hero Section avec gradients modernes et appels à l'action (CTA "Commencer", "En savoir plus").
 * - Présentation des fonctionnalités clés (Intégration TalentUp, Sécurité JWT, Dashboards).
 * - Aperçu des formations et des témoignages récents.
 * - Dialogue modal de présentation du concept et des avantages.
 * ============================================================================
 */
const sampleFeedbacks = [
  {
    id: 1,
    name: 'Karim Benali',
    role: 'Développeur Fullstack Senior',
    formation: 'Architectures Microservices & Spring Boot 3',
    rating: 5,
    date: '14 Juillet 2026',
    comment: 'Une formation exceptionnelle ! Les explications sur la sécurisation avec Spring Security 6 et la gestion des transactions distribuées étaient très claires et immédiatement applicables dans nos projets.',
    avatarColor: '#2563eb',
    initials: 'KB',
    badge: 'Formé TalentUp',
  },
  {
    id: 2,
    name: 'Sophie Moreau',
    role: 'UX/UI Designer & Product Owner',
    formation: 'Design System & Accessibilité Web',
    rating: 5,
    date: '02 Juillet 2026',
    comment: 'Le contenu est parfaitement équilibré entre théorie et ateliers pratiques. L’interactivité du formateur et les retours individualisés m’ont permis d’évoluer rapidement sur nos maquettes.',
    avatarColor: '#ec4899',
    initials: 'SM',
    badge: 'Participant Vérifié',
  },
  {
    id: 3,
    name: 'Thomas Laurent',
    role: 'Ingénieur DevOps & Cloud',
    formation: 'CI/CD & Kubernetes Avancé',
    rating: 4.5,
    date: '28 Juin 2026',
    comment: 'Excellente session d’apprentissage. Les cas pratiques de déploiement continu et la configuration d’ArgoCD répondent exactement aux problématiques que nous rencontrons en entreprise.',
    avatarColor: '#10b981',
    initials: 'TL',
    badge: 'Formé TalentUp',
  },
  {
    id: 4,
    name: 'Amina El Mansouri',
    role: 'Data Engineer & Analytics Lead',
    formation: 'Pipeline de Données & IA Générative',
    rating: 5,
    date: '19 Juin 2026',
    comment: 'Retours très enrichissants ! La qualité des supports de formation et le suivi post-session avec la plateforme Feedback360 garantissent une vraie montée en compétences.',
    avatarColor: '#8b5cf6',
    initials: 'AE',
    badge: 'Participant Vérifié',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, registerUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Register Form State (Bas de page)
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  const handleRegChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (!regForm.fullName.trim()) {
      setRegError('Le nom complet est obligatoire');
      return;
    }
    if (!regForm.email.trim()) {
      setRegError('L\'adresse email est obligatoire');
      return;
    }
    if (regForm.password.length < 6) {
      setRegError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Les mots de passe ne correspondent pas');
      return;
    }

    setRegLoading(true);
    try {
      const res = await authService.register(
        regForm.fullName.trim(),
        regForm.email.trim(),
        regForm.password
      );

      const userData = {
        userId: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      };

      if (registerUser) {
        registerUser(userData, res.token);
      }

      setRegSuccessMessage('Inscription réussie ! Redirection en cours...');
      setTimeout(() => {
        navigate('/formations', { replace: true });
      }, 1200);
    } catch (err) {
      console.error('Erreur inscription landing page:', err);
      setRegError(
        err.response?.data?.message ||
          'Erreur lors de l\'inscription. Cet email est peut-être déjà utilisé.'
      );
    } finally {
      setRegLoading(false);
    }
  };

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

  const handleFormationsClick = () => {
    if (isAuthenticated()) {
      if (user?.role === 'ADMIN') {
        navigate('/admin/formations');
      } else {
        navigate('/formations');
      }
    } else {
      navigate('/login');
    }
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
          color: '#ffffff',
          py: { xs: 12, md: 16 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 -20px 80px rgba(0,0,0,0.4)',
        }}
      >
        <Box className="glow-orb glow-orb-1" />
        <Box className="glow-orb glow-orb-2" />

        <Container maxWidth="md" className="animate-fade-in" sx={{ position: 'relative', zIndex: 1 }}>
          <Box className="hero-badge" sx={{ mx: 'auto', mb: 3 }}>
            <StarsIcon sx={{ fontSize: 18, color: '#60a5fa' }} />
            <span>Plateforme d'Évaluation Continue & Retours 360°</span>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              mb: 3,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
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
              maxWidth: 720,
              mx: 'auto',
              lineHeight: 1.6,
              fontFamily: 'Plus Jakarta Sans',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Donnez votre avis constructif, évaluez vos sessions de formation et contribuez à l'excellence pédagogique continue.
          </Typography>
          <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={handleFormationsClick}
              sx={{
                px: 4,
                py: 1.8,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2.5,
                bgcolor: '#2563eb',
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 28px rgba(37,99,235,0.5)',
                },
              }}
            >
              📋 Mes formations
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleFormationsClick}
              sx={{
                px: 4,
                py: 1.8,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2.5,
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.3)',
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              ⭐ Donner un feedback
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stat Counter Strip */}
      <Box
        sx={{
          bgcolor: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {[
              { value: '98.4%', label: 'Taux de satisfaction', sub: 'Retours positifs' },
              { value: '+1,450', label: 'Feedbacks collectés', sub: 'Évaluations enregistrées' },
              { value: '4.9 / 5', label: 'Note moyenne', sub: 'Sur l’ensemble des modules' },
              { value: '48', label: 'Sessions actives', sub: 'Catalogue de formation' },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRight: { md: idx < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'Outfit',
                      background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 700, mt: 0.5 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {stat.sub}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Section À propos */}
      <Box
        id="about"
        sx={{
          py: { xs: 10, md: 16 },
          bgcolor: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background grid pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section badge */}
          <Box textAlign="center" mb={8}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 0.9,
                borderRadius: 9999,
                bgcolor: 'rgba(37,99,235,0.07)',
                border: '1px solid rgba(37,99,235,0.2)',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.85rem',
                mb: 2.5,
              }}
            >
              <InfoIcon fontSize="small" />
              <span>Notre mission</span>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                color: '#0f172a',
                mb: 2,
                fontSize: { xs: '1.875rem', md: '2.5rem' },
              }}
            >
              À propos de Feedback360
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 680, mx: 'auto', lineHeight: 1.7, fontSize: '1.05rem' }}
            >
              Feedback360 est une plateforme d'évaluation continue conçue pour recueillir les avis des participants après chaque session de formation. En intégrant directement les données de TalentUp, nous créons un cercle vertueux d'amélioration continue.
            </Typography>
          </Box>

          {/* Feature Cards Row */}
          <Grid container spacing={3} mb={8}>
            {[
              {
                icon: <StarsIcon sx={{ fontSize: 26 }} />,
                title: 'Évaluer les formations',
                desc: 'Mesurer la pertinence et la qualité des modules de manière précise et structurée.',
                color: '#2563eb',
                bg: 'rgba(37,99,235,0.06)',
                border: 'rgba(37,99,235,0.18)',
                glow: 'rgba(37,99,235,0.25)',
                emoji: '⭐',
              },
              {
                icon: <TrendingUpIcon sx={{ fontSize: 26 }} />,
                title: 'Améliorer les contenus',
                desc: 'Adapter le matériel pédagogique aux besoins réels et évolutifs du marché.',
                color: '#10b981',
                bg: 'rgba(16,185,129,0.06)',
                border: 'rgba(16,185,129,0.18)',
                glow: 'rgba(16,185,129,0.25)',
                emoji: '📈',
              },
              {
                icon: <GroupIcon sx={{ fontSize: 26 }} />,
                title: 'Aider les formateurs',
                desc: 'Fournir des retours constructifs et actionnables pour faire évoluer la pédagogie.',
                color: '#f59e0b',
                bg: 'rgba(245,158,11,0.06)',
                border: 'rgba(245,158,11,0.18)',
                glow: 'rgba(245,158,11,0.25)',
                emoji: '🧑‍🏫',
              },
              {
                icon: <ThumbUpIcon sx={{ fontSize: 26 }} />,
                title: 'Satisfaction garantie',
                desc: "Maximiser la réussite et l'engagement durable de chaque apprenant.",
                color: '#8b5cf6',
                bg: 'rgba(139,92,246,0.06)',
                border: 'rgba(139,92,246,0.18)',
                glow: 'rgba(139,92,246,0.25)',
                emoji: '🏆',
              },
            ].map((feat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 3.5,
                    bgcolor: '#ffffff',
                    border: `1px solid ${feat.border}`,
                    boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 16px 48px ${feat.glow}`,
                      borderColor: feat.color,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${feat.color}, transparent)`,
                      opacity: 0.8,
                    },
                  }}
                >
                  {/* Emoji watermark */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: 10,
                      fontSize: '4rem',
                      opacity: 0.06,
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    {feat.emoji}
                  </Typography>

                  {/* Icon box */}
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2.5,
                      bgcolor: feat.bg,
                      border: `1px solid ${feat.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color,
                      mb: 2.5,
                    }}
                  >
                    {feat.icon}
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'Outfit',
                      color: '#0f172a',
                      mb: 1,
                      fontSize: '1rem',
                    }}
                  >
                    {feat.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.7,
                      fontSize: '0.92rem',
                    }}
                  >
                    {feat.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Bottom split: Left text + Right card */}
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#0f172a', mb: 2 }}
              >
                Pourquoi votre avis compte ?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.75, fontSize: '1.02rem' }}>
                Chaque feedback est analysé anonymement par nos équipes administratives pour évaluer les points forts et les axes d'amélioration de nos parcours de formation.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.75, fontSize: '1.02rem' }}>
                Grâce à vos retours détaillés et vos notations sur 5 étoiles, nous pouvons ajuster nos programmes en temps réel et garantir des formations de niveau d'excellence.
              </Typography>
              <Button
                variant="contained"
                onClick={handleFormationsClick}
                endIcon={<ArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  bgcolor: '#2563eb',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: '#1d4ed8',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(37,99,235,0.45)',
                  },
                }}
              >
                Accéder à mes formations
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                {/* Decorative orb */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -60,
                    right: -60,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <Typography variant="overline" sx={{ color: '#60a5fa', fontWeight: 700, letterSpacing: '0.15em', display: 'block', mb: 1 }}>
                  Résultats concrets
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff', mb: 3 }}>
                  Des métriques qui parlent
                </Typography>

                {[
                  { label: 'Satisfaction globale des apprenants', value: '98.4%', color: '#34d399' },
                  { label: 'Programmes améliorés grâce aux feedbacks', value: '87%', color: '#60a5fa' },
                  { label: 'Formateurs ayant évolué pédagogiquement', value: '72%', color: '#a78bfa' },
                ].map((metric, i) => (
                  <Box key={i} sx={{ mb: i < 2 ? 3 : 0 }}>
                    <Box display="flex" justifyContent="space-between" mb={0.8}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                        {metric.label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: metric.color }}>
                        {metric.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 9999,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: metric.value,
                          borderRadius: 9999,
                          background: `linear-gradient(90deg, ${metric.color}88, ${metric.color})`,
                          transition: 'width 1s ease',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
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

      {/* Section Exemples de Feedbacks / Avis */}
      <Box
        id="testimonials"
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.8,
                borderRadius: 9999,
                bgcolor: 'rgba(37,99,235,0.08)',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.875rem',
                mb: 2,
              }}
            >
              <StarsIcon fontSize="small" />
              <span>Avis & Retours d'Expérience</span>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                color: '#0f172a',
                mb: 2,
                fontSize: { xs: '1.875rem', md: '2.5rem' },
              }}
            >
              Ce que disent nos participants
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Découvrez les témoignages et notations attribués par nos apprenants à l'issue de leurs sessions de formation sur Feedback360.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {sampleFeedbacks.map((item) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card
                  className="testimonial-card hover-card"
                  sx={{
                    height: '100%',
                    bgcolor: '#ffffff',
                    p: { xs: 3, sm: 4 },
                    boxShadow: '0 4px 20px rgba(15,23,42,0.04)',
                  }}
                >
                  <Box display="flex" flexDirection="column" gap={2.5} height="100%">
                    {/* Header bar: Rating & Date */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating
                          value={item.rating}
                          precision={0.5}
                          readOnly
                          emptyIcon={<StarIcon style={{ opacity: 0.25 }} fontSize="inherit" />}
                          sx={{ color: '#f59e0b' }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#d97706' }}>
                          {item.rating.toFixed(1)} / 5
                        </Typography>
                      </Box>

                      <Chip
                        label={item.badge}
                        size="small"
                        icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#2563eb' }} />}
                        sx={{
                          bgcolor: 'rgba(37,99,235,0.08)',
                          color: '#1d4ed8',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>

                    {/* Formation Title Badge */}
                    <Box sx={{ bgcolor: '#f1f5f9', p: 1.5, borderRadius: 2, borderLeft: '3px solid #2563eb' }}>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                        Session évaluée
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                        {item.formation}
                      </Typography>
                    </Box>

                    {/* Comment Body with quote accent */}
                    <Box sx={{ position: 'relative', flexGrow: 1, my: 1 }}>
                      <QuoteIcon
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: -6,
                          fontSize: 40,
                          color: 'rgba(59,130,246,0.1)',
                          zIndex: 0,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#334155',
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          position: 'relative',
                          zIndex: 1,
                          pl: 1,
                        }}
                      >
                        "{item.comment}"
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(226,232,240,0.8)' }} />

                    {/* User info footer */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: item.avatarColor,
                          color: '#ffffff',
                          fontWeight: 700,
                          width: 46,
                          height: 46,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                        }}
                      >
                        {item.initials}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {item.role}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          Évalué le {item.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Section Comment ça marche */}
      <Box
        id="how-it-works"
        sx={{
          py: { xs: 10, md: 16 },
          background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 55%, #0f172a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative orbs */}
        <Box sx={{ position: 'absolute', top: -80, left: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -100, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section header */}
          <Box mb={10} textAlign="center">
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 0.9,
                borderRadius: 9999,
                bgcolor: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.35)',
                color: '#a5b4fc',
                fontWeight: 700,
                fontSize: '0.85rem',
                mb: 3,
                backdropFilter: 'blur(6px)',
              }}
            >
              <HelpIcon fontSize="small" />
              <span>Guide d'utilisation</span>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                color: '#ffffff',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Comment ça marche ?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#94a3b8',
                maxWidth: 580,
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: '1.05rem',
              }}
            >
              Une démarche simplifiée en 4 étapes pour soumettre et analyser vos avis de formation.
            </Typography>
          </Box>

          {/* Steps Grid */}
          <Grid container spacing={4} alignItems="stretch">
            {[
              {
                step: '01',
                title: 'Participer à une formation',
                desc: 'Suivez vos modules de formation activement avec vos formateurs et enrichissez vos compétences professionnelles.',
                color: '#3b82f6',
                shadowColor: 'rgba(59,130,246,0.35)',
                bgGlow: 'rgba(59,130,246,0.08)',
                borderGlow: 'rgba(59,130,246,0.3)',
                icon: '🎓',
              },
              {
                step: '02',
                title: 'Recevoir une demande',
                desc: 'Une notification par email ou sur la plateforme vous invite à évaluer le module directement depuis votre espace.',
                color: '#10b981',
                shadowColor: 'rgba(16,185,129,0.35)',
                bgGlow: 'rgba(16,185,129,0.08)',
                borderGlow: 'rgba(16,185,129,0.3)',
                icon: '📩',
              },
              {
                step: '03',
                title: 'Remplir le questionnaire',
                desc: 'Attribuez une note de 1 à 5 étoiles et saisissez vos commentaires de manière constructive et détaillée.',
                color: '#f59e0b',
                shadowColor: 'rgba(245,158,11,0.35)',
                bgGlow: 'rgba(245,158,11,0.08)',
                borderGlow: 'rgba(245,158,11,0.3)',
                icon: '✍️',
              },
              {
                step: '04',
                title: 'Consulter son historique',
                desc: 'Retrouvez le statut de tous vos feedbacks à tout moment depuis votre tableau de bord personnel.',
                color: '#8b5cf6',
                shadowColor: 'rgba(139,92,246,0.35)',
                bgGlow: 'rgba(139,92,246,0.08)',
                borderGlow: 'rgba(139,92,246,0.3)',
                icon: '📊',
              },
            ].map((step, idx, arr) => (
              <Grid item xs={12} sm={6} md={3} key={idx} sx={{ position: 'relative' }}>
                {/* Connector line between steps (desktop only) */}
                {idx < arr.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      top: 50,
                      right: -16,
                      width: 32,
                      height: 2,
                      zIndex: 2,
                      background: `linear-gradient(90deg, ${step.color}60, ${arr[idx + 1].color}60)`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -3,
                        left: '35%',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: step.color,
                        opacity: 0.7,
                      },
                    }}
                  />
                )}

                <Box
                  sx={{
                    height: '100%',
                    p: { xs: 3.5, md: 4 },
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${step.borderGlow}`,
                    backdropFilter: 'blur(12px)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    cursor: 'default',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      bgcolor: step.bgGlow,
                      boxShadow: `0 20px 60px ${step.shadowColor}`,
                      border: `1px solid ${step.color}`,
                    },
                    '&:hover .step-icon-ring': {
                      boxShadow: `0 0 0 6px ${step.color}25`,
                    },
                  }}
                >
                  {/* Background step number watermark */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 12,
                      fontSize: '5rem',
                      fontWeight: 900,
                      fontFamily: 'Outfit',
                      color: 'rgba(255,255,255,0.04)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    {step.step}
                  </Typography>

                  {/* Step number badge */}
                  <Box
                    className="step-icon-ring"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${step.color}22, ${step.color}44)`,
                      border: `2px solid ${step.color}60`,
                      mb: 3,
                      transition: 'box-shadow 0.3s ease',
                      fontSize: '1.5rem',
                    }}
                  >
                    {step.icon}
                  </Box>

                  {/* Step number label */}
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: step.color,
                      mb: 1,
                      fontFamily: 'Outfit',
                    }}
                  >
                    Étape {step.step}
                  </Typography>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontFamily: 'Outfit, sans-serif',
                      color: '#f1f5f9',
                      mb: 2,
                      lineHeight: 1.3,
                      fontSize: '1.1rem',
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94a3b8',
                      lineHeight: 1.75,
                      fontSize: '0.93rem',
                    }}
                  >
                    {step.desc}
                  </Typography>

                  {/* Bottom accent line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${step.color}, transparent)`,
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                      opacity: 0.6,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* CTA Strip */}
          <Box
            sx={{
              mt: 10,
              p: { xs: 4, md: 5 },
              borderRadius: 4,
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.25)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff', mb: 0.5 }}>
                Prêt à donner votre premier feedback ?
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Connectez-vous à votre espace participant et commencez dès maintenant.
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleFormationsClick}
              endIcon={<ArrowIcon />}
              sx={{
                px: 4,
                py: 1.6,
                fontWeight: 700,
                borderRadius: 2.5,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                bgcolor: '#2563eb',
                boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(37,99,235,0.5)',
                },
              }}
            >
              Commencer maintenant
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section d'inscription en bas de page */}
      <Box
        id="register"
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        {/* Cercles décoratifs de fond */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(96,165,250,0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Colonne Gauche : Présentation */}
            <Grid item xs={12} md={6}>
              <Chip
                icon={<PersonAddIcon sx={{ color: '#60a5fa !important' }} />}
                label="REJOIGNEZ FEEDBACK360"
                sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '1px',
                  mb: 2.5,
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                }}
              />
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  mb: 2.5,
                }}
              >
                Inscrivez-vous dès aujourd'hui et exprimez votre avis
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#94a3b8',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Rejoignez la plateforme Feedback360. Créez votre compte en quelques clics pour accéder à vos formations et évaluer la qualité de vos apprentissages.
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                    }}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                    Compte gratuit pour tous les participants
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                    }}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                    Accès rapide aux sessions et questionnaires
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: 'rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                    }}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                    Suivi personnalisé de vos retours d'expérience
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Colonne Droite : Formulaire d'inscription ou message si déjà connecté */}
            <Grid item xs={12} md={6}>
              {user ? (
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    src={user.photo || ''}
                    sx={{
                      width: 72,
                      height: 72,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#2563eb',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {!user.photo && (user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U')}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff', mb: 1 }}>
                    Bienvenue, {user.fullName} !
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                    Vous êtes déjà connecté(e) avec <strong>{user.email}</strong>.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/formations')}
                    endIcon={<ArrowIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontWeight: 700,
                      borderRadius: 2.5,
                      bgcolor: '#2563eb',
                      '&:hover': { bgcolor: '#1d4ed8' },
                    }}
                  >
                    {user.role === 'ADMIN' ? 'Accéder au Dashboard Admin' : 'Consulter mes formations'}
                  </Button>
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.96)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                    color: '#0f172a',
                  }}
                >
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', mb: 0.5 }}>
                    Créer mon compte
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Remplissez le formulaire ci-dessous pour créer votre profil.
                  </Typography>

                  {regError && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                      {regError}
                    </Alert>
                  )}

                  {regSuccessMessage && (
                    <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
                      {regSuccessMessage}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleRegSubmit} display="flex" flexDirection="column" gap={2}>
                    <TextField
                      fullWidth
                      name="fullName"
                      label="Nom complet"
                      variant="outlined"
                      value={regForm.fullName}
                      onChange={handleRegChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#2563eb' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: 'rgba(59,130,246,0.2)' },
                          '&:hover fieldset': { borderColor: '#2563eb' },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      name="email"
                      label="Adresse Email"
                      type="email"
                      variant="outlined"
                      value={regForm.email}
                      onChange={handleRegChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#2563eb' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': { borderColor: 'rgba(59,130,246,0.2)' },
                          '&:hover fieldset': { borderColor: '#2563eb' },
                        },
                      }}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="password"
                          label="Mot de passe"
                          type="password"
                          variant="outlined"
                          value={regForm.password}
                          onChange={handleRegChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: '#2563eb' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: 'rgba(59,130,246,0.2)' },
                              '&:hover fieldset': { borderColor: '#2563eb' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="confirmPassword"
                          label="Confirmer"
                          type="password"
                          variant="outlined"
                          value={regForm.confirmPassword}
                          onChange={handleRegChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: '#2563eb' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '& fieldset': { borderColor: 'rgba(59,130,246,0.2)' },
                              '&:hover fieldset': { borderColor: '#2563eb' },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={regLoading}
                      endIcon={regLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                      sx={{
                        mt: 1,
                        py: 1.6,
                        fontWeight: 700,
                        borderRadius: 2.5,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                        },
                      }}
                    >
                      {regLoading ? 'Inscription...' : 'S\'inscrire maintenant'}
                    </Button>
                  </Box>

                  <Box display="flex" justifyContent="center" mt={2.5}>
                    <Typography variant="body2" color="text.secondary">
                      Déjà inscrit ?{' '}
                      <Button
                        onClick={() => navigate('/login')}
                        sx={{ textTransform: 'none', fontWeight: 700, color: '#2563eb', p: 0, minWidth: 'auto', ml: 0.5 }}
                      >
                        Se connecter
                      </Button>
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer dark={true} />

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
              handleFormationsClick();
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
