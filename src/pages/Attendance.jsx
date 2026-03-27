import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import AttendanceModal from '../components/AttendanceModal';
import { getAttendance, createAttendance, updateAttendance, deleteAttendance } from '../api/attendanceApi';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Attendance() {
  const { role } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const records = await getAttendance(0, 50);
      setData(records);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleModalSubmit = async (formData) => {
    try {
      if (editingRecord) {
        await updateAttendance(editingRecord.id, formData);
        toast.success("Attendance updated");
      } else {
        await createAttendance(formData);
        toast.success("Attendance logged");
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await deleteAttendance(id);
        toast.success("Record deleted");
        fetchRecords();
      } catch (err) {
        toast.error("Failed to delete record");
      }
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'staffName', label: 'Staff Name', cellClassName: 'font-semibold text-gray-900' },
    { key: 'role', label: 'Job Role' },
    { key: 'shift', label: 'Shift' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          r.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {r.status}
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
          <h1 className="text-2xl font-bold text-gray-900">Staff Attendance</h1>
          <p className="text-sm text-gray-500">Log shifts and presence for operational management.</p>
        </div>
        {role === 'ADMIN' && (
          <button onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Log Attendance
          </button>
        )}
      </div>

      <DataTable columns={columns} data={data} loading={loading} />
      <AttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingRecord} />
    </div>
  );
}
