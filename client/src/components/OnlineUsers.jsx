// OnlineUsers.jsx — "ONLINE NOW" horizontal strip
import OnlineUserCard from "./OnlineUserCard";

const DEFAULT_USERS = [
  { id: 1, name: "Sarah",  initials: "SC", isOnline: true,  avatar: "" },
  { id: 2, name: "Priya",  initials: "PS", isOnline: true,  avatar: "" },
  { id: 3, name: "Luna",   initials: "LP", isOnline: true,  avatar: "" },
];

export default function OnlineUsers({ onlineUsers = DEFAULT_USERS }) {
  const online = onlineUsers.filter((u) => u.isOnline);

  return (
    <section className="px-4 py-3">
      {/* Section heading */}
      <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-[#5c4a7a] mb-3 select-none">
        Online Now
      </p>

      {/* Horizontal scrollable user row */}
      <div className="flex items-start gap-4 overflow-x-auto scrollbar-none pb-1">
        {online.length > 0 ? (
          online.map((user) => (
            <OnlineUserCard key={user.id} user={user} />
          ))
        ) : (
          <p className="text-[#5c4a7a] text-xs italic">No one online yet</p>
        )}
      </div>
    </section>
  );
}
