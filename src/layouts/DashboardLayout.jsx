import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Soup, 
  Package, 
  ClipboardCheck, 
  LogOut,
  Utensils,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function DashboardLayout() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  // 10.8 Mobile Sidebar Toggle State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch(err) {}
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/visitors', icon: Users, label: 'Visitors' },
    { path: '/food', icon: Soup, label: 'Food Prepared' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/attendance', icon: ClipboardCheck, label: 'Staff Attendance' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* 10.8 Mobile Header & Hamburger Toggle */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30">
        <div className="flex items-center">
          <Utensils className="h-6 w-6 text-indigo-600 mr-2" />
          <span className="font-bold tracking-tight">Langar House</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop Fixed, Mobile Absolute) */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        absolute md:relative z-20 w-64 h-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out pt-16 md:pt-0
      `}>
        
        {/* Logo Area (Desktop) */}
        <div className="hidden md:flex h-16 items-center px-6 border-b border-gray-100">
          <Utensils className="h-6 w-6 text-indigo-600 mr-2" />
          <span className="font-bold text-lg tracking-tight">Langar House</span>
        </div>

        {/* 10.7 Navigation Improvements */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)} // Close menu on mobile click
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className={`text-xs font-bold uppercase mt-0.5 ${role === 'ADMIN' ? 'text-indigo-600' : 'text-gray-500'}`}>
                {role || 'STAFF'}
              </p>
            </div>
            <button onClick={handleLogout} className="ml-2 p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* Add top padding on mobile to account for fixed header */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50/50 pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
