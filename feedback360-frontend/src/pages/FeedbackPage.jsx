import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { feedbackService } from '../services/feedbackService';
import { sessionService } from '../services/sessionService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack as BackIcon, Send as SendIcon } from '@mui/icons-material';

const FeedbackPage = () => {
  const { formationId: sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await sessionService.getSessionById(sessionId);
        setSession(data);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer les informations de la session.');
      } finally {
        setLoadingSession(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await feedbackService.submitFeedback(
        parseInt(sessionId, 10),
        data.comment,
        data.rating
      );
      setShowToast(true);
      setTimeout(() => {
        navigate('/my-feedbacks');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Une erreur est survenue lors de la soumission du feedback'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSession) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error && !session) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Retour à l'accueil
        </Button>
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in" sx={{ color: '#f3f4f6' }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate(-1)}
        sx={{ color: '#818cf8', mb: 3 }}
      >
        Retour
      </Button>

      <Card
        className="glass-panel"
        sx={{
          maxWidth: 600,
          mx: 'auto',
          background: 'rgba(17, 25, 40, 0.5)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 1 }}
            className="gradient-text"
          >
            Donner mon feedback
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: '#d1d5db' }}>
            Session : {session?.name}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={4}>
              {/* Note (Étoiles) */}
              <Box>
                <Typography component="legend" sx={{ fontWeight: 600, mb: 1, color: '#f3f4f6' }}>
                  Note générale de la session
                </Typography>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Rating
                      name="rating-input"
                      value={value}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      size="large"
                      sx={{
                        '& .MuiRating-iconFilled': { color: '#fbbf24' },
                        '& .MuiRating-iconHover': { color: '#f59e0b' },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Commentaire */}
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1, color: '#f3f4f6' }}>
                  Commentaire / Remarques
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Partagez vos impressions sur le module, le formateur, le contenu..."
                  variant="outlined"
                  {...register('comment', {
                    required: 'Le commentaire est obligatoire',
                    minLength: {
                      value: 10,
                      message: 'Le commentaire doit faire au moins 10 caractères',
                    },
                  })}
                  error={!!errors.comment}
                  helperText={errors.comment?.message}
                  InputLabelProps={{ style: { color: '#9ca3af' } }}
                  inputProps={{
                    style: { color: '#f3f4f6' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: '#818cf8' },
                      '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                    },
                  }}
                />
              </Box>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                endIcon={submitting ? null : <SendIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                  },
                }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Soumettre le feedback'}
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
          Feedback soumis avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackPage;
export { FeedbackPage };
