import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/LoginPage';
import DashboardAdmin from '../pages/DashboardAdmin';
import DashboardParticipant from '../pages/DashboardParticipant';
import SessionListPage from '../pages/SessionListPage';
import SessionDetailPage from '../pages/SessionDetailPage';
import FeedbackPage from '../pages/FeedbackPage';
import MyFeedbacksPage from '../pages/MyFeedbacksPage';
import NotificationsPage from '../pages/NotificationsPage';
import StatisticsPage from '../pages/StatisticsPage';
import PrivateRoute from '../components/PrivateRoute';
import { USER_ROLE } from '../utils/constants';

// Nouvelles pages
import LandingPage from '../pages/LandingPage';
import ProfilePage from '../pages/ProfilePage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminFeedbacksPage from '../pages/AdminFeedbacksPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Routes d'authentification publiques */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              user?.role === USER_ROLE.ADMIN ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/formations" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/admin/login"
          element={
            isAuthenticated() ? (
              user?.role === USER_ROLE.ADMIN ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/formations" replace />
              )
            ) : (
              <LoginPage isAdminFlow={true} />
            )
          }
        />
      </Route>

      {/* Routes protégées sous le MainLayout */}
      <Route element={<MainLayout />}>
        {/* Dashboard Participant connecté */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole={USER_ROLE.PARTICIPANT}>
              <DashboardParticipant />
            </PrivateRoute>
          }
        />

        {/* Espace Participant connecté */}
        <Route
          path="/formations"
          element={
            <PrivateRoute requiredRole={USER_ROLE.PARTICIPANT}>
              <SessionListPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/formations/:id"
          element={
            <PrivateRoute>
              <SessionDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/feedback/:formationId"
          element={
            <PrivateRoute requiredRole={USER_ROLE.PARTICIPANT}>
              <FeedbackPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-feedbacks"
          element={
            <PrivateRoute requiredRole={USER_ROLE.PARTICIPANT}>
              <MyFeedbacksPage />
            </PrivateRoute>
          }
        />

        {/* Dashboard Admin (admin uniquement) */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />

        {/* Utilisateurs (admin uniquement) */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <AdminUsersPage />
            </PrivateRoute>
          }
        />

        {/* Sessions / Formations (admin uniquement) */}
        <Route
          path="/admin/formations"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <SessionListPage />
            </PrivateRoute>
          }
        />

        {/* Historique des Feedbacks (admin uniquement) */}
        <Route
          path="/admin/feedbacks"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <AdminFeedbacksPage />
            </PrivateRoute>
          }
        />

        {/* Statistiques (admin uniquement) */}
        <Route
          path="/statistics"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <StatisticsPage />
            </PrivateRoute>
          }
        />

        {/* Notifications (admin uniquement) */}
        <Route
          path="/admin/notifications"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <NotificationsPage />
            </PrivateRoute>
          }
        />

        {/* Notifications (tous rôles authentifiés) */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />

        {/* Profil utilisateur (tous rôles authentifiés) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Redirection des routes inconnues */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
