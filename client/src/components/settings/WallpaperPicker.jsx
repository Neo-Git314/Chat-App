import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const WallpaperPicker = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <select
      value={settings.wallpaper}
      onChange={(e) => updateSetting('wallpaper', e.target.value)}
      className="block w-32 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
    >
      <option value="default">Default</option>
      <option value="solid">Solid Color</option>
      <option value="doodle">Doodle</option>
    </select>
  );
};

export default WallpaperPicker;