import React, { useEffect, useState } from 'react';
import { feedbackService } from '../services/feedbackService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TablePagination,
  Rating,
  Button,
} from '@mui/material';
import { FileDownload as DownloadIcon } from '@mui/icons-material';

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setError('');
    try {
      const blob = await feedbackService.exportFeedbacks();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feedbacks_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Erreur lors de l'export Excel:", err);
      setError("Erreur lors du téléchargement du rapport Excel.");
    } finally {
      setExporting(false);
    }
  };

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await feedbackService.getAllFeedbacks(page, rowsPerPage);
        setFeedbacks(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger la liste des feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
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
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }} className="gradient-text">
            Historique des Feedbacks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez et suivez toutes les évaluations de formation soumises par les participants.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={exporting}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            }
          }}
        >
          {exporting ? 'Export en cours...' : 'Exporter en Excel'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Card className="glass-panel" sx={{ background: 'rgba(255, 255, 255, 0.9)' }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'rgba(241, 245, 249, 0.6)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Participant</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Session</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Commentaire</TableCell>
                     <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                   </TableRow>
                 </TableHead>
                 <TableBody>
                   {feedbacks.map((fb) => (
                     <TableRow key={fb.id} hover sx={{ '&:last-child cell': { border: 0 } }}>
                       <TableCell sx={{ fontWeight: 500 }}>{fb.userName || 'N/A'}</TableCell>
                       <TableCell>{fb.sessionName || 'N/A'}</TableCell>
                      <TableCell>
                        <Rating value={fb.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300, wordWrap: 'break-word' }}>
                        {fb.comment || <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Aucun commentaire</Typography>}
                      </TableCell>
                      <TableCell>
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalElements}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Lignes par page"
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AdminFeedbacksPage;
export { AdminFeedbacksPage };
