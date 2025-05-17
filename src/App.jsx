import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import SideNav from './components/Sidenav';
import Dashboard from './pages/Base';
import AuthPages from './pages/Login';
import PaymentMethodForm from './pages/Payments';
import SubscriptionPlans from './pages/Sub';
import WelcomeStream from './pages/Message';
import CreatorContentPage from './pages/Contest';

// Authentication check function
const isAuthenticated = () => {
  return localStorage.getItem('access') || sessionStorage.getItem('access') ? true : false;
};

// Protected Route wrapper component
const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  // Outlet is used to render child routes
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<AuthPages />} />

      {/* Protected routes with authentication check */}
      <Route element={<ProtectedRoute />}>
        {/* SideNav layout wrapper */}
        <Route element={<SideNav />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sub" element={<SubscriptionPlans />} />
          <Route path="payment" element={<PaymentMethodForm />} />
          <Route path="message" element={<WelcomeStream />} />
          <Route path="context" element={<CreatorContentPage/>} />

          
        </Route>
      </Route>

      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;