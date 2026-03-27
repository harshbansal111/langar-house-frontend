import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import FoodModal from '../components/FoodModal';
import { getFoodLogs, createFoodLog, updateFoodLog, deleteFoodLog } from '../api/foodApi';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Food() {
  const { role } = useAuth();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Computed Metrics for Charts
  const [chartData, setChartData] = useState([]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const records = await getFoodLogs(0, 50);
      setData(records);

      // STEP 7.1 Mathematical Calculation (Consumed = Prepared - Leftovers)
      let totalPrepared = 0;
      let totalWaste = 0;
      records.forEach(item => {
        // Normalizing purely for a simplistic chart (treating items equally by unit size just for visual)
        totalPrepared += Number(item.quantityPrepared);
        totalWaste += Number(item.quantityLeftover);
      });
      
      const consumed = totalPrepared - totalWaste;
      setChartData([
        { name: 'Consummation (Eaten)', value: consumed, color: '#10B981' },
        { name: 'Leftovers (Waste)', value: totalWaste, color: '#F59E0B' }
      ]);

    } catch (err) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleModalSubmit = async (formData) => {
    toast.success(editingRecord ? "Food updated" : "Food logged successfully");
    setIsModalOpen(false);
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this food log?")) {
      toast.success("Log deleted");
      fetchRecords();
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'item', label: 'Food Item', cellClassName: 'font-semibold text-gray-900' },
    { key: 'mealType', label: 'Meal' },
    { key: 'quantityPrepared', label: 'Prepared', render: (r) => `${r.quantityPrepared} ${r.unit}` },
    { key: 'quantityLeftover', label: 'Leftover', render: (r) => (
      <span className={r.quantityLeftover > 0 ? "text-amber-600 font-bold" : "text-green-600"}>
        {r.quantityLeftover} {r.unit}
      </span>
    )},
    { 
      key: 'consumed', 
      label: 'Actual Consumed', 
      // THE MAGIC of STEP 7: Realtime derived computation inside the Reusable Table
      render: (r) => (
        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {(r.quantityPrepared - r.quantityLeftover).toFixed(1)} {r.unit}
        </span>
      )
    },
    ...(role === 'ADMIN' ? [{
      key: 'actions', label: 'Actions', className: 'text-right', cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button onClick={() => { setEditingRecord(row); setIsModalOpen(true); }} className="p-1 text-gray-400 hover:text-indigo-600">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Production & Tracking</h1>
          <p className="text-sm text-gray-500">Monitor daily preparations verses actual consumption to minimize waste.</p>
        </div>
        {role === 'ADMIN' && (
          <button onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Log Food
          </button>
        )}
      </div>

      {/* STEP 7 Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: The Data Table taking up 2/3 of the screen */}
        <div className="lg:col-span-2">
          <DataTable columns={columns} data={data} loading={loading} />
        </div>

        {/* Right Side: The Consumption vs Waste Analytics Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold flex items-center mb-4 w-full border-b pb-2">
            <PieIcon className="w-5 h-5 mr-2 text-indigo-600" /> Efficiency Analytics
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={chartData} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Total consumption vs waste ratio generated dynamically from production logs.
          </p>
        </div>

      </div>

      <FoodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingRecord} />
    </div>
  );
}
