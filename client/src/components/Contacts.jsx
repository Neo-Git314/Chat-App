{
  /* Start new chat list */
}
import { useState } from "react";

export default function Contacts({ users, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    (user.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="w-[340px] bg-surface border-r border-border p-4 overflow-y-auto">
      <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-3">
        Contacts
      </p>
      <div className="mb-5">
        <div className="relative">
          <svg
            className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              bg-surface-secondary
              text-text-primary
              text-sm
              rounded-full
              py-2.5
              pl-10
              pr-4
              placeholder-text-muted
              border border-transparent
              focus:outline-none
              focus:ring-2
              focus:ring-primary/30
              focus:border-primary/40
              transition-all"
          />
        </div>
      </div>
      {filteredUsers.length === 0 && (
        <p className="text-text-muted text-xs italic">
          No users found. Try searching for a different name.
        </p>
      )}
      {filteredUsers.map((u) => (
        <div
          key={u.uid}
          onClick={() => onSelectUser(u)}
          className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-surface-secondary cursor-pointer mb-1 transition-colors duration-150"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
            {u.displayName ? u.displayName[0] : u.email[0]}
          </div>
          <span className="text-text-primary text-sm truncate">{u.displayName}</span>
        </div>
      ))}
    </div>
  );
}
