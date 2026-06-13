import MessageBubble from "../components/MessageBubble";
import ChatHeader from "../components/Chat_header";
import INPUT_message from "../components/INPUT_message";
const Chat = () => {
 return (
  <div className="bg-slate-900 min-h-screen flex flex-col">
    <ChatHeader
      userName="Sara Chen"
      userAvatar="SC"
      isOnline={true}
    />

    <div className="flex-1 p-4">
      <MessageBubble
        message="Hello!"
        isOwn={false}
        timestamp="10:30 PM"
        avatar="SC"
      />

      <MessageBubble
        message="Hi there!"
        isOwn={true}
        timestamp="10:31 PM"
        status="read"
      />
    </div>

    <INPUT_message />
  </div>
);
};

export default Chat;