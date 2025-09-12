import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import Dashboard from './pages/Base';
import AuthPages from './pages/Login';
import PaymentMethodForm from './pages/Payments';
import CreatorContentPage from './pages/Contest';

const isAuthenticated = () => {
  const creatorData =
    localStorage.getItem('streamCreatorData') ||
    sessionStorage.getItem('streamCreatorData');

  if (!creatorData) return false;

  try {
    const parsedData = JSON.parse(creatorData);
    return !!parsedData.access_code;
  } catch {
    return false;
  }
};

const ProtectedRoute = () => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<AuthPages />} />
      <Route path="dashboard" element={<Dashboard />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="payments" element={<PaymentMethodForm />} />
        <Route path="context" element={<CreatorContentPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
