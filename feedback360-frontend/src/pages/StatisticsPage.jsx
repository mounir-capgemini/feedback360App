import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { dashboardService } from '../services/dashboardService';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const FALLBACK_STATS = {
  monthlyFeedbacks: [
    { month: '2026-03', count: 8 },
    { month: '2026-04', count: 15 },
    { month: '2026-05', count: 22 },
    { month: '2026-06', count: 18 },
    { month: '2026-07', count: 27 },
  ],
  feedbacksBySession: [
    { sessionName: 'Spring Boot 3', feedbackCount: 12, averageRating: 4.8 },
    { sessionName: 'Design System', feedbackCount: 9, averageRating: 5.0 },
    { sessionName: 'CI/CD & Kubernetes', feedbackCount: 7, averageRating: 4.5 },
    { sessionName: 'Pipeline IA', feedbackCount: 11, averageRating: 4.9 },
  ],
  ratingDistribution: [],
};

const StatisticsPage = () => {
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
        setError('Statistiques API indisponibles — affichage des données exemples.');
        setStats(FALLBACK_STATS);
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

  // 1. Chart Data: Monthly Trends
  const monthlyLabels = stats.monthlyFeedbacks.map((item) => item.month);
  const monthlyData = stats.monthlyFeedbacks.map((item) => item.count);

  const lineChartData = {
    labels: monthlyLabels.length > 0 ? monthlyLabels : ['Aucune donnée'],
    datasets: [
      {
        label: 'Feedbacks soumis par mois',
        data: monthlyData.length > 0 ? monthlyData : [0],
        fill: false,
        backgroundColor: '#818cf8',
        borderColor: '#6366f1',
        tension: 0.3,
        pointBackgroundColor: '#a5b4fc',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#0f172a' } },
      title: { display: true, text: 'Évolution mensuelle des feedbacks', color: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' } },
      y: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569', stepSize: 1 } },
    },
  };

  // 2. Chart Data: Session Averages
  const sessionLabels = stats.feedbacksBySession.map((item) => item.sessionName);
  const sessionAverages = stats.feedbacksBySession.map((item) => item.averageRating);

  const sessionBarData = {
    labels: sessionLabels.length > 0 ? sessionLabels : ['Aucune session'],
    datasets: [
      {
        label: 'Note moyenne de la session',
        data: sessionAverages.length > 0 ? sessionAverages : [0],
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  const sessionBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Note moyenne par session de formation', color: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' } },
      y: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' }, min: 0, max: 5 },
    },
  };

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 1 }} className="gradient-text">
        Analyses & Statistiques
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Visualisez les tendances mensuelles et les performances de vos sessions de formation.
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Graphique de tendance temporelle */}
        <Grid item xs={12} md={6}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255, 255, 255, 0.92)' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </Paper>
        </Grid>

        {/* Notes moyennes par session */}
        <Grid item xs={12} md={6}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255, 255, 255, 0.92)' }}>
            <Bar data={sessionBarData} options={sessionBarOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsPage;
export { StatisticsPage };
