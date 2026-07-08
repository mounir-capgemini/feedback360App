import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { Save as SaveIcon, AccountCircle } from '@mui/icons-material';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const photoUrl = watch('photo');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfileData(data);
        setValue('fullName', data.fullName);
        setValue('email', data.email);
        setValue('photo', data.photo || '');
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les informations du profil');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        photo: data.photo || null,
        password: data.password || null,
      };

      const updatedUser = await userService.updateProfile(payload);
      
      // Update local storage and context
      const newSessionUser = {
        userId: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        photo: updatedUser.photo
      };
      
      const token = localStorage.getItem('token');
      login(newSessionUser, token);

      setSuccess('Profil mis à jour avec succès !');
      setToastOpen(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a', maxWidth: 800, mx: 'auto' }}>
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }} className="gradient-text">
          Mon Profil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez vos informations personnelles, votre photo de profil et votre mot de passe.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            className="glass-panel"
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
            }}
          >
            <Avatar
              src={photoUrl || ''}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                boxShadow: '0 8px 16px rgba(37,99,235,0.15)',
                bgcolor: '#2563eb',
                fontSize: '3rem',
              }}
            >
              {!photoUrl && (user?.fullName ? user.fullName.charAt(0).toUpperCase() : <AccountCircle />)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>
              {user?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {user?.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                bgcolor: user?.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: user?.role === 'ADMIN' ? '#ef4444' : '#10b981',
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                fontWeight: 600,
              }}
            >
              {user?.role}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="glass-panel" sx={{ background: 'rgba(255, 255, 255, 0.9)' }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Outfit' }}>
                      Informations personnelles
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      {...register('fullName', { required: 'Le nom complet est obligatoire' })}
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Adresse email"
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
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="URL de la photo de profil"
                      placeholder="https://example.com/avatar.jpg"
                      {...register('photo')}
                      InputLabelProps={{ shrink: true }}
                      helperText="Entrez l'URL d'une image en ligne pour changer votre avatar."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1, fontFamily: 'Outfit' }}>
                      Sécurité
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nouveau mot de passe"
                      type="password"
                      placeholder="Laisser vide pour ne pas modifier"
                      {...register('password')}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        boxShadow: '0 4px 14px rgba(37,99,235,0.14)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                        },
                      }}
                    >
                      Enregistrer
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
export { ProfilePage };
