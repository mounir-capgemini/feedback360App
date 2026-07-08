import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
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
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  TablePagination,
  Chip,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.getAllUsers(page, rowsPerPage);
        setUsers(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger la liste des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }} className="gradient-text">
          Gestion des Utilisateurs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Liste complète de tous les participants et administrateurs enregistrés dans Feedback360.
        </Typography>
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
                    <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nom complet</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Adresse email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rôle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Créé le</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover sx={{ '&:last-child cell': { border: 0 } }}>
                      <TableCell>
                        <Avatar
                          src={u.photo || ''}
                          sx={{
                            bgcolor: '#2563eb',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
                          }}
                        >
                          {!u.photo && (u.fullName ? u.fullName.charAt(0).toUpperCase() : <AccountCircle />)}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{u.fullName}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: u.role === 'ADMIN' ? '#ef4444' : '#10b981',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
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

export default AdminUsersPage;
export { AdminUsersPage };
