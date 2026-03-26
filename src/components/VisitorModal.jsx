import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

/**
 * 6.4 — Visitor Modal
 * Why Modals? They prevent context switching. Instead of navigating to /visitors/new 
 * and losing sight of the table, the user edits gracefully over the existing context.
 */
export default function VisitorModal({ isOpen, onClose, onSubmit, initialData }) {
  
  // Controlled Inputs: React exclusively owns this state, not the browser DOM.
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    mealType: 'LUNCH',
    visitorCount: '',
    isSpecialDay: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When modal opens or initialData changes (Edit mode), populate the form
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form on "Add New"
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mealType: 'LUNCH',
        visitorCount: '',
        isSpecialDay: false,
        notes: ''
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
        
        {/* Modal Content */}
        <div className="relative rounded-xl bg-white shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 md:p-5">
            <h3 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Visitor Log' : 'Add Visitor Log'}
            </h3>
            <button 
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Form */}
          <form className="p-4 md:p-5 space-y-4" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Date</label>
                <input 
                  type="date" required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500" 
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Meal Type</label>
                <select 
                  value={formData.mealType}
                  onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Visitor Count</label>
              <input 
                type="number" min="0" required
                value={formData.visitorCount}
                onChange={(e) => setFormData({...formData, visitorCount: e.target.value})}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500" 
                placeholder="e.g. 150"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" id="specialDay"
                checked={formData.isSpecialDay}
                onChange={(e) => setFormData({...formData, isSpecialDay: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <label htmlFor="specialDay" className="text-sm font-medium text-gray-900">
                Mark as Special Day / Event
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Notes (Optional)</label>
              <textarea 
                rows="3"
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-indigo-500 focus:ring-indigo-500" 
                placeholder="Any specific observations..."
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3 border-t pt-4">
              <button 
                type="button" onClick={onClose}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-indigo-700"
              >
                Cancel
              </button>
              <button 
                type="submit" disabled={isSubmitting}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Record'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
