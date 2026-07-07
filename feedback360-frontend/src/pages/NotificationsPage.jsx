import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Alert,
  TablePagination,
  Paper,
  Tooltip,
} from '@mui/material';
import { CheckCircle as CheckIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { notificationService } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications(page, rowsPerPage);
      setNotifications(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger vos notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, rowsPerPage]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Re-fetch to update state
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="animate-fade-in" sx={{ color: '#f3f4f6' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Outfit', mb: 3 }} className="gradient-text">
        Centre de notifications
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : notifications.length === 0 ? (
        <Paper className="glass-panel" sx={{ p: 5, background: 'rgba(17, 25, 40, 0.5)', textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 60, color: '#6b7280', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" color="#0f172a" sx={{ fontWeight: 600 }}>
            Aucune notification reçue.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Dès que de nouveaux modules vous seront importés, les alertes apparaîtront ici.
          </Typography>
        </Paper>
      ) : (
        <Paper className="glass-panel" sx={{ background: 'rgba(17, 25, 40, 0.5)' }}>
          <List sx={{ width: '100%', p: 0 }}>
            {notifications.map((notif) => {
              const isPending = notif.status === 'PENDING';
              return (
                <ListItem
                  key={notif.id}
                  sx={{
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    bgcolor: isPending ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    p: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'flex-start',
                    gap: 2,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box display="flex" gap={2} flex={1}>
                    <NotificationsIcon sx={{ color: isPending ? '#818cf8' : '#6b7280', mt: 0.5 }} />
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                        color: '#f3f4f6',
                        fontWeight: isPending ? 600 : 400,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: 'text.secondary',
                        mt: 0.5,
                      }}
                    />
                  </Box>

                  <Box display="flex" gap={1.5} alignItems="center" alignSelf={{ xs: 'flex-end', sm: 'center' }}>
                    {isPending && (
                      <Tooltip title="Marquer comme lu">
                        <IconButton
                          edge="end"
                          aria-label="mark as read"
                          onClick={() => handleMarkAsRead(notif.id)}
                          sx={{
                            color: '#34d399',
                            bgcolor: 'rgba(52, 211, 153, 0.1)',
                            '&:hover': { bgcolor: 'rgba(52, 211, 153, 0.2)' },
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes:"
            sx={{
              color: '#9ca3af',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default NotificationsPage;
export { NotificationsPage };
