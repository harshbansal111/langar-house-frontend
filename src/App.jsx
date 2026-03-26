import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import our beautiful new Layout and Login page
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';

import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Food from './pages/Food';
import Inventory from './pages/Inventory';
import Attendance from './pages/Attendance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Wrapper Route */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* These pages render INSIDE the <Outlet /> of DashboardLayout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/visitors" element={<Visitors />} />
            <Route path="/food" element={<Food />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/attendance" element={<Attendance />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
