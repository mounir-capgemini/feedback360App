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

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Routes d'authentification publiques */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              user?.role === USER_ROLE.ADMIN ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />
      </Route>

      {/* Routes protégées sous le MainLayout */}
      <Route element={<MainLayout />}>
        {/* Page d'accueil / Tableau de bord participant */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              {user?.role === USER_ROLE.ADMIN ? (
                <Navigate to="/admin" replace />
              ) : (
                <DashboardParticipant />
              )}
            </PrivateRoute>
          }
        />

        {/* Dashboard Admin (admin uniquement) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole={USER_ROLE.ADMIN}>
              <DashboardAdmin />
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

        {/* Sessions (tous rôles) */}
        <Route
          path="/sessions"
          element={
            <PrivateRoute>
              <SessionListPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/sessions/:id"
          element={
            <PrivateRoute>
              <SessionDetailPage />
            </PrivateRoute>
          }
        />

        {/* Mes feedbacks (tous rôles authentifiés) */}
        <Route
          path="/my-feedbacks"
          element={
            <PrivateRoute>
              <MyFeedbacksPage />
            </PrivateRoute>
          }
        />

        {/* Donner un feedback (participant uniquement) */}
        <Route
          path="/feedback/:sessionId"
          element={
            <PrivateRoute requiredRole={USER_ROLE.PARTICIPANT}>
              <FeedbackPage />
            </PrivateRoute>
          }
        />

        {/* Notifications (tous rôles) */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
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
