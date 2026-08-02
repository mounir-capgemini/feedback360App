import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

/**
 * ============================================================================
 * PAGE : RegisterPage (Page d'Inscription des Participants)
 * ============================================================================
 * Rôle : Permet aux nouveaux participants de créer un compte sur Feedback360.
 * 
 * Fonctionnalités clés :
 * - Formulaire complet avec validation (nom complet, email, mot de passe et confirmation).
 * - Affichage/masquage dynamique du mot de passe (icônes œil).
 * - Création du compte via `authService.register(...)` puis connexion directe (`authService.login`).
 * ============================================================================
 */
const RegisterPage = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const res = await authService.register(data.fullName, data.email, data.password);
      
      const userData = {
        userId: res.userId,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
      };
      
      registerUser(userData, res.token);
      setToastMessage('Inscription réussie ! Redirection en cours...');
      setShowToast(true);

      setTimeout(() => {
        navigate('/formations', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Erreur inscription:', err);
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        py: 4,
      }}
      className="animate-fade-in"
    >
      <Card
        className="glass-panel"
        sx={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59,130,246,0.18)',
          boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                color: '#2563eb',
              }}
            >
              <PersonAddIcon fontSize="medium" />
            </Box>
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
              Créer un compte participant
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Inscrivez-vous pour évaluer vos formations et consulter vos retours d'expérience.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="Nom complet"
                variant="outlined"
                {...register('fullName', {
                  required: 'Le nom complet est obligatoire',
                  minLength: {
                    value: 2,
                    message: 'Le nom doit contenir au moins 2 caractères',
                  },
                })}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(59,130,246,0.18)' },
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                }}
              />

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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(59,130,246,0.18)' },
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Mot de passe"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Le mot de passe est obligatoire',
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(59,130,246,0.18)' },
                    '&:hover fieldset': { borderColor: '#60a5fa' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                variant="outlined"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'La confirmation du mot de passe est obligatoire',
                  validate: (value) =>
                    value === password || 'Les mots de passe ne correspondent pas',
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#60a5fa' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(59,130,246,0.18)' },
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
                  boxShadow: '0 4px 14px rgba(37,99,235,0.2)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'S\'inscrire'}
              </Button>
            </Box>
          </form>

          <Box display="flex" justifyContent="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Déjà un compte ?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  fontWeight: 700,
                  color: '#2563eb',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Se connecter
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showToast}
        autoHideDuration={2500}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
