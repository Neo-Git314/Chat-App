// Settings.jsx
// Full settings panel for ChatFlow — expandable rows, Help & Support with Log Out
import { useState } from "react";

// ── Inline SVG icons ───────────────────────────────────────────────────────────
const ico = {
  width: 16, height: 16, viewBox: "0 0 24 24",
  fill: "none", stroke: "white",
  strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round",
};

const Icons = {
  Shield: () => (
    <svg {...ico}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Bell: () => (
    <svg {...ico}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Palette: () => (
    <svg {...ico}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="8.5"  cy="13.5" r="1.5" />
      <circle cx="15"   cy="9.5"  r="1.5" />
      <circle cx="15"   cy="15"   r="1.5" />
    </svg>
  ),
  Monitor: () => (
    <svg {...ico}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  Database: () => (
    <svg {...ico}>
      <ellipse cx="12" cy="5"  rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Help: () => (
    <svg {...ico}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Logout: () => (
    <svg {...ico} stroke="#ef4444">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};

// ── SettingRow — single expandable row ────────────────────────────────────────
function SettingRow({ icon: Icon, title, subtitle, expandable = false, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
        bg-[#120d26] rounded-xl border transition-all duration-200
        ${open ? "border-[#5b21b6]" : "border-[#2d1f4e] hover:border-[#3d2860]"}
        overflow-hidden
      `}
    >
      {/* Row trigger */}
      <button
        onClick={() => expandable && setOpen((v) => !v)}
        className={`
          w-full flex items-center gap-3.5 px-5 py-4 text-left
          transition-colors duration-150
          ${expandable ? "cursor-pointer" : "cursor-default"}
          ${open ? "bg-[#1a1133]" : "hover:bg-[#160f2a]"}
        `}
      >
        {/* Icon bubble */}
        <div className="w-9 h-9 rounded-full bg-[#5b21b6] flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-900/40">
          <Icon />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">{title}</p>
          {subtitle && (
            <p className="text-[#6b5a8a] text-xs mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>

        {/* Chevron */}
        <span className={`text-[#5c4a7a] transition-transform duration-200 ${open ? "rotate-0" : ""}`}>
          {expandable
            ? (open ? <Icons.ChevronDown /> : <Icons.ChevronDown />)
            : <Icons.ChevronRight />}
        </span>
      </button>

      {/* Expandable content */}
      {expandable && open && (
        <div className="border-t border-[#2d1f4e] animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

// ── SETTINGS_CONFIG — drives all rows declaratively ───────────────────────────
const SETTINGS_CONFIG = [
  {
    id: "privacy",
    icon: Icons.Shield,
    title: "Privacy & Security",
    subtitle: "Blocked contacts and encryption",
    expandable: false,
  },
  {
    id: "notifications",
    icon: Icons.Bell,
    title: "Notifications",
    subtitle: "Message alerts and sounds",
    expandable: false,
  },
  {
    id: "appearance",
    icon: Icons.Palette,
    title: "Chat Appearance",
    subtitle: "Wallpaper and themes",
    expandable: false,
  },
  {
    id: "devices",
    icon: Icons.Monitor,
    title: "Linked Devices",
    subtitle: "Desktop and browser sessions",
    expandable: false,
  },
  {
    id: "storage",
    icon: Icons.Database,
    title: "Storage & Data",
    subtitle: "Media and cache management",
    expandable: false,
  },
  {
    id: "help",
    icon: Icons.Help,
    title: "Help & Support",
    subtitle: null,
    expandable: true,
  },
];

// ── LogoutButton — inside Help & Support expand ────────────────────────────────
function LogoutButton({ onLogout }) {
  return (
    <button
      onClick={onLogout}
      className="
        w-full flex items-center gap-3.5 px-5 py-4
        hover:bg-[#2d0e0e] transition-colors duration-150 group
        text-left
      "
    >
      <div className="w-9 h-9 rounded-full bg-[#3b0d0d] flex items-center justify-center flex-shrink-0 group-hover:bg-[#4c1111] transition-colors duration-150">
        <Icons.Logout />
      </div>
      <div>
        <p className="text-[#ef4444] text-sm font-semibold leading-tight group-hover:text-red-300 transition-colors duration-150">
          Log out
        </p>
        <p className="text-[#6b5a8a] text-xs mt-0.5">Sign out from this device securely</p>
      </div>
    </button>
  );
}

// ── Settings — main export ─────────────────────────────────────────────────────
export default function Settings({ onLogout }) {
  return (
    <section
      className="
        flex-1 bg-[#1a1133] border border-[#2d1f4e] rounded-2xl
        p-6 flex flex-col gap-5
        shadow-xl shadow-black/40
        min-w-0
      "
    >
      {/* Panel header */}
      <div>
        <h2 className="text-white font-bold text-xl leading-tight tracking-tight">Settings</h2>
        <p className="text-[#6b5a8a] text-xs mt-1">Manage your chat application preferences</p>
      </div>

      {/* Settings rows */}
      <div className="flex flex-col gap-3">
        {SETTINGS_CONFIG.map((row) => (
          <SettingRow
            key={row.id}
            icon={row.icon}
            title={row.title}
            subtitle={row.subtitle}
            expandable={row.expandable}
          >
            {/* Help & Support expand content */}
            {row.id === "help" && (
              <LogoutButton onLogout={onLogout} />
            )}
          </SettingRow>
        ))}
      </div>
    </section>
  );
}
