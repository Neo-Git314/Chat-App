import React, { useState } from "react";
import ChatItem from "./ChatItem";
import OnlineUsers from "./OnlineUsers";

// --- Main ChatList Component ---

export default function ChatList({
  users = [],
  onlineUsers = [],
  onSelectUser = () => {},
  onNewChat = () => {},
}) {
  const [selectedId, setSelectedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-[340px] h-screen bg-surface border-r border-border flex flex-col font-sans z-10">
      {/* Header */}
      <div className="p-5 pb-4 flex items-center gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 text-primary"
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          <circle cx="8" cy="10" r="1.5" fill="#fff" />
          <circle cx="12" cy="10" r="1.5" fill="#fff" />
          <circle cx="16" cy="10" r="1.5" fill="#fff" />
        </svg>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">ChatFlow</h1>
      </div>

      {/* Search Bar */}
      <div className="px-5 pb-5">
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
            placeholder="Will implement search soon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-secondary text-text-primary text-sm rounded-full py-2.5 pl-10 pr-4 placeholder-text-muted border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      <OnlineUsers onlineUsers={onlineUsers} />

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-5 py-2">
          <h2 className="text-text-muted text-xs font-bold uppercase tracking-wider mb-2">
            Messages
          </h2>
        </div>

        <div className="flex flex-col px-2 gap-1 pb-4">
          {users.map((chat) => (
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
                (setSelectedId(chat.id), onSelectUser(chat));
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
        bg-primary
        hover:bg-primary-hover
        text-white
        text-sm
        font-medium
        rounded-full
        px-5
        py-3
        shadow-lg
        shadow-primary/25
        hover:-translate-y-0.5
        transition-all
        duration-200
        cursor-pointer"
      >
        + New Chat
      </button>

      {/* Global styles for custom scrollbar to match the design */}
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
          background: #E8DDD4;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D9C9B8;
        }
      `,
        }}
      />
    </div>
  );
}
