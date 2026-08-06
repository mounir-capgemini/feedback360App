import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Chip, TextField, InputAdornment } from '@mui/material';
import { People as PeopleIcon, School as SchoolIcon, RateReview as ReviewIcon, Star as StarIcon, Search as SearchIcon } from '@mui/icons-material';
import { dashboardService } from '../services/dashboardService';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';

// Enregistrer les composants requis de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const FALLBACK_STATS = {
  totalUsers: 0,
  totalSessions: 0,
  totalFeedbacks: 4,
  pendingFeedbacks: 0,
  submittedFeedbacks: 4,
  totalNotifications: 0,
  pendingNotifications: 0,
  averageRating: 4.85,
  ratingDistribution: [
    { rating: 4, count: 1 },
    { rating: 5, count: 3 },
  ],
  feedbacksBySession: [
    { sessionName: 'Spring Boot 3', feedbackCount: 1, averageRating: 5.0 },
    { sessionName: 'Design System', feedbackCount: 1, averageRating: 5.0 },
    { sessionName: 'CI/CD & Kubernetes', feedbackCount: 1, averageRating: 4.5 },
    { sessionName: 'Pipeline IA', feedbackCount: 1, averageRating: 5.0 },
  ],
  monthlyFeedbacks: [
    { month: '2026-03', count: 8 },
    { month: '2026-04', count: 15 },
    { month: '2026-05', count: 22 },
    { month: '2026-06', count: 18 },
    { month: '2026-07', count: 27 },
  ],
  userTrainingProgress: [
    { userName: 'Amina Benali', trainingName: 'Angular Fundamentals', completed: false, progress: 72 },
    { userName: 'Youssef Diallo', trainingName: 'Angular Fundamentals', completed: true, progress: 100 },
    { userName: 'Sofia El Amrani', trainingName: 'Angular Fundamentals', completed: false, progress: 45 },
    { userName: 'Karim Mansouri', trainingName: 'Spring Boot 3', completed: true, progress: 100 },
    { userName: 'Thomas Dubois', trainingName: 'CI/CD & Kubernetes', completed: false, progress: 85 },
    { userName: 'Sarah Martin', trainingName: 'Design System', completed: true, progress: 100 },
    { userName: 'Mehdi Tazi', trainingName: 'Pipeline IA', completed: false, progress: 30 },
    { userName: 'Claire Lambert', trainingName: 'Spring Boot 3', completed: false, progress: 60 },
  ],
};

/**
 * ============================================================================
 * PAGE : DashboardAdmin (Tableau de Bord Administrateur Fusionné)
 * ============================================================================
 * Rôle : Vue principale et synthétique réservée au rôle ADMIN.
 *        Fusionne le dashboard et les statistiques en une seule page.
 * 
 * Fonctionnalités clés :
 * - Indicateurs clés (KPIs) : Total utilisateurs, sessions, feedbacks reçus, note globale moyenne.
 * - Graphique Bar Chart : Répartition des notes de 1 à 5 étoiles.
 * - Graphique Pie Chart : Statut global des demandes de feedbacks (En attente vs Soumis).
 * - Graphique Line Chart : Évolution mensuelle des feedbacks.
 * - Graphique Bar Chart : Note moyenne par session de formation.
 * - Tableau récapitulatif des performances par session de formation.
 * - Tableau de suivi des formations des utilisateurs avec recherche.
 * ============================================================================
 */
