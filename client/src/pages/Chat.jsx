import { useState, useEffect } from "react";
import axios from "axios";

import MessageBubble from "../components/MessageBubble";
import ChatHeader from "../components/ChatHeader";
import InputMessage from "../components/InputMessage";
import ChatList from "../components/ChatList";
import ChatSidebar from "../components/Sidebar";
import UserProfilePage from "../components/UserProfile";
import Settings from "../components/Settings";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const API_URL = "http://localhost:5000";

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("chat");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const otherUsers = res.data.filter(
          (user) => user.uid !== currentUser.uid,
        );
        setUsers(otherUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("message:receive", handleReceiveMessage);

    return () => {
      socket.off("message:receive", handleReceiveMessage);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (userId) => {
      setOnlineUserIds((prev) => [...prev, userId]);
    };

    const handleUserOffline = (userId) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
    };

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [socket]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const token = await currentUser.getIdToken();
      const res = await axios.post(
        `${API_URL}/api/conversations`,
        {
          participantId: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setConversationId(res.data._id);

      const msgRes = await axios.get(
        `${API_URL}/api/messages/${res.data._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessages(msgRes.data);
    } catch (error) {
      console.error("Error selecting user:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!socket || !messageText.trim() || !conversationId || !selectedUser)
      return;

    const messageData = {
      conversationId,
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      content: messageText,
      type: "text",
    };

    socket.emit("message:send", messageData);

    setMessages((prev) => [...prev, { ...messageData, timestamp: new Date() }]);
    setMessageText("");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const chatListUsers = users.map((u) => ({
    id: u.uid,
    name: u.displayName,
    message: "Hey there! I'm using ChatApp.",
    time: "",
    initials: u.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    color: "#4a5568",
    isOnline: onlineUserIds.includes(u.uid),
    raw: u,
  }));

  const onlineUsersStrip = chatListUsers
    .filter((u) => u.isOnline)
    .map((u) => ({
      id: u.id,
      name: u.name,
      initials: u.initials,
      isOnline: true,
      color: u.color,
      avatar: u.initials,
    }));

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar setView={setView} onLogout={handleLogout} />

      {view === "chat" && (
        <>
          <ChatList
            users={chatListUsers}
            onlineUsers={onlineUsersStrip}
            onSelectUser={(chatListUser) => handleSelectUser(chatListUser.raw)}
          />

          <div className="flex-1 bg-[#130a1e]   flex flex-col  overflow-hidden">
            {selectedUser ? (
              <>
                <ChatHeader
                  userName={selectedUser.displayName}
                  userAvatar={selectedUser.initials}
                  isOnline={selectedUser.isOnline}
                />

                <div className="flex-1 p-4">
                  {messages.map((msg, i) => (
                    <MessageBubble
                      key={msg.id || i}
                      message={msg.content}
                      isOwn={msg.senderId === currentUser.uid}
                      timestamp={new Date(
                        msg.createdAt || msg.timestamp,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      avatar={selectedUser.initials}
                    />
                  ))}
                </div>
                <InputMessage
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onSend={handleSendMessage}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[#89819e] text-sm">
                  Select a conversation to start chatting
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {view === "profile" && (
        <div className="flex-1    overflow-y-auto">
          <UserProfilePage currentUser={currentUser} onLogout={handleLogout} />
        </div>
      )}

      {view === "settings" && (
        <div className="flex-1 bg-[#130a1e] p-4    overflow-y-auto">
          <Settings onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default Chat;
