export default function TypingIndicator({ userName }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-[#6b5a8a] text-xs">
                {userName} is typing...
            </span>
        </div>
    )
}