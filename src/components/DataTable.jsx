import React from 'react';
import { Loader2, Database } from 'lucide-react';

export default function DataTable({ columns, data, loading }) {
  
  // 10.1 Global Loading UX: Keep the table structure visible but blur the content
  // We avoid layout shifts by keeping a fixed height container.
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
          <span className="text-gray-500 font-medium tracking-wide">Fetching live data...</span>
        </div>
      </div>
    );
  }

  // 10.2 Empty States: Friendly UI instead of a blank box
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <Database className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No records found</h3>
        <p className="text-gray-500 mt-1 max-w-sm text-center">
          There is no data available for this view yet. Try adding a new record to get started.
        </p>
      </div>
    );
  }

  // 10.8 Mobile Responsiveness: 'overflow-x-auto' ensures horizontal scrolling on phones
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50/80">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                scope="col" 
                className={`px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-indigo-50/30 transition-colors duration-150">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
