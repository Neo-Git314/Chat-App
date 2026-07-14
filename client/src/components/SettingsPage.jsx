// SettingsPage.jsx
import Settings from "./Settings";

export default function SettingsPage({ onLogout }) {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Page title */}
        <p className="text-text-muted text-sm font-medium mb-5 tracking-wide">
          Account Settings
        </p>

        {/* Settings Layout */}
        <Settings onLogout={onLogout} />
      </div>
    </div>
  );
}