// ProfileCard.jsx
// Warm, elevated profile card for ChatFlow
// Props: name, username, email, phone, about, avatar, isOnline, onFieldSave

import { useEffect, useRef, useState } from "react";
import { IoPencilOutline, IoCheckmark, IoClose } from "react-icons/io5";

// ── Avatar color helper ────────────────────────────────────────────────────────
const PALETTE = [
  "#D97745", "#C1584A", "#D89A3D",
  "#A67C52", "#8B9574", "#B5836B",
];
function colorFromName(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

// ── ProfileField — labelled data row, editable when onSave is provided ────────
function ProfileField({
  label,
  value,
  fieldKey,
  onSave,
  type = "text",
  prefix = "",
  emptyValue = "",
}) {
  const stripped = (v) => (v === emptyValue ? "" : v.startsWith(prefix) ? v.slice(prefix.length) : v);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stripped(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(stripped(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setError("");
    setDraft(stripped(value));
    setEditing(true);
  };

  const cancel = () => {
    setError("");
    setDraft(stripped(value));
    setEditing(false);
  };

  const save = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Can't be empty");
      return;
    }
    if (trimmed === stripped(value)) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(fieldKey, trimmed);
      setEditing(false);
    } catch (err) {
      setError(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  };

  return (
    <div className="bg-surface-secondary border border-border rounded-xl px-4 py-3 transition-colors duration-200 hover:border-primary/40 group">
      <div className="flex items-center justify-between mb-1">
        <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest group-hover:text-primary transition-colors duration-200">
          {label}
        </p>
        {onSave && !editing && (
          <button
            type="button"
            onClick={startEdit}
            aria-label={`Edit ${label}`}
            className="text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
          >
            <IoPencilOutline size={13} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-1.5">
          {prefix && <span className="text-text-primary text-sm font-medium">{prefix}</span>}
          <input
            ref={inputRef}
            type={type}
            value={draft}
            disabled={saving}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-transparent text-text-primary text-sm font-medium outline-none border-b border-primary/50 focus:border-primary disabled:opacity-50"
          />
          <button
            type="button"
            onClick={save}
            disabled={saving}
            aria-label="Save"
            className="text-success hover:opacity-80 disabled:opacity-50 shrink-0"
          >
            <IoCheckmark size={16} />
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={saving}
            aria-label="Cancel"
            className="text-text-muted hover:text-danger disabled:opacity-50 shrink-0"
          >
            <IoClose size={16} />
          </button>
        </div>
      ) : (
        <p className="text-text-primary text-sm font-medium truncate">{value}</p>
      )}

      {error && <p className="text-danger text-[11px] mt-1">{error}</p>}
    </div>
  );
}

// ── ProfileCard ───────────────────────────────────────────────────────────────────
export default function ProfileCard({
  name     = "Alex Rivera",
  username = "@alexrivera",
  email    = "alex@email.com",
  phone    = "+1 555 482 991",
  about    = "Available for chatting",
  avatar   = "",
  isOnline = true,
  onFieldSave,
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarBg = colorFromName(name);

  return (
    <aside
      className="
        w-full flex-shrink-0
        bg-surface border border-border rounded-2xl
        p-5 flex flex-col gap-4
        shadow-sm
      "
    >
      {/* Card heading */}
      <div>
        <h2 className="text-text-primary font-bold text-base leading-tight">Profile</h2>
        <p className="text-text-muted text-[11px] mt-0.5">ChatFlow account settings</p>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative">
          <div
            className="
              w-[72px] h-[72px] rounded-full
              flex items-center justify-center
              text-white text-2xl font-bold
              overflow-hidden select-none
              ring-4 ring-surface-secondary shadow-md shadow-primary/20
              transition-transform duration-200 hover:scale-105
            "
            style={{ backgroundColor: avatar ? "transparent" : avatarBg }}
          >
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span
            className={`
              absolute bottom-0.5 right-0.5
              w-4 h-4 rounded-full border-2 border-surface
              transition-colors duration-300
              ${isOnline ? "bg-success" : "bg-text-muted"}
            `}
          />
        </div>
        <div className="text-center">
          <p className="text-text-primary font-semibold text-[15px] leading-tight">{name}</p>
          <p className={`text-xs font-medium mt-1 ${isOnline ? "text-success" : "text-text-muted"}`}>
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Profile fields */}
      <div className="flex flex-col gap-2.5">
        <ProfileField
          label="Username"
          value={username}
          fieldKey="username"
          prefix="@"
          onSave={onFieldSave}
        />
        <ProfileField
          label="Phone"
          value={phone}
          fieldKey="phone"
          type="tel"
          emptyValue="Not set"
          onSave={onFieldSave}
        />
        <ProfileField
          label="About"
          value={about}
          fieldKey="about"
          onSave={onFieldSave}
        />
        <ProfileField
          label="Email"
          value={email}
          fieldKey="email"
          type="email"
          onSave={onFieldSave}
        />
      </div>
    </aside>
  );
}
