import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your components
import UserLogin from './components/UserLogin';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';

import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/reception-dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/user-home" element={<Navigate to="/dashboard" replace />} />

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;