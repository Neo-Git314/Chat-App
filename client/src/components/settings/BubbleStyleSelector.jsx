import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const BubbleStyleSelector = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="flex space-x-4">
      <label className="flex items-center space-x-2 cursor-pointer text-sm dark:text-gray-200">
        <input
          type="radio"
          name="bubbleStyle"
          value="rounded"
          checked={settings.bubbleStyle === 'rounded'}
          onChange={(e) => updateSetting('bubbleStyle', e.target.value)}
          className="text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
        />
        <span>Rounded</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer text-sm dark:text-gray-200">
        <input
          type="radio"
          name="bubbleStyle"
          value="compact"
          checked={settings.bubbleStyle === 'compact'}
          onChange={(e) => updateSetting('bubbleStyle', e.target.value)}
          className="text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
        />
        <span>Compact</span>
      </label>
    </div>
  );
};

export default BubbleStyleSelector;