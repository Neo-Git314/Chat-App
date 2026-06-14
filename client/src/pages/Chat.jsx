import MessageBubble from "../components/MessageBubble";
import ChatHeader from "../components/Chat_header";
import INPUT_message from "../components/INPUT_message";
import ChatList from "../components/chat_list";
import ChatSidebar from "../components/sidebar";

import { useState } from "react";

import UserProfilePage from "../components/userprofile_page";
import Settings from "../components/settings";














const Chat = () => {
    const [view, setView] = useState("chat");

 return (
   <div className="flex h-screen overflow-hidden">

  <ChatSidebar setView={setView} />

  {view === "chat" && (
    <>
      <ChatList />

      <div className="flex-1 bg-[#130a1e]   flex flex-col  overflow-hidden">
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
    </>
  )}

  {view === "profile" && (
    <div className="flex-1    overflow-y-auto">
      <UserProfilePage />
    </div>
  )}

  {view === "settings" && (
    <div className="flex-1 bg-[#130a1e] p-4    overflow-y-auto">
      <Settings />
    </div>
  )}

</div>

  
  );
};

export default Chat;