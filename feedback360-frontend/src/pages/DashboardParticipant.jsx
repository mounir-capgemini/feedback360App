import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress, Alert, Paper, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { School as SchoolIcon, RateReview as ReviewIcon, Notifications as NotificationsIcon, ArrowForward as ArrowIcon, AssignmentTurnedIn as SubmittedIcon, HourglassEmpty as PendingIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { sessionService } from '../services/sessionService';
import { notificationService } from '../services/notificationService';
import { dashboardService } from '../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const DashboardParticipant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, notificationData, statsData] = await Promise.all([
          sessionService.getMySessions(),
          notificationService.getMyNotifications(0, 5),
          dashboardService.getParticipantStatistics(),
        ]);
        setSessions(sessionData || []);
        setNotifications(notificationData.content || []);
        setStats(statsData);
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
          Bienvenue sur votre espace de feedback. Voici un aperçu de vos sessions de formation et de vos requêtes.
        </Typography>
      </Box>

      {/* Cartes récapitulatives */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card className="hover-card glass-panel" sx={{ background: 'rgba(255,255,255,0.9)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <SchoolIcon sx={{ fontSize: 50, color: '#2563eb' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Sessions de formation
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
                  {stats?.totalSessions || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="hover-card glass-panel" sx={{ background: 'rgba(255,255,255,0.9)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <SubmittedIcon sx={{ fontSize: 50, color: '#10b981' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Avis Complétés
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
                  {stats?.submittedFeedbacks || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card className="hover-card glass-panel" sx={{ background: 'rgba(255,255,255,0.9)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <PendingIcon sx={{ fontSize: 50, color: '#ef4444' }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Avis en Attente
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
                  {stats?.pendingFeedbacks || 0}
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
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit', color: '#0f172a' }}>
                  Mes Formations
                </Typography>
                <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/formations')}>
                Voir tout
              </Button>
            </Box>

            {sessions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Aucune session associée pour le moment.
              </Typography>
            ) : (
              <List>
                {sessions.slice(0, 5).map((session) => (
                  <Card key={session.id} sx={{ mb: 2, background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 2 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '16px !important' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a' }}>
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
                          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                          '&:hover': { background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)' }
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
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)', height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit', color: '#0f172a' }}>
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
                      bgcolor: notif.status === 'PENDING' ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                      border: notif.status === 'PENDING' ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid rgba(59,130,246,0.05)'
                    }}
                  >
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      primaryTypographyProps={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: notif.status === 'PENDING' ? 600 : 400 }}
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
