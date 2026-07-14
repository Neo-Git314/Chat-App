import React from 'react';

export default function ChatItem({
  name,
  message,
  time,
  avatar,
  avatarColor,
  isOnline,
  isSelected,
  onClick = () => {}
}) {
  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-accent/20 border border-primary/40 shadow-sm'
          : 'border border-transparent hover:bg-surface-secondary'
      }`}
    >
      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarColor}`}
        >
          {avatar}
        </div>

        {/* Online/Offline Status Dot */}
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
            isSelected
              ? 'border-[#F3E4CE]'
              : 'border-surface group-hover:border-surface-secondary'
          } ${
            isOnline
              ? 'bg-success'
              : 'bg-text-muted'
          }`}
        />
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-baseline mb-0.5 gap-2">
          <h3 className="text-text-primary font-semibold text-sm truncate">
            {name}
          </h3>
          <span className="text-text-muted text-xs flex-shrink-0">
            {time}
          </span>
        </div>
        <p className="text-text-secondary text-sm truncate">
          {message}
        </p>
      </div>
    </div>
  );
}
