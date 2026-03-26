import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import VisitorModal from '../components/VisitorModal';
import { getVisitors, createVisitor, updateVisitor, deleteVisitor } from '../api/visitorApi';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Visitors() {
  const { role } = useAuth(); // 6.6 Backend Role Awareness
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // 6.5 Initial Fetch
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const records = await getVisitors(0, 50); // Fetching page 0
      setData(records);
    } catch (err) {
      // Errors auto-handled by Axios Interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 6.5 Handle Form Submission (Create or Update)
  const handleModalSubmit = async (formData) => {
    try {
      if (editingRecord) {
        await updateVisitor(editingRecord.id, formData);
        toast.success("Visitor log updated successfully");
      } else {
        await createVisitor(formData);
        toast.success("New visitor log added");
      }
      setIsModalOpen(false);
      
      // Re-fetch to guarantee our frontend state matches the database 100%
      fetchRecords(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // 6.5 Handle Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteVisitor(id);
      toast.success("Record deleted");
      fetchRecords();
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  // 6.3 Table Configuration
  const columns = [
    { key: 'date', label: 'Date' },
    { 
      key: 'mealType', 
      label: 'Meal',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.mealType === 'LUNCH' ? 'bg-amber-100 text-amber-800' : 
          row.mealType === 'DINNER' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.mealType}
        </span>
      )
    },
    { key: 'visitorCount', label: 'Count', className: 'text-right', cellClassName: 'text-right font-medium' },
    { 
      key: 'isSpecialDay', 
      label: 'Special Event',
      render: (row) => row.isSpecialDay ? '⭐ Yes' : 'No' 
    },
    { key: 'notes', label: 'Notes', render: (row) => row.notes || <span className="text-gray-400">—</span> },
    
    // 6.6 Conditional Actions Column (Only visible to ADMIN)
    ...(role === 'ADMIN' ? [{
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => { setEditingRecord(row); setIsModalOpen(true); }}
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }] : [])
  ];

  return (
    <div className="space-y-6">
      
      {/* 6.2 Header Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Visitor Management</h1>
          <p className="mt-1 text-sm text-gray-500">Track and log daily langar attendance.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {/* 6.6 Admin Only Add Button */}
          {role === 'ADMIN' && (
            <button 
              onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </button>
          )}
        </div>
      </div>

      {/* Reusable Data Table */}
      <DataTable columns={columns} data={data} loading={loading} />

      {/* Controlled Entry Modal */}
      <VisitorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingRecord}
      />

    </div>
  );
}
