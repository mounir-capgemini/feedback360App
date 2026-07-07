import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Rating,
  List,
  ListItem,
  ListItemText,
  Paper,
  TablePagination,
} from '@mui/material';
import { ArrowBack as BackIcon, RateReview as ReviewIcon, Star as StarIcon } from '@mui/icons-material';
import { sessionService } from '../services/sessionService';
import { feedbackService } from '../services/feedbackService';
import { useAuth } from '../hooks/useAuth';

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination pour les feedbacks
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      setLoading(true);
      try {
        const sessionData = await sessionService.getSessionById(id);
        setSession(sessionData);

        const feedbackData = await feedbackService.getFeedbacksBySession(id, page, rowsPerPage);
        setFeedbacks(feedbackData.content || []);
        setTotalElements(feedbackData.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer le détail de la session.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [id, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !session) {
    return (
      <Box>
        <Alert severity="error">{error || 'Session introuvable'}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/sessions')} sx={{ mt: 2 }}>
          Retour aux sessions
        </Button>
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in" sx={{ color: '#f3f4f6' }}>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/sessions')} sx={{ color: '#818cf8', mb: 3 }}>
        Retour à la liste
      </Button>

      <Grid container spacing={3}>
        {/* Informations session */}
        <Grid item xs={12} md={5}>
          <Card className="glass-panel" sx={{ background: 'rgba(255,255,255,0.9)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 3 }} className="gradient-text">
                {session.name}
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">ID TalentUp Module</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{session.talentUpModuleId}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{session.typeLabel || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Parcours</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{session.parcoursName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Population</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{session.populationName || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Importé le</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Date(session.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>

              {user?.role === 'PARTICIPANT' && (
                <Box mt={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ReviewIcon />}
                    onClick={() => navigate(`/feedback/${session.id}`)}
                    sx={{
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    Donner mon avis
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Feedbacks reçus */}
        <Grid item xs={12} md={7}>
          <Paper className="glass-panel" sx={{ p: 4, background: 'rgba(255,255,255,0.9)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>
                Avis et commentaires ({totalElements})
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, borderColor: 'rgba(59,130,246,0.12)' }} />

            {feedbacks.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flex={1} py={4}>
                <StarIcon sx={{ fontSize: 50, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Aucun feedback n'a été soumis pour cette session pour le moment.
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" flex={1}>
                <List sx={{ flex: 1 }}>
                  {feedbacks.map((fb) => (
                    <Card key={fb.id} sx={{ mb: 2, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#a5b4fc' }}>
                            {fb.userName || 'Participant Anonyme'}
                          </Typography>
                          <Rating value={fb.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#d1d5db', fontStyle: 'italic', mb: 1 }}>
                          "{fb.comment}"
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" align="right">
                          {new Date(fb.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </List>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={totalElements}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Lignes:"
                  sx={{ color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.08)' }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDetailPage;
export { SessionDetailPage };
