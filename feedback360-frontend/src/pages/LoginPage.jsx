import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  MarkEmailRead as MarkEmailReadIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

/**
 * ============================================================================
 * PAGE : LoginPage (Page de Connexion - Participant & Admin)
 * ============================================================================
 * Rôle : Permet à un utilisateur (Participant ou Administrateur) de s'authentifier.
 * 
 * Fonctionnalités clés :
 * - Notification TalentUp : Affiche un message d'information éphémère (disparaît après 6 secondes).
 * - Validation des identifiants avec `react-hook-form`.
 * - Appel API `authService.login(...)` pour récupérer le Token JWT et les infos utilisateur.
 * - Redirection automatique selon le rôle (`/admin/dashboard` ou `/dashboard`).
 * ============================================================================
 */
const LoginPage = ({ isAdminFlow = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Notification TalentUp
  const [showTalentUpBanner, setShowTalentUpBanner] = useState(true);

  // Auto-fermeture de la notification après 6 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTalentUpBanner(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
     
      const userData = {
        userId: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      };
     
      login(userData, res.token);
      setToastMessage('Connexion réussie ! Formation Angular Fundamentals finalisée.');
      setShowToast(true);

      let targetPath = location.state?.from?.pathname;
      if (res.role === 'ADMIN' || res.role === 'GESTIONNAIRE') {
        if (!targetPath || targetPath === '/formations' || targetPath === '/dashboard' || targetPath === '/my-feedbacks' || targetPath === '/unauthorized') {
          targetPath = '/admin/dashboard';
        }
      } else {
        if (!targetPath || targetPath.startsWith('/admin') || targetPath === '/unauthorized') {
          targetPath = '/dashboard';
        }
      }

      setTimeout(() => {
        navigate(targetPath, {
          replace: true,
          state: { successMessage: 'Formation Angular Fundamentals finalisée.' },
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Identifiants incorrects ou serveur indisponible'
      );
    } finally {
      setLoading(false);
    }
  };

    return (
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#f8fafc',
      }}
      className="animate-fade-in"
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Decorative Orbs */}
        <Box className="glow-orb glow-orb-1" sx={{ top: '-10%', left: '-5%', opacity: 0.2 }} />
        <Box className="glow-orb glow-orb-2" sx={{ bottom: '10%', right: '-5%', opacity: 0.15 }} />

        <Box sx={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 2.5, zIndex: 1 }}>
          {/* Notification système TalentUp */}
          {showTalentUpBanner && (
            <Card
              className="animate-fade-in"
              sx={{
                width: '100%',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(37,99,235,0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<MarkEmailReadIcon sx={{ fontSize: '1rem !important', color: '#1d4ed8 !important' }} />}
                      label="SYSTEME TALENTUP"
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        border: '1px solid #93c5fd',
                      }}
                    />
                    <Chip
                      icon={<SchoolIcon sx={{ fontSize: '0.9rem !important', color: '#047857 !important' }} />}
                      label="Angular Fundamentals"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <IconButton size="small" onClick={() => setShowTalentUpBanner(false)} title="Fermer la notification">
                    <CloseIcon sx={{ fontSize: 18, color: '#64748b' }} />
                  </IconButton>
                </Box>

                <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, lineHeight: 1.4 }}>
                  📩 Des emails de notification et de demande d'évaluation ont été envoyés automatiquement par le système TalentUp aux apprenants ayant finalisé la formation <strong>Angular Fundamentals</strong>.
                </Typography>
              </Box>
            </Card>
          )}

          <Card
            className="glass-panel hover-card"
            sx={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(59,130,246,0.12)',
              boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  textAlign: 'center',
                  mb: 0.5,
                }}
                className="gradient-text"
              >
                Feedback360
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: '#1e3a8a',
                  textAlign: 'center',
                  mb: 0.5,
                }}
              >
                {isAdminFlow ? 'Espace Administrateur' : 'Espace Participant'}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {isAdminFlow
                  ? 'Connectez-vous pour gérer les formations et les feedbacks'
                  : 'Connectez-vous pour consulter et évaluer vos formations'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  fullWidth
                  label="Adresse Email"
                  variant="outlined"
                  type="email"
                  {...register('email', {
                    required: "L'adresse email est obligatoire",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "L'adresse email n'est pas valide",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputLabelProps={{ style: { color: '#475569' } }}
                  inputProps={{
                    style: { color: '#0f172a' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(59,130,246,0.08)' },
                      '&:hover fieldset': { borderColor: '#60a5fa' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Mot de passe"
                  variant="outlined"
                  type="password"
                  {...register('password', {
                    required: 'Le mot de passe est obligatoire',
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputLabelProps={{ style: { color: '#475569' } }}
                  inputProps={{
                    style: { color: '#0f172a' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(59,130,246,0.08)' },
                      '&:hover fieldset': { borderColor: '#60a5fa' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.14)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                      boxShadow: '0 6px 20px rgba(37,99,235,0.18)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                </Button>
              </Box>
            </form>

            <Box display="flex" justifyContent="center" mt={2}>
              {isAdminFlow ? (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none', fontWeight: 600, color: '#2563eb' }}
                >
                  Vous êtes participant ? Connexion participant
                </Button>
              ) : (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/admin/login')}
                  sx={{ textTransform: 'none', fontWeight: 600, color: '#2563eb' }}
                >
                  Vous êtes administrateur ? Connexion admin
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>

      <Snackbar
        open={showToast}
        autoHideDuration={2000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
export { LoginPage };