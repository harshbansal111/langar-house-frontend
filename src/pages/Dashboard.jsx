import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getVisitorTrends, getFoodDistribution } from '../api/dashboardApi';
import StatCard from '../components/StatCard';
import { Users, Soup, AlertCircle, ClipboardCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function Dashboard() {
  const { role, user } = useAuth(); // Extracted for Role Awareness!
  const [loading, setLoading] = useState(true);
  
  // State for our API data
  const [stats, setStats] = useState({
    totalVisitorsToday: 0,
    mealsPreparedToday: 0,
    lowStockItemsCount: 0,
    staffPresentToday: 0
  });
  const [trends, setTrends] = useState([]);
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    // We use an async IIFE to fire parallel requests cleanly
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Promise.all to fetch everything simultaneously rather than waiting for each sequentially
        const [statsData, trendsData, foodDist] = await Promise.all([
          getDashboardStats(),
          getVisitorTrends(),
          getFoodDistribution()
        ]);

        setStats(statsData);
        setTrends(trendsData);
        setFoodData(foodDist);

      } catch (err) {
        // Axios interceptors handle the Toast popup if it's 401/403/429!
        // We only fallback locally to prevent blank screens.
        console.error("Dashboard Failed to Load", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 1. Loading UI (Never leave a blank screen!)
  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center text-indigo-600">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Crunching today's metrics...</p>
        </div>
      </div>
    );
  }

  // 2. Main Dashboard Render
  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.email.split('@')[0]}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening at Langar House today.
          </p>
        </div>
        
        {/* ROLE AWARENESS LOGIC: Only Admins can see "Manage Settings" */}
        {role === 'ADMIN' && (
          <div className="mt-4 md:mt-0">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Manage System Settings
            </button>
          </div>
        )}
      </div>

      {/* Grid Layout for Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Visitors Today" 
          value={stats.totalVisitorsToday || 0} 
          icon={Users} 
          color="indigo" 
        />
        <StatCard 
          title="Meals Prepared Today" 
          value={stats.mealsPreparedToday || 0} 
          icon={Soup} 
          color="green" 
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStockItemsCount || 0} 
          icon={AlertCircle} 
          color={stats.lowStockItemsCount > 0 ? "red" : "blue"} 
        />
        <StatCard 
          title="Staff Present Today" 
          value={stats.staffPresentToday || 0} 
          icon={ClipboardCheck} 
          color="yellow" 
        />
      </div>

      {/* Charts Section using Recharts (React-native SVGs for max performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Chart 1: Line Chart for Trends */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Visitor Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                />
                <Line type="monotone" dataKey="visitors" stroke="#4F46E5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bar Chart for Food */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={foodData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}  
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Role-Based Read-Only Notification for STAFF */}
      {role === 'STAFF' && (
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You are viewing the dashboard in <strong>STAFF</strong> mode. Your access is restricted to read-only metrics and attendance logging.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
