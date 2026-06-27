import { useState } from "react";

const NAV_ITEMS = [
  {
    id: "chats",
    label: "Chats",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChatFlowLogo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 shrink-0">
    <rect width="32" height="32" rx="10" fill="#7C3AED" />
    <path
      d="M8 10C8 9.44772 8.44772 9 9 9H23C23.5523 9 24 9.44772 24 10V19C24 19.5523 23.5523 20 23 20H13L9 23.5V20H9C8.44772 20 8 19.5523 8 19V10Z"
      fill="white"
      fillOpacity="0.9"
    />
    <circle cx="12" cy="14.5" r="1.5" fill="#7C3AED" />
    <circle cx="16" cy="14.5" r="1.5" fill="#7C3AED" />
    <circle cx="20" cy="14.5" r="1.5" fill="#7C3AED" />
  </svg>
);

export default function ChatSidebar({
  view,
  setView,
  onLogout,
  currentUser,
  chatCount,
}) {
  // const [active, setActive] = useState("chats");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
          relative flex flex-col h-screen
         bg-[#130a1e] border-r border-[#2d1f4e]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-18" : "w-55"}
          border-r border-[#2d1f4e] shadow-2xl shadow-black/40
          shrink-0
        `}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-5">
        <ChatFlowLogo />
        <span
          className={`
              text-white font-semibold text-lg tracking-tight
              transition-all duration-300 overflow-hidden whitespace-nowrap
              ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
            `}
        >
          ChatFlow
        </span>
      </div>

      {/* Divider */}
      <div className="mx-3 mb-4 border-t border-[#2d1f4e]" />

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            (item.id === "chats" && view === "chat") ||
            (item.id === "contacts" && view === "contacts") ||
            (item.id === "profile" && view === "profile") ||
            (item.id === "settings" && view === "settings");
          return (
            <button
              key={item.id}
              onClick={() => {

                if (item.id === "chats") {
                  setView("chat");
                }

                if (item.id === "contacts") {
                  setView("contacts");
                }

                if (item.id === "profile") {
                  setView("profile");
                }

                if (item.id === "settings") {
                  setView("settings");
                }
              }}
              title={collapsed ? item.label : undefined}
              className={`
                  group flex items-center gap-3 w-full
                  px-3 py-2.5 rounded-xl
                  transition-all duration-200 ease-out
                  text-left relative overflow-hidden cursor-pointer
                  ${
                    isActive
                      ? "bg-[#5b21b6] text-white shadow-lg shadow-purple-900/40"
                      : "text-[#9d8cbf] hover:bg-[#261a40] hover:text-white"
                  }
                `}
            >
              {/* Active glow strip */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[#a78bfa]" />
              )}

              {/* Icon */}
              <span
                className={`
                    shrink-0 transition-transform duration-200
                    ${isActive ? "text-white" : "text-[#7c5cbf] group-hover:text-[#c4b5fd]"}
                    group-hover:scale-110
                  `}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span
                className={`
                    text-sm font-medium overflow-hidden whitespace-nowrap
                    transition-all duration-300
                    ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                  `}
              >
                {item.label}
              </span>

              {/* Badge example for Chats */}
              {item.id === "chats" && !collapsed && (
                <span className="ml-auto text-[10px] font-semibold bg-[#7c3aed] text-white rounded-full px-1.5 py-0.5 leading-none">
                  {chatCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle button */}
      <div className="px-3 mb-3">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="
              flex items-center justify-center w-full py-2 rounded-xl
              text-[#7c5cbf] hover:text-white hover:bg-[#261a40]
              transition-all duration-200 cursor-pointer
            "
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {!collapsed && (
            <span className="ml-2 text-xs font-medium">Collapse</span>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 mb-3 border-t border-[#2d1f4e]" />

      {/* User avatar + logout */}
      <div className="px-3 pb-5 flex flex-col gap-2">
        {/* User row */}
        <div
          className={`
              flex items-center gap-3 px-2 py-2 rounded-xl
              ${collapsed ? "justify-center" : ""}
            `}
        >
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-xs font-semibold">
              {currentUser?.displayName?.slice(0, 2).toUpperCase() || "U"}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#1a1133]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold leading-tight truncate">
                {currentUser?.displayName || "User"}
              </p>
              <p className="text-[#7c5cbf] text-[10px] leading-tight">Online</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="
              group flex items-center gap-3 w-full
              px-3 py-2.5 rounded-xl
              text-[#9d8cbf] hover:bg-[#3b0d0d] hover:text-red-400
              transition-all duration-200
            "
          title={collapsed ? "Log out" : undefined}
        >
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            <LogoutIcon />
          </span>
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">
              Log out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
