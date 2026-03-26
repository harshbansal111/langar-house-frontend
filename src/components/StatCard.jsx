import React from 'react';

/**
 * Reusable StatCard Component.
 * Why? Instead of duplicating 30 lines of Tailwind markup 4 times in the Dashboard,
 * we create a single source of truth. If we ever want to change the border radius
 * roundness or shadow intensity, we only change it in this file!
 */
export default function StatCard({ title, value, icon: Icon, color = 'indigo' }) {
  // Tailwind dynamic color mappings for the icon highlight
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  const iconTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${iconTheme}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
