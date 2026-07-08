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
import { Search as SearchIcon, Visibility as ViewIcon, RateReview as ReviewIcon } from '@mui/icons-material';
import { sessionService } from '../services/sessionService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SessionListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [allParticipantSessions, setAllParticipantSessions] = useState([]); // stocke toutes les sessions pour le filtrage local
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination et tri
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const data = await sessionService.getSessions(page, rowsPerPage, sortBy, sortDir, search);
          setSessions(data.content || []);
          setTotalElements(data.totalElements || 0);
        } else {
          // Participant: charger toutes ses sessions assignées, puis paginer/filtrer en local
          const data = await sessionService.getMySessions();
          setAllParticipantSessions(data || []);
        }
      } catch (err) {
        console.error(err);
        setError('Impossible de récupérer la liste des sessions de formation.');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      const delayDebounceFn = setTimeout(() => {
        fetchSessions();
      }, 300); // Debounce pour la recherche
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchSessions();
    }
  }, [page, rowsPerPage, sortBy, sortDir, search, isAdmin]);

  // Filtrage et tri local pour le participant
  useEffect(() => {
    if (!isAdmin) {
      let filtered = [...allParticipantSessions];

      // Recherche
      if (search.trim()) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          s =>
            (s.name && s.name.toLowerCase().includes(query)) ||
            (s.typeLabel && s.typeLabel.toLowerCase().includes(query)) ||
            (s.parcoursName && s.parcoursName.toLowerCase().includes(query))
        );
      }

      // Tri
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'createdAt') {
          valA = new Date(a.createdAt || 0);
          valB = new Date(b.createdAt || 0);
        }

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });

      setTotalElements(filtered.length);
      setSessions(filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
    }
  }, [allParticipantSessions, search, sortBy, sortDir, page, rowsPerPage, isAdmin]);

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
        {isAdmin ? 'Sessions de formation' : 'Mes Formations'}
      </Typography>

      {/* Barre de recherche */}
      <Box mb={3} display="flex" gap={2} alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par nom de session, parcours ou type..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#2563eb' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 500,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(59,130,246,0.15)' },
              '&:hover fieldset': { borderColor: '#2563eb' },
              '&.Mui-focused fieldset': { borderColor: '#1d4ed8' },
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
              <TableHead sx={{ bgcolor: 'rgba(241, 245, 249, 0.6)' }}>
                <TableRow sx={{ borderBottom: '2px solid rgba(59,130,246,0.08)' }}>
                  <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortDir : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Nom de la Session
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>Parcours</TableCell>
                  <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>Population</TableCell>
                  <TableCell align="center" sx={{ color: '#0f172a', fontWeight: 600 }}>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortBy === 'createdAt' ? sortDir : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Date d'import
                    </TableSortLabel>
                  </TableCell>
                  {isAdmin && <TableCell align="center" sx={{ color: '#0f172a', fontWeight: 600 }}>Feedbacks reçus</TableCell>}
                  <TableCell align="center" sx={{ color: '#0f172a', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center" sx={{ color: '#475569', py: 4 }}>
                      Aucune session trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow
                      key={session.id}
                      sx={{
                        borderBottom: '1px solid rgba(59,130,246,0.08)',
                        '&:hover': { bgcolor: 'rgba(59,130,246,0.02)' },
                      }}
                    >
                      <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{session.name}</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{session.typeLabel || 'N/A'}</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{session.parcoursName || 'N/A'}</TableCell>
                      <TableCell sx={{ color: '#334155' }}>{session.populationName || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ color: '#334155' }}>
                        {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="center" sx={{ color: '#0f172a', fontWeight: 700 }}>
                          {session.feedbackCount}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          {isAdmin ? (
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/formations/${session.id}`)}
                              sx={{ color: '#2563eb' }}
                            >
                              <ViewIcon />
                            </IconButton>
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<ReviewIcon />}
                              onClick={() => navigate(`/feedback/${session.id}`)}
                              sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                                },
                              }}
                            >
                              Donner avis
                            </Button>
                          )}
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
            color: '#475569',
            borderTop: '1px solid rgba(59,130,246,0.08)',
          }}
        />
      </Paper>
    </Box>
  );
};

export default SessionListPage;
export { SessionListPage };
