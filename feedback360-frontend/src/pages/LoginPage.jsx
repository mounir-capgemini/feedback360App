import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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
      setToastMessage('Connexion réussie !');
      setShowToast(true);

      setTimeout(() => {
        if (res.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
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
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      className="animate-fade-in"
    >
      <Card
        className="glass-panel"
        sx={{
          width: '100%',
          maxWidth: 400,
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(59,130,246,0.12)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                textAlign: 'center',
                mb: 1,
              }}
              className="gradient-text"
            >
              Feedback360
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Connectez-vous pour donner ou consulter des feedbacks
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
        </CardContent>
      </Card>

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
