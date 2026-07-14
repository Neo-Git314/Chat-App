import React, { useState } from "react";
import ChatItem from "./ChatItem";
import OnlineUsers from "./OnlineUsers";

// --- Mock Data ---
// const ONLINE_USERS = [
//   {
//     id: 1,
//     name: "Sarah",
//     initials: "SC",
//     color: "bg-[#d93fa5]",
//     isOnline: true,
//   },
//   { id: 2, name: "Priya", initials: "PS", color: "bg-[#38b196]" },
//   { id: 3, name: "Luna", initials: "LP", color: "bg-[#5cd228]" },
// ];

// const CHAT_HISTORY = [
//   {
//     id: 1,
//     name: "Sarah Chen",
//     initials: "SC",
//     color: "bg-[#d93fa5]",
//     isOnline: true,
//     time: "3:29PM",
//     message: "No rush , just whenever you get a change 🙏",
//   },
//   {
//     id: 2,
//     name: "Marcus",
//     initials: "MT",
//     color: "bg-[#89819e]",
//     isOnline: false,
//     time: "1:01PM",
//     message: "you: yo wassup😁",
//   },
//   {
//     id: 3,
//     name: "Priya Sharma",
//     initials: "PS",
//     color: "bg-[#38b196]",
//     isOnline: false,
//     time: "3:31PM",
//     message: "listen , i know the alphabet , crazy ik but ...",
//   },
//   {
//     id: 4,
//     name: "james wond",
//     initials: "JW",
//     color: "bg-[#f7b600]",
//     isOnline: false,
//     time: "11:41AM",
//     message: "you: i watched that movie and ..",
//   },
//   {
//     id: 5,
//     name: "Luna Park",
//     initials: "LP",
//     color: "bg-[#5cd228]",
//     isOnline: false,
//     time: "3:36PM",
//     message: "i parked my car in your house and i think that ...",
//   },
// ];

// --- Reusable Components ---

const StatusDot = ({ isOnline, className = "" }) => (
  <div
    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#130a1e] ${isOnline ? "bg-[#5cd228]" : "bg-[#6b627d]"} ${className}`}
  ></div>
);

const Avatar = ({ initials, color, isOnline, size = "w-10 h-10" }) => (
  <div className="relative">
    <div
      className={`${size} ${color} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
    >
      {initials}
    </div>
    <StatusDot isOnline={isOnline} />
  </div>
);

// --- Main ChatList Component ---

export default function ChatList({
  users = [],
  onlineUsers = [],
  onSelectUser = () => {},
  onNewChat = () => {},
}) {
  const [selectedId, setSelectedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
  
    return (
      (user.name || "").toLowerCase().includes(query) ||
      (user.message || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative w-[340px] h-screen bg-[#130a1e] flex flex-col font-sans -ml-2 z-10">
      {/* Header */}
      <div className="p-5 pb-4 flex items-center gap-3 text-white">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8 text-[#a379f8]"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          <circle cx="8" cy="10" r="1.5" fill="#fff" />
          <circle cx="12" cy="10" r="1.5" fill="#fff" />
          <circle cx="16" cy="10" r="1.5" fill="#fff" />
        </svg>
        <h1 className="text-xl font-bold tracking-wide">ChatFlow</h1>
      </div>

      {/* Search Bar */}
      <div className="px-5 pb-6">
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
            placeholder="Search Users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#392e4a] text-white text-sm rounded-full py-2.5 pl-10 pr-4 placeholder-[#89819e] focus:outline-none focus:ring-1 focus:ring-[#a379f8] transition-all"
          />
        </div>
      </div>

      <OnlineUsers onlineUsers={onlineUsers} />

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-5 py-2">
          <h2 className="text-[#89819e] text-xs font-bold uppercase tracking-wider mb-2">
            Messages
          </h2>
        </div>

        <div className="flex flex-col px-2 gap-1 pb-4">
          {filteredUsers.map((chat) => (
            <ChatItem
              key={chat.id}
              name={chat.name}
              message={chat.message}
              time={chat.time}
              avatar={chat.initials}
              avatarColor={chat.color}
              isOnline={chat.isOnline}
              isSelected={selectedId === chat.id}
              onClick={() => {
                  setSelectedId(chat.id);
                  onSelectUser(chat);
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="
        absolute
        bottom-6
        right-6
        bg-purple-600
        hover:bg-purple-500
        text-white
        rounded-full
        px-5
        py-3
        shadow-xl
        transition-all
        cursor-pointer"
      >
        + New Chat
      </button>

      {/* Global styles for custom scrollbar to match the sleek design */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #392e4a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #55486d;
        }
      `,
        }}
      />
    </div>
  );
}
