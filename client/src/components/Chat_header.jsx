/**
 * ChatHeader.jsx
 *
 * Props:
 *  userName    {string}  – Display name shown in the header.
 *  userAvatar  {string}  – Initials string (e.g. "SC") or a full image URL.
 *  isOnline    {bool}    – When true, shows "Active now"; false shows lastSeen.
 *  lastSeen    {string}  – Fallback status text shown when isOnline is false,
 *                          e.g. "Last seen 2 hours ago".
 *  avatarColor {string}  – Tailwind bg class for the avatar circle.
 *                          Defaults to "bg-purple-500".
 */

import React from "react";

const isUrl = (str) =>
  typeof str === "string" && (str.startsWith("http") || str.startsWith("/"));

export default function ChatHeader({
  userName = "Sara Chen",   
  userAvatar = "SC",
  isOnline = true,
  lastSeen = "Offline",
  avatarColor = "bg-purple-500",
}) {
  return (
    <header
      className="
        relative w-full
        bg-[#1e1840]
        border-t-2 border-[#2d1f4e]
        px-4 py-2.5
        flex items-center gap-3
        shadow-md shadow-black/30
      "
    >
      {/* ── Avatar ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        {isUrl(userAvatar) ? (
          <img
            src={userAvatar}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className={`
              w-9 h-9 rounded-full
              flex items-center justify-center
              text-white text-xs font-bold select-none
              ${avatarColor}
            `}
            aria-label={`Avatar for ${userName}`}
          >
            {userAvatar}
          </div>
        )}
      </div>

      {/* ── Name + Status ────────────────────────────────────────── */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-white text-sm font-semibold leading-tight truncate">
          {userName}
        </span>
        <span
          className={`text-xs leading-tight mt-0.5 truncate ${
            isOnline ? "text-purple-300/70" : "text-slate-500"
          }`}
        >
          {isOnline ? "Active now" : lastSeen}
        </span>
      </div>
    </header>
  );
}
