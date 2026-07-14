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
import { useRef } from "react";
import { IoSend } from "react-icons/io5";

export default function InputMessage({
  value = "",
  onChange,
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = "Message...",
  disabled = false,
}) {
  const canSend = !disabled && value.trim().length > 0;

  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    onChange?.(e);
    if (onTypingStart) onTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) onTypingStop();
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault();
      onSend?.();
    }
  };

  return (
    <div className="w-full bg-surface border-t border-border px-4 py-3 flex items-center gap-3">
      {/* ── Pill input ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center bg-surface-secondary rounded-full px-4 py-2.5 border border-transparent focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Message input"
          className="
            flex-1 bg-transparent
            text-text-primary text-sm
            placeholder-text-muted
            outline-none border-none
            disabled:opacity-50 disabled:cursor-not-allowed
            caret-primary
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
          bg-primary hover:bg-primary-hover
          active:scale-95
          flex items-center justify-center
          text-white
          shadow-md shadow-primary/25
          hover:-translate-y-0.5
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
          disabled:hover:bg-primary
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        "
      >
        <IoSend className="w-4 h-4 translate-x-px" />
      </button>
    </div>
  );
}
