import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AttendanceModal({ isOpen, onClose, onSubmit, initialData }) {
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    staffName: '',
    role: 'COOK',
    status: 'PRESENT',
    shift: 'MORNING'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({
      date: new Date().toISOString().split('T')[0],
      staffName: '',
      role: 'COOK',
      status: 'PRESENT',
      shift: 'MORNING'
    });
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
              {initialData ? 'Edit Attendance' : 'Log Attendance'}
            </h3>
            <button onClick={onClose} className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="p-4 md:p-5 space-y-4" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Date</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Shift</label>
                <select value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2">
                  <option value="MORNING">Morning</option>
                  <option value="EVENING">Evening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Staff Name</label>
              <input type="text" required value={formData.staffName} onChange={(e) => setFormData({...formData, staffName: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2" placeholder="e.g. Ramesh Singh" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Job Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2">
                  <option value="COOK">Cook</option>
                  <option value="SERVER">Server</option>
                  <option value="CLEANER">Cleaner</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2">
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 border-t pt-4">
              <button type="button" onClick={onClose} className="rounded-lg border bg-white px-5 py-2 hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
