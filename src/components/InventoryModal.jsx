import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function InventoryModal({ isOpen, onClose, onSubmit, initialData }) {
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'GROCERY',
    quantity: '',
    unit: 'KG',
    threshold: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        itemName: '',
        category: 'GROCERY',
        quantity: '',
        unit: 'KG',
        threshold: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md p-4">
        <div className="relative rounded-xl bg-white shadow-2xl">
          
          <div className="flex items-center justify-between border-b p-4 md:p-5">
            <h3 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Stock Item' : 'Add Stock Item'}
            </h3>
            <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="p-4 md:p-5 space-y-4" onSubmit={handleSubmit}>
            
            <div>
              <label className="mb-2 block text-sm font-medium">Item Name</label>
              <input type="text" required value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2" placeholder="e.g. Basmati Rice" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2">
                  <option value="GROCERY">Grocery</option>
                  <option value="DAIRY">Dairy</option>
                  <option value="VEGETABLES">Vegetables</option>
                  <option value="SPICES">Spices</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Unit</label>
                <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2">
                  <option value="KG">KG</option>
                  <option value="LITERS">Liters</option>
                  <option value="PACKETS">Packets</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div>
                  <label className="mb-2 block text-sm font-medium text-indigo-700">Current Quantity</label>
                  <input type="number" min="0" step="0.5" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="block w-full rounded-lg border-indigo-200 border p-2" />
               </div>
               <div>
                  <label className="mb-2 block text-sm font-medium text-red-700">Alert Threshold</label>
                  <input type="number" min="0" step="0.5" required value={formData.threshold} onChange={(e) => setFormData({...formData, threshold: e.target.value})} className="block w-full rounded-lg border-red-200 border p-2" />
               </div>
            </div>

            <div className="flex justify-end space-x-3 border-t pt-4">
              <button type="button" onClick={onClose} className="rounded-lg border bg-white px-5 py-2 hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
