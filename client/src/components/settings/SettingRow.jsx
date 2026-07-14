import React from 'react';

const SettingRow = ({ title, description, children }) => (
  <div className="flex items-center justify-between py-3">
    <div className="pr-4">
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h4>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export default SettingRow;