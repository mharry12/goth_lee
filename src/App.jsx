import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// import SideNav from './components/Sidenav';
// import Dashboard from './pages/Base';
import AuthPages from './pages/Login';
import PaymentMethodForm from './pages/Payments';
// import SubscriptionPlans from './pages/Sub';
// import WelcomeStream from './pages/Message';
import CreatorContentPage from './pages/Contest';

// Authentication check function
// New authentication check
const isAuthenticated = () => {
  // Check if creator data exists in storage
  const creatorData = localStorage.getItem('streamCreatorData') || 
                     sessionStorage.getItem('streamCreatorData');
  
  if (!creatorData) return false;
  
  try {
    const parsedData = JSON.parse(creatorData);
    // Verify the access_code exists
    return !!parsedData.access_code;
  } catch {
    return false;
  }
};

// Protected Route wrapper component
const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // Optional: Store the attempted path to redirect back after auth
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  
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
        <Route>
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          {/* <Route path="sub" element={<SubscriptionPlans />} /> */}
          <Route path="/payments" element={<PaymentMethodForm />} />
          {/* <Route path="message" element={<WelcomeStream />} /> */}
          <Route path="context" element={<CreatorContentPage/>} />

          
        </Route>
      </Route>

      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;