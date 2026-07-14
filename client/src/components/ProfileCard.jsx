// UserCard.jsx
// Dark glassmorphism-style profile card for ChatFlow
// Props: name, username, email, phone, about, avatar, isOnline

// ── Avatar color helper ────────────────────────────────────────────────────────
const PALETTE = [
  "#7c3aed", "#6d28d9", "#4f46e5",
  "#0891b2", "#059669", "#d97706",
];
function colorFromName(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

// ── ProfileField — labelled data row ──────────────────────────────────────────
function ProfileField({ label, value }) {
  return (
    <div className="bg-[#120d26] border border-[#2d1f4e] rounded-xl px-4 py-3 transition-colors duration-200 hover:border-[#5b21b6] group">
      <p className="text-[#7c5cbf] text-[10px] font-semibold uppercase tracking-widest mb-1 group-hover:text-[#a78bfa] transition-colors duration-200">
        {label}
      </p>
      <p className="text-white text-sm font-medium truncate">{value}</p>
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
  editable = false,
  onEdit   = () => {},
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
        w-full
        bg-[#1a1133] border border-[#2d1f4e] rounded-2xl
        p-5 flex flex-col gap-4
        shadow-xl shadow-black/40
      "
    >
      {/* Card heading */}
      <div>
        <h2 className="text-white font-bold text-base leading-tight">Profile</h2>
        <p className="text-[#6b5a8a] text-[11px] mt-0.5">ChatFlow account settings</p>
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
              ring-4 ring-[#2d1f4e] shadow-lg shadow-purple-900/40
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
              w-4 h-4 rounded-full border-2 border-[#1a1133]
              transition-colors duration-300
              ${isOnline ? "bg-emerald-400" : "bg-[#6b7280]"}
            `}
          />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-[15px] leading-tight">{name}</p>
          <p className={`text-xs font-medium mt-1 ${isOnline ? "text-emerald-400" : "text-[#6b7280]"}`}>
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      {/* Profile fields */}
      <div className="flex flex-col gap-2.5">
        <ProfileField label="Username" value={username} />
        <ProfileField label="Phone"    value={phone}    />
        <ProfileField label="About"    value={about}    />
        <ProfileField label="Email"    value={email}    />
      </div>
      {editable && (
      <button
        onClick={onEdit}
        className="
          mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg
          transition-colors duration-200
        "
      >
        Edit Profile
      </button>
    )}
    </aside>
  );
}