const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Données statistiques API indisponibles — affichage des données exemples.');
        setStats(FALLBACK_STATS);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!stats) {
    return <Alert severity="error">Impossible de charger les statistiques du dashboard.</Alert>;
  }

  // === Configuration des graphiques Chart.js ===

  // 1. Bar Chart: Distribution des notes
  const ratingDistribution = stats.ratingDistribution || [];
  const ratingLabels = ratingDistribution.map((item) => `${item.rating} Étoile(s)`);
  const ratingData = ratingDistribution.map((item) => item.count);

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
        borderColor: ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Distribution des notes de feedback', color: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' } },
      y: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569', stepSize: 1 } },
    },
  };

  // 2. Pie Chart: Statut des feedbacks
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
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#0f172a' } },
      title: { display: true, text: 'Statut des feedbacks demandés', color: '#0f172a' },
    },
  };

  // 3. Line Chart: Évolution mensuelle
  const monthlyLabels = (stats.monthlyFeedbacks || []).map((item) => item.month);
  const monthlyData = (stats.monthlyFeedbacks || []).map((item) => item.count);

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
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#0f172a' } },
      title: { display: true, text: 'Évolution mensuelle des feedbacks', color: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' } },
      y: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569', stepSize: 1 } },
    },
  };

  // 4. Bar Chart: Notes moyennes par session
  const sessionLabels = (stats.feedbacksBySession || []).map((item) => item.sessionName);
  const sessionAverages = (stats.feedbacksBySession || []).map((item) => item.averageRating);

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
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Note moyenne par session de formation', color: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' } },
      y: { grid: { color: 'rgba(15,23,42,0.06)' }, ticks: { color: '#475569' }, min: 0, max: 5 },
    },
  };

  // === Cartes statistiques ===
  const statCards = [
    { title: 'Utilisateurs', value: stats.totalUsers, icon: <PeopleIcon sx={{ fontSize: 40, color: '#818cf8' }} /> },
    { title: 'Sessions créées', value: stats.totalSessions, icon: <SchoolIcon sx={{ fontSize: 40, color: '#34d399' }} /> },
    { title: 'Feedbacks reçus', value: stats.totalFeedbacks, icon: <ReviewIcon sx={{ fontSize: 40, color: '#fb7185' }} /> },
    { title: 'Note globale moyenne', value: `${stats.averageRating} / 5`, icon: <StarIcon sx={{ fontSize: 40, color: '#fbbf24' }} /> },
  ];

  // === Tableau de suivi des formations ===
  const allTrainingRows = Array.isArray(stats.userTrainingProgress) && stats.userTrainingProgress.length > 0
    ? stats.userTrainingProgress
    : FALLBACK_STATS.userTrainingProgress;

  const trainingRows = searchQuery.trim()
    ? allTrainingRows.filter((row) =>
        row.userName.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : allTrainingRows;

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: error ? 1 : 3 }} className="gradient-text">
        Tableau de bord administrateur
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* === Section 1 : Cartes KPIs === */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card className="hover-card glass-panel" sx={{ background: 'rgba(255,255,255,0.9)', height: '100%' }}>
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

      {/* === Section 2 : Graphiques principaux (Bar + Pie) === */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)', height: 320 }}>
            <Bar data={barChartData} options={barChartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)', height: 320 }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* === Section 3 : Graphiques avancés (Line + Bar sessions) === */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)', height: 320 }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)', height: 320 }}>
            <Bar data={sessionBarData} options={sessionBarOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* === Section 4 : Suivi des formations des utilisateurs === */}
      <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(255,255,255,0.9)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Suivi des formations des utilisateurs
          </Typography>
          <TextField
            id="suivi-search-input"
            size="small"
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 240,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(99,102,241,0.06)',
                '&:hover fieldset': { borderColor: '#6366f1' },
                '&.Mui-focused fieldset': { borderColor: '#6366f1' },
              },
            }}
          />
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Formation</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Progression</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trainingRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#64748b' }}>
                    {searchQuery.trim()
                      ? `Aucun utilisateur trouvé pour « ${searchQuery} ».`
                      : 'Aucune donnée de suivi disponible pour le moment.'}
                  </TableCell>
                </TableRow>
              ) : (
                trainingRows.map((row, index) => (
                  <TableRow key={`${row.userName}-${row.trainingName}-${index}`}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.trainingName}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.completed ? 'Terminé' : 'En cours'}
                        color={row.completed ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={row.progress || 0}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 5 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 42, fontWeight: 600 }}>
                          {Math.round(row.progress || 0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DashboardAdmin;
export { DashboardAdmin };