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
    <div className="w-[340px] bg-[#0f0a1a] border-r border-[#2d1f4e] p-4 overflow-y-auto">
      <p className="text-[#6b5a8a] text-xs font-bold uppercase tracking-wider mb-3">
        Contacts
      </p>
      <div className="mb-5">
        <div className="relative">
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-[#89819e]"
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
              bg-[#392e4a]
              text-white
              text-sm
              rounded-full
              py-2.5
              pl-10
              pr-4
              placeholder-[#89819e]
              focus:outline-none
              focus:ring-1
              focus:ring-[#a379f8]"
          />
        </div>
      </div>
      {filteredUsers.length === 0 && (
        <p className="text-[#6b5a8a] text-xs italic">
          No users found. Try searching for a different name.
        </p>
      )}
      {filteredUsers.map((u) => (
        <div
          key={u.uid}
          onClick={() => onSelectUser(u)}
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#1a1133] cursor-pointer mb-1"
        >
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {u.displayName ? u.displayName[0] : u.email[0]}
          </div>
          <span className="text-white text-sm truncate">{u.displayName}</span>
        </div>
      ))}
    </div>
  );
}
