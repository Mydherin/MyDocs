import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/ui/LoginPage';
import { ProtectedRoute } from './features/auth/ui/ProtectedRoute';
import { HomePage } from './features/home/ui/HomePage';
import { SettingsPage } from './features/settings/ui/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
