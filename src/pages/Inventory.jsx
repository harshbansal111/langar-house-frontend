import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import InventoryModal from '../components/InventoryModal';
import { getInventory, createItem, updateItem, deleteItem } from '../api/inventoryApi';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Inventory() {
  const { role } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const records = await getInventory(0, 50);
      setData(records);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleModalSubmit = async (formData) => {
    try {
      if (editingRecord) {
        await updateItem(editingRecord.id, formData);
        toast.success("Item updated");
      } else {
        await createItem(formData);
        toast.success("Item added to inventory");
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this inventory item?")) {
      try {
        await deleteItem(id);
        toast.success("Item deleted");
        fetchRecords();
      } catch (err) {
        toast.error("Failed to delete item");
      }
    }
  };

  const columns = [
    { key: 'itemName', label: 'Item Name', cellClassName: 'font-bold text-gray-900' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'In Stock', render: (r) => <span className="font-semibold">{r.quantity} {r.unit}</span> },
    { key: 'threshold', label: 'Minimum safe limit', render: (r) => `${r.threshold} ${r.unit}` },
    { 
      key: 'status', 
      label: 'Health Status', 
      // STEP 8.4 MAGIC: The UI assesses operational health immediately
      render: (r) => {
        const isLow = Number(r.quantity) < Number(r.threshold);
        return isLow ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" /> LOW STOCK
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> OK
          </span>
        );
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Monitor raw material stock and threshold alerts.</p>
        </div>
        {role === 'ADMIN' && (
          <button onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </button>
        )}
      </div>

      <DataTable columns={columns} data={data} loading={loading} />
      <InventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingRecord} />
    </div>
  );
}
