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
          ? 'bg-bg-[#4a3a70] border border-[#7c3aed] shadow-[0_0_12px_rgba(124,58,237,0.25)]'
          : 'border border-transparent hover:bg-[#261c33]'
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
              ? 'border-[#3b2f56]' 
              : 'border-[#130a1e] group-hover:border-[#261c33]'
          } ${
            isOnline 
              ? 'bg-[#5cd228]' 
              : 'bg-[#8f82aa]'
          }`}
        />
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-baseline mb-0.5 gap-2">
          <h3 className="text-white font-semibold text-sm truncate">
            {name}
          </h3>
          <span className="text-[#8f82aa] text-xs flex-shrink-0">
            {time}
          </span>
        </div>
        <p className="text-[#a99bbf] text-sm truncate">
          {message}
        </p>
      </div>
    </div>
  );
}