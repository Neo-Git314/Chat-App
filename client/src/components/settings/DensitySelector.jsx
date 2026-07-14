import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const DensitySelector = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="flex space-x-4">
      <label className="flex items-center space-x-2 cursor-pointer text-sm dark:text-gray-200">
        <input
          type="radio"
          name="density"
          value="comfortable"
          checked={settings.chatDensity === 'comfortable'}
          onChange={(e) => updateSetting('chatDensity', e.target.value)}
          className="text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
        />
        <span>Comfortable</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer text-sm dark:text-gray-200">
        <input
          type="radio"
          name="density"
          value="compact"
          checked={settings.chatDensity === 'compact'}
          onChange={(e) => updateSetting('chatDensity', e.target.value)}
          className="text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
        />
        <span>Compact</span>
      </label>
    </div>
  );
};

export default DensitySelector;