// OnlineUserCard.jsx — individual user item for the Online Now strip

// Deterministic warm color per user based on initials
const AVATAR_COLORS = [
  "#D97745", // terracotta (primary)
  "#C1584A", // clay red
  "#D89A3D", // warm amber
  "#A67C52", // toffee brown
  "#8B9574", // muted sage
  "#B5836B", // dusty rose-brown
  "#6B8F87", // muted teal (cool accent, kept soft)
  "#9C7A55", // warm tan
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
            ring-2 ring-border group-hover:ring-primary/50
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
              w-2.5 h-2.5 rounded-full bg-success
              border-2 border-surface
            "
          />
        )}
      </div>

      {/* Name */}
      <span
        className="
          text-[11px] font-medium text-text-secondary
          group-hover:text-text-primary transition-colors duration-200
          max-w-[48px] text-center truncate leading-tight
        "
      >
        {name}
      </span>
    </div>
  );
}
