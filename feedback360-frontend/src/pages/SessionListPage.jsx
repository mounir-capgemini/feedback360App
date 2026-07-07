import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  IconButton,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { sessionService } from '../services/sessionService';
import { useNavigate } from 'react-router-dom';

const SessionListPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination et tri
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await sessionService.getSessions(page, rowsPerPage, sortBy, sortDir, search);
        setSessions(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer la liste des sessions de formation.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSessions();
    }, 300); // Debounce pour la recherche

    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, sortBy, sortDir, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDir === 'asc';
    setSortBy(property);
    setSortDir(isAsc ? 'desc' : 'asc');
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 3 }} className="gradient-text">
        Sessions de formation
      </Typography>

      {/* Barre de recherche */}
      <Box mb={3} display="flex" gap={2} alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par nom de session, module ou type..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#818cf8' }} />
              </InputAdornment>
            ),
            style: { color: '#f3f4f6' },
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
              '&:hover fieldset': { borderColor: '#818cf8' },
              '&.Mui-focused fieldset': { borderColor: '#6366f1' },
            },
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Tableau des Sessions */}
      <Paper className="glass-panel" sx={{ background: 'rgba(255,255,255,0.9)', overflow: 'hidden' }}>
        {loading && (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {!loading && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortDir : 'asc'}
                      onClick={() => handleSort('name')}
                      sx={{ color: '#9ca3af !important' }}
                    >
                      Nom de la Session
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Parcours</TableCell>
                  <TableCell sx={{ color: '#9ca3af', fontWeight: 600 }}>Population</TableCell>
                  <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortBy === 'createdAt' ? sortDir : 'asc'}
                      onClick={() => handleSort('createdAt')}
                      sx={{ color: '#9ca3af !important' }}
                    >
                      Date d'import
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 600 }}>Feedbacks reçus</TableCell>
                  <TableCell align="center" sx={{ color: '#9ca3af', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: '#9ca3af', py: 4 }}>
                      Aucune session trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow
                      key={session.id}
                      sx={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.01)' },
                      }}
                    >
                      <TableCell sx={{ color: '#f3f4f6', fontWeight: 600 }}>{session.name}</TableCell>
                      <TableCell sx={{ color: '#d1d5db' }}>{session.typeLabel || 'N/A'}</TableCell>
                      <TableCell sx={{ color: '#d1d5db' }}>{session.parcoursName || 'N/A'}</TableCell>
                      <TableCell sx={{ color: '#d1d5db' }}>{session.populationName || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ color: '#d1d5db' }}>
                        {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#f3f4f6', fontWeight: 700 }}>
                        {session.feedbackCount}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/sessions/${session.id}`)}
                            sx={{ color: '#818cf8' }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          sx={{
            color: '#9ca3af',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            '.MuiTablePagination-selectIcon': { color: '#9ca3af' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default SessionListPage;
export { SessionListPage };
