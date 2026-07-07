import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress, Alert, Paper, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { School as SchoolIcon, RateReview as ReviewIcon, Notifications as NotificationsIcon, ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { sessionService } from '../services/sessionService';
import { notificationService } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

const DashboardParticipant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, notificationData] = await Promise.all([
          sessionService.getSessions(0, 5, 'createdAt', 'desc'),
          notificationService.getMyNotifications(0, 5),
        ]);
        setSessions(sessionData.content || []);
        setNotifications(notificationData.content || []);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger les données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }} className="gradient-text">
          Bonjour, {user?.fullName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenue sur votre espace de feedback. Voici un aperçu de vos sessions de formation récentes et de vos requêtes.
        </Typography>
      </Box>

      {/* Cartes récapitulatives */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card className="hover-card glass-panel" sx={{ background: 'rgba(255,255,255,0.9)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <SchoolIcon sx={{ fontSize: 50, color: '#6366f1' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Sessions actives
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
                  {sessions.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="hover-card glass-panel" sx={{ background: 'rgba(17, 25, 40, 0.5)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <NotificationsIcon sx={{ fontSize: 50, color: '#f59e0b' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Notifications en attente
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
                  {notifications.filter(n => n.status === 'PENDING').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sessions de formation nécessitant un feedback */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)', height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>
                Mes Sessions de formation
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/sessions')}>
                Voir tout
              </Button>
            </Box>

            {sessions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Aucune session associée pour le moment.
              </Typography>
            ) : (
              <List>
                {sessions.map((session) => (
                  <Card key={session.id} sx={{ mb: 2, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 2 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '16px !important' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#f3f4f6' }}>
                          {session.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Parcours : {session.parcoursName || 'N/A'} • Population : {session.populationName || 'N/A'}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/feedback/${session.id}`)}
                        sx={{
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' }
                        }}
                      >
                        Donner avis
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(17, 25, 40, 0.5)', height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>
                Notifications récentes
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/notifications')}>
                Toutes
              </Button>
            </Box>

            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Pas de notifications pour l'instant.
              </Typography>
            ) : (
              <List>
                {notifications.map((notif) => (
                  <ListItem
                    key={notif.id}
                    sx={{
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: notif.status === 'PENDING' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      border: notif.status === 'PENDING' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255,255,255,0.03)'
                    }}
                  >
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      primaryTypographyProps={{ fontSize: '0.875rem', color: '#f3f4f6', fontWeight: notif.status === 'PENDING' ? 600 : 400 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardParticipant;
export { DashboardParticipant };
