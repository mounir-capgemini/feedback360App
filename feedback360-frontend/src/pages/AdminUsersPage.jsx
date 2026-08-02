import React, { useEffect, useMemo, useState } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { AccountCircle, PersonAdd as PersonAddIcon } from '@mui/icons-material';

/**
 * ============================================================================
 * PAGE : AdminUsersPage (Gestion des Utilisateurs - Espace Admin)
 * ============================================================================
 * Rôle : Permet aux administrateurs de consulter la liste complète de tous
 *        les utilisateurs enregistrés dans la plateforme (Participants & Admins).
 * 
 * Fonctionnalités clés :
 * - Appel API paginé via `userService.getAllUsers(page, rowsPerPage)`.
 * - Affichage dynamique avec photo/avatar, rôle (`ADMIN` ou `PARTICIPANT`) sous forme de badge.
 * - Table responsive Material-UI (`TableContainer`, `TablePagination`).
 * ============================================================================
 */
const AdminUsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'PARTICIPANT',
    enabled: true,
  });

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ADMIN');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(0, 1000);
      const users = data.content || [];
      setAllUsers(users);
      setTotalElements(users.length);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la liste des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, roleFilter]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return allUsers.filter((user) => {
      const fullName = (user.fullName || '').toLowerCase();
      const matchesName = fullName.includes(query);
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      return matchesName && matchesRole;
    });
  }, [allUsers, searchTerm, roleFilter]);

  useEffect(() => {
    setTotalElements(filteredUsers.length);
  }, [filteredUsers]);

  const pagedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetUserForm = () => {
    setUserForm({
      fullName: '',
      email: '',
      password: '',
      role: 'PARTICIPANT',
      enabled: true,
    });
  };

  const openCreateDialog = () => {
    resetUserForm();
    setError('');
    setSuccessMessage('');
    setIsCreateDialogOpen(true);
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await userService.createUser({
        fullName: userForm.fullName,
        email: userForm.email,
        password: userForm.password,
      });
      setSuccessMessage('Utilisateur ajouté avec succès.');
      setIsCreateDialogOpen(false);
      resetUserForm();
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Impossible d’ajouter cet utilisateur.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="animate-fade-in" sx={{ color: '#0f172a' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 0.5 }} className="gradient-text">
            Gestion des Utilisateurs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les comptes, rôles et statuts des utilisateurs de la plateforme.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={openCreateDialog}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          + Ajouter un utilisateur
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30vh' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Card className="glass-panel" sx={{ background: 'rgba(255, 255, 255, 0.9)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  label="Rechercher par nom complet"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ minWidth: { xs: '100%', sm: 260 } }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="role-filter-label">Filtrer par rôle</InputLabel>
                  <Select
                    labelId="role-filter-label"
                    value={roleFilter}
                    label="Filtrer par rôle"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="PARTICIPANT">Participant</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'rgba(241, 245, 249, 0.6)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nom complet</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Adresse email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rôle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Créé le</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedUsers.map((u) => (
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
                        <Chip
                          label={u.enabled === false ? 'Désactivé' : 'Actif'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: u.enabled === false ? 'rgba(107, 114, 128, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            color: u.enabled === false ? '#6b7280' : '#10b981',
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

      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un utilisateur</DialogTitle>
        <form onSubmit={handleCreateUser}>
          <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField
              label="Nom complet"
              value={userForm.fullName}
              onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Adresse email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="create-user-role-label">Rôle</InputLabel>
              <Select
                labelId="create-user-role-label"
                value={userForm.role}
                label="Rôle"
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <MenuItem value="PARTICIPANT">Participant</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={userForm.enabled}
                  onChange={(e) => setUserForm({ ...userForm, enabled: e.target.checked })}
                />
              }
              label="Compte actif"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setIsCreateDialogOpen(false)} disabled={submitting}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Ajout...' : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
  );
};

export default AdminUsersPage;
export { AdminUsersPage };
