import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Rating,
  CircularProgress,
  Alert,
  TablePagination,
  Paper,
  Divider,
} from '@mui/material';
import { feedbackService } from '../services/feedbackService';
import { Star as StarIcon } from '@mui/icons-material';

const MyFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchMyFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await feedbackService.getMyFeedbacks(page, rowsPerPage);
        setFeedbacks(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer vos feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyFeedbacks();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 3 }} className="gradient-text">
        Mes Feedbacks
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : feedbacks.length === 0 ? (
        <Paper className="glass-panel" sx={{ p: 5, background: 'rgba(17, 25, 40, 0.5)', textAlign: 'center' }}>
          <StarIcon sx={{ fontSize: 60, color: '#6b7280', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            Aucun feedback soumis pour le moment.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Vos feedbacks apparaîtront ici dès que vous aurez évalué des sessions de formation.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" gap={3}>
              {feedbacks.map((fb) => (
                <Card
                  key={fb.id}
                  className="hover-card glass-panel"
                  sx={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(59,130,246,0.12)' }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit', color: '#818cf8' }}>
                          {fb.sessionName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Soumis le {new Date(fb.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      <Rating value={fb.rating} readOnly />
                    </Box>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
                    <Typography variant="body1" sx={{ color: '#d1d5db', fontStyle: 'italic' }}>
                      "{fb.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes:"
              sx={{ color: '#9ca3af', borderTop: 'none' }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MyFeedbacksPage;
export { MyFeedbacksPage };
