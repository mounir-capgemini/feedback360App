import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Rating } from '@mui/material';
import { People as PeopleIcon, School as SchoolIcon, RateReview as ReviewIcon, Star as StarIcon } from '@mui/icons-material';
import { dashboardService } from '../services/dashboardService';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Enregistrer les composants requis de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des statistiques du dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

  // Configuration des graphiques Chart.js
  const ratingLabels = stats.ratingDistribution.map((item) => `${item.rating} Étoile(s)`);
  const ratingData = stats.ratingDistribution.map((item) => item.count);

  const barChartData = {
    labels: ratingLabels,
    datasets: [
      {
        label: 'Nombre de feedbacks',
        data: ratingData,
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#eab308',
          '#3b82f6',
          '#10b981',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Distribution des notes de feedback', color: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af', stepSize: 1 } },
    },
  };

  const pieChartData = {
    labels: ['En attente', 'Soumis'],
    datasets: [
      {
        data: [stats.pendingFeedbacks, stats.submittedFeedbacks],
        backgroundColor: ['rgba(99, 102, 241, 0.7)', 'rgba(16, 185, 129, 0.7)'],
        borderColor: ['#6366f1', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#0f172a' } },
      title: { display: true, text: 'Statut des feedbacks demandés', color: '#0f172a' },
    },
  };

  const statCards = [
    { title: 'Utilisateurs', value: stats.totalUsers, icon: <PeopleIcon sx={{ fontSize: 40, color: '#818cf8' }} /> },
    { title: 'Sessions créées', value: stats.totalSessions, icon: <SchoolIcon sx={{ fontSize: 40, color: '#34d399' }} /> },
    { title: 'Feedbacks reçus', value: stats.totalFeedbacks, icon: <ReviewIcon sx={{ fontSize: 40, color: '#fb7185' }} /> },
    { title: 'Note globale moyenne', value: `${stats.averageRating} / 5`, icon: <StarIcon sx={{ fontSize: 40, color: '#fbbf24' }} /> },
  ];

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 3 }} className="gradient-text">
        Tableau de bord administrateur
      </Typography>

      {/* Grid Cartes Stats */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card className="hover-card glass-panel" sx={{ background: 'rgba(255,255,255,0.9)' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit' }}>
                    {card.value}
                  </Typography>
                </Box>
                {card.icon}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '80%' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tableau récapitulatif par session */}
      <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Outfit', mb: 2 }}>
        Performance par session de formation
      </Typography>
      <TableContainer component={Paper} className="glass-panel" sx={{ background: 'rgba(255,255,255,0.9)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
              <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Session de formation</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 600 }}>Feedbacks reçus</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 600 }}>Note moyenne</TableCell>
              <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 600 }}>Évaluation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.feedbacksBySession.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: '#9ca3af' }}>
                  Aucune session disponible
                </TableCell>
              </TableRow>
            ) : (
              stats.feedbacksBySession.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#f3f4f6' }}>
                    {row.sessionName}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#f3f4f6' }}>{row.feedbackCount}</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f4f6', fontWeight: 700 }}>
                    {row.averageRating} / 5
                  </TableCell>
                  <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Rating value={row.averageRating} readOnly precision={0.1} size="small" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashboardAdmin;
export { DashboardAdmin };
