import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  // Privacy
  appLock: false,
  hideSensitiveContent: false,
  // Notifications
  enableNotifications: true,
  notificationSound: true,
  desktopNotifications: false,
  messagePreview: true,
  // Appearance
  theme: 'light', // 'light' | 'dark'
  accentColor: '#3b82f6', // default blue
  wallpaper: 'default',
  fontSize: 'medium', // 'small' | 'medium' | 'large'
  bubbleStyle: 'rounded', // 'rounded' | 'compact'
  chatDensity: 'comfortable', // 'comfortable' | 'compact'
  // Data
  autoDownloadMedia: true,
};

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  // Persist settings on change
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    
    // Apply Theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Font Size dynamically to root
    const root = document.documentElement;
    if (settings.fontSize === 'small') root.style.fontSize = '14px';
    else if (settings.fontSize === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px'; // medium

    // Apply Accent Color as CSS variable
    root.style.setProperty('--accent-color', settings.accentColor);
    
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('chatSettings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};