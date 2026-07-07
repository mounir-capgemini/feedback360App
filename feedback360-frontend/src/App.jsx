import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(59, 130, 246, 0.15)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: 'Outfit, sans-serif' },
    h2: { fontFamily: 'Outfit, sans-serif' },
    h3: { fontFamily: 'Outfit, sans-serif' },
    h4: { fontFamily: 'Outfit, sans-serif' },
    h5: { fontFamily: 'Outfit, sans-serif' },
    h6: { fontFamily: 'Outfit, sans-serif' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
