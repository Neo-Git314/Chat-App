import React from 'react';

const StorageCard = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-between">
    <div>
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">App Storage Usage</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Calculated from cached app data</p>
    </div>
    <div className="text-right">
      <span className="text-lg font-bold text-[var(--accent-color)]">24.5 MB</span>
    </div>
  </div>
);

export default StorageCard;