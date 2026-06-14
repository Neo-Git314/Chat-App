// OnlineUserCard.jsx — individual user item for the Online Now strip

// Deterministic color per user based on initials
const AVATAR_COLORS = [
  "#7c3aed", // violet
  "#6d28d9", // purple
  "#4f46e5", // indigo
  "#0891b2", // cyan
  "#059669", // emerald
  "#d97706", // amber
  "#dc2626", // red
  "#db2777", // pink
];

function colorFromInitials(initials = "") {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function OnlineUserCard({ user }) {
  const { name, avatar, initials = "?", isOnline = false } = user;
  const bgColor = colorFromInitials(initials);

  return (
    <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
      {/* Avatar wrapper */}
      <div className="relative">
        <div
          className="
            w-11 h-11 rounded-full overflow-hidden flex items-center justify-center
            text-white text-sm font-semibold select-none flex-shrink-0
            transition-transform duration-200 group-hover:scale-110
            ring-2 ring-[#2d1f4e] group-hover:ring-[#5b21b6]
          "
          style={{ backgroundColor: bgColor }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {/* Online dot */}
        {isOnline && (
          <span
            className="
              absolute bottom-0 right-0
              w-2.5 h-2.5 rounded-full bg-emerald-400
              border-2 border-[#1a1133]
            "
          />
        )}
      </div>

      {/* Name */}
      <span
        className="
          text-[11px] font-medium text-[#9d8cbf]
          group-hover:text-white transition-colors duration-200
          max-w-[48px] text-center truncate leading-tight
        "
      >
        {name}
      </span>
    </div>
  );
}
