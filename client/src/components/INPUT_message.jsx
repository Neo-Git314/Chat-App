/**
 * InputMessage.jsx
 *
 * Props:
 *  value        {string}   – Controlled input value.
 *  onChange     {fn}       – Called with the native input event on every keystroke.
 *  onSend       {fn}       – Called when send button is clicked or Enter is pressed.
 *  placeholder  {string}   – Input placeholder text. Defaults to "Message...".
 *  disabled     {bool}     – Disables both the input and the send button.
 */

import React from "react";
import { IoSend } from "react-icons/io5";

export default function InputMessage({
  value = "",
  onChange,
  onSend,
  placeholder = "Message...",
  disabled = false,
}) {
  const canSend = !disabled && value.trim().length > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault();
      onSend?.();
    }
  };

  return (
    <div className="w-full bg-[#120f1e] px-4 py-3 flex items-center gap-3">
      {/* ── Pill input ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center bg-[#2b1f4e] rounded-full px-4 py-2.5 shadow-inner">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Message input"
          className="
            flex-1 bg-transparent
            text-slate-200 text-sm
            placeholder-slate-500
            outline-none border-none
            disabled:opacity-50 disabled:cursor-not-allowed
            caret-violet-400
          "
        />
      </div>

      {/* ── Send button ───────────────────────────────────────────── */}
      <button
        onClick={() => canSend && onSend?.()}
        disabled={!canSend}
        aria-label="Send message"
        className="
          flex-shrink-0
          w-10 h-10 rounded-full
          bg-violet-600 hover:bg-violet-500
          active:scale-95
          flex items-center justify-center
          text-white
          shadow-lg shadow-violet-900/50
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          disabled:hover:bg-violet-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
        "
      >
        <IoSend className="w-4 h-4 translate-x-px" />
      </button>
    </div>
  );
}
