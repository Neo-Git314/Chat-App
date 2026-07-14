import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const ColorPicker = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="flex space-x-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => updateSetting('accentColor', color)}
          className={`w-6 h-6 rounded-full border-2 transition-transform ${
            settings.accentColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;