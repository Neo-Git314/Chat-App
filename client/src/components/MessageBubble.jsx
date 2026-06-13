/**
 * MessageBubble.jsx
 *
 * A single reusable chat message bubble.
 *
 * Props:
 *  message    {string}  – The message text. Pass empty string or undefined for a skeleton bubble.
 *  isOwn      {bool}    – true = sent (right, violet); false = received (left, dark indigo).
 *  timestamp  {string}  – Display time string, e.g. "3:29 PM".
 *  status     {string}  – "read" | "delivered" | "sent"  (only visible on own messages).
 *  avatar     {string}  – Initials shown on received bubbles, e.g. "SC".
 *  avatarColor{string}  – Tailwind bg class for the avatar circle, e.g. "bg-purple-500".
 *  senderName {string}  – (optional) displayed above received bubble when needed.
 */

const StatusIndicator = ({ status }) => {
  const isRead = status === "read";
  const isDelivered = status === "delivered";
  const colorClass = isRead ? "text-violet-400" : "text-slate-500";

  if (!status) return null;

  return (
    <span className={`text-[10px] leading-none ml-0.5 ${colorClass}`}>
      {isDelivered || isRead ? "✓✓" : "✓"}
    </span>
  );
};

const Avatar = ({ initials, colorClass = "bg-purple-500" }) => (
  <div
    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                text-[11px] font-bold text-white select-none ${colorClass}`}
    aria-label={`Avatar for ${initials}`}
  >
    {initials}
  </div>
);

const SkeletonBubble = ({ isOwn }) => (
    
  <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
    <div
      className={`h-9 rounded-2xl animate-pulse
        ${isOwn
          ? "w-36 bg-violet-700/40 rounded-br-sm"
          : "w-44 bg-[#2b1f4e]/70 rounded-bl-sm"
        }`}
    />
  </div>
);

export default function MessageBubble({
  message,
  isOwn = false,
  timestamp,
  status,
  avatar,
  avatarColor = "bg-purple-500",
  senderName,
}) {
  const isEmpty = !message || message.trim() === "";

  if (isEmpty) {
    return <SkeletonBubble isOwn={isOwn} />;
  }

  /* ── Sent (own) ─────────────────────────────────────────────── */
  if (isOwn) {
    return (
      <div className="flex justify-end w-full">
        <div className="flex flex-col items-end max-w-[65%]">
          {/* Bubble */}
          <div
            className="bg-violet-600 text-white text-sm leading-snug
                       px-4 py-2.5 rounded-2xl rounded-br-sm
                       shadow-md shadow-violet-900/30 break-words"
          >
            {message}
          </div>

          {/* Meta row */}
          {(timestamp || status) && (
            <div className="flex items-center gap-0.5 mt-1 px-0.5">
              {timestamp && (
                <time className="text-[10px] text-slate-500 leading-none">
                  {timestamp}
                </time>
              )}
              <StatusIndicator status={status} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Received ────────────────────────────────────────────────── */
  return (
    <div className="flex justify-start items-end gap-2 w-full">
      {/* Avatar or spacer */}
      {avatar ? (
        <Avatar initials={avatar} colorClass={avatarColor} />
      ) : (
        <div className="w-8 flex-shrink-0" aria-hidden="true" />
      )}

      <div className="flex flex-col items-start max-w-[65%]">
        {/* Optional sender name */}
        {senderName && (
          <span className="text-[11px] text-violet-300 font-medium mb-0.5 px-1">
            {senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className="bg-[#2b1f4e] text-slate-200 text-sm leading-snug
                     px-4 py-2.5 rounded-2xl rounded-bl-sm
                     shadow break-words"
        >
          {message}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <time className="text-[10px] text-slate-600 mt-1 px-0.5 leading-none">
            {timestamp}
          </time>
        )}
      </div>
    </div>
  );
}
