import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

import SectionHeader from './settings/SectionHeader';
import SettingRow from './settings/SettingRow';
import ToggleSwitch from './settings/ToggleSwitch';
import ThemeSelector from './settings/ThemeSelector';
import ColorPicker from './settings/ColorPicker';
import WallpaperPicker from './settings/WallpaperPicker';
import FontSizeSelector from './settings/FontSizeSelector';
import BubbleStyleSelector from './settings/BubbleStyleSelector';
import DensitySelector from './settings/DensitySelector';
import StorageCard from './settings/StorageCard';
import ConfirmationModal from './settings/ConfirmationModal';
import AboutModal from './settings/AboutModal';

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  
  // Modal States
  const [cacheModalOpen, setCacheModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [aboutModal, setAboutModal] = useState({ isOpen: false, title: '', content: '' });

  const handleClearCache = () => {
    setCacheModalOpen(false);
    // Dummy cache clear logic (UI only)
    alert("App cache cleared successfully.");
  };

  const handleResetSettings = () => {
    resetSettings();
    setResetModalOpen(false);
  };

  const openPrivacyPolicy = () => {
    setAboutModal({
      isOpen: true,
      title: 'Privacy Policy',
      content: 'Your privacy is critically important to us. \n\nThis application is a frontend-only demonstration. No user data is collected, stored on external servers, or processed. All settings are saved locally on your device via LocalStorage.'
    });
  };

  const openTerms = () => {
    setAboutModal({
      isOpen: true,
      title: 'Terms & Conditions',
      content: 'By using this application, you agree to have fun testing this React + Tailwind CSS layout. \n\nThis is a mock application provided "as-is" without any warranties.'
    });
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

        {/* 1. Privacy */}
        <SectionHeader title="Privacy" description="Manage your privacy preferences and app security." />
        <SettingRow title="App Lock" description="Require biometric or password to open the app.">
          <ToggleSwitch checked={settings.appLock} onChange={(val) => updateSetting('appLock', val)} />
        </SettingRow>
        <SettingRow title="Hide Sensitive Content" description="Blur media in chats until clicked.">
          <ToggleSwitch checked={settings.hideSensitiveContent} onChange={(val) => updateSetting('hideSensitiveContent', val)} />
        </SettingRow>

        {/* 2. Notifications */}
        <SectionHeader title="Notifications" description="Customize how you receive alerts." />
        <SettingRow title="Enable Notifications" description="Receive push notifications for new messages.">
          <ToggleSwitch checked={settings.enableNotifications} onChange={(val) => updateSetting('enableNotifications', val)} />
        </SettingRow>
        <SettingRow title="Notification Sound" description="Play a sound when a message is received.">
          <ToggleSwitch checked={settings.notificationSound} onChange={(val) => updateSetting('notificationSound', val)} />
        </SettingRow>
        <SettingRow title="Desktop Notifications" description="Show native desktop alerts.">
          <ToggleSwitch checked={settings.desktopNotifications} onChange={(val) => updateSetting('desktopNotifications', val)} />
        </SettingRow>
        <SettingRow title="Message Preview" description="Show message text inside the notification.">
          <ToggleSwitch checked={settings.messagePreview} onChange={(val) => updateSetting('messagePreview', val)} />
        </SettingRow>

        {/* 3. Chat Appearance */}
        <SectionHeader title="Chat Appearance" description="Customize the look and feel of your chats." />
        <SettingRow title="Theme" description="Switch between Light and Dark mode.">
          <ThemeSelector />
        </SettingRow>
        <SettingRow title="Accent Color" description="Choose the primary color for buttons and highlights.">
          <ColorPicker />
        </SettingRow>
        <SettingRow title="Chat Wallpaper" description="Select a background for your chat windows.">
          <WallpaperPicker />
        </SettingRow>
        <SettingRow title="Font Size" description="Adjust the text size in conversations.">
          <FontSizeSelector />
        </SettingRow>
        <SettingRow title="Message Bubble Style" description="Choose how message containers look.">
          <BubbleStyleSelector />
        </SettingRow>
        <SettingRow title="Chat Density" description="Adjust the spacing between messages.">
          <DensitySelector />
        </SettingRow>

        {/* 4. Storage & Data */}
        <SectionHeader title="Storage & Data" description="Manage network usage and local storage." />
        <StorageCard />
        <SettingRow title="Auto-download Media" description="Automatically download photos and videos over Wi-Fi.">
          <ToggleSwitch checked={settings.autoDownloadMedia} onChange={(val) => updateSetting('autoDownloadMedia', val)} />
        </SettingRow>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button onClick={() => setCacheModalOpen(true)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
            Clear Cache
          </button>
          <button onClick={() => setResetModalOpen(true)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors">
            Reset All Settings
          </button>
        </div>

        {/* 5. About */}
        <SectionHeader title="About" description="App information and legal policies." />
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">App Version</span>
            <span className="text-sm font-medium text-gray-500">v2.4.1</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Keyboard Shortcuts</span>
            <span className="text-sm font-medium text-gray-500">Cmd/Ctrl + K</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={openPrivacyPolicy} className="text-sm font-medium text-[var(--accent-color)] hover:underline text-left">Privacy Policy</button>
            <button onClick={openTerms} className="text-sm font-medium text-[var(--accent-color)] hover:underline text-left">Terms & Conditions</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal 
        isOpen={cacheModalOpen} 
        title="Clear Cache" 
        message="Are you sure you want to clear the app cache? This will not delete your messages or settings." 
        confirmText="Clear" 
        onConfirm={handleClearCache} 
        onCancel={() => setCacheModalOpen(false)} 
      />
      <ConfirmationModal 
        isOpen={resetModalOpen} 
        title="Reset Settings" 
        message="This will reset all your personalized settings to their default values. This action cannot be undone." 
        confirmText="Reset" 
        onConfirm={handleResetSettings} 
        onCancel={() => setResetModalOpen(false)} 
      />
      <AboutModal
        isOpen={aboutModal.isOpen}
        title={aboutModal.title}
        content={aboutModal.content}
        onClose={() => setAboutModal({ ...aboutModal, isOpen: false })}
      />
    </div>
  );
};

export default Settings;