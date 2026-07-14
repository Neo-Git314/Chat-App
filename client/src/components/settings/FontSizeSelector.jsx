import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const FontSizeSelector = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <select
      value={settings.fontSize}
      onChange={(e) => updateSetting('fontSize', e.target.value)}
      className="block w-32 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
    >
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </select>
  );
};

export default FontSizeSelector;