import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import our beautiful new Layout and Login page
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';

// ---- Remaining Placeholder Pages ----
const Dashboard = () => <div className="text-2xl font-bold">Protected Dashboard!</div>;
const Visitors = () => <div className="text-xl">Visitors Page</div>;
const Food = () => <div className="text-xl">Food Prepared Page</div>;
const Inventory = () => <div className="text-xl">Inventory Page</div>;
const Attendance = () => <div className="text-xl">Attendance Page</div>;

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
