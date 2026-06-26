import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatSidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import InputMessage from "../components/InputMessage";
import UserProfilePage from "../components/UserProfile";
import Settings from "../components/Settings";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import TypingIndicator from "../components/TypingIndicator";

const API_URL = import.meta.env.VITE_API_URL;

const getDateLabel = (date) => {
  const msgDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  } else if (msgDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return msgDate.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-[#24173f]" />
    <span
      className="
                px-3 py-1
                rounded-lg
                bg-[#24173f]
                text-[#b3a3d1]
                text-xs
                font-medium
            "
    >
      {label}
    </span>
    <div className="flex-1 h-px bg-[#24173f]" />
  </div>
);

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const { socket } = useSocket();

  const [view, setView] = useState("chat");
  const [conversations, setConversations] = useState([]); // from GET /api/conversations/:uid
  const [allUsers, setAllUsers] = useState([]); // from GET /api/users — used to start NEW chats
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const authHeader = async () => {
    const token = await currentUser.getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // fetch existing conversations (sidebar list)
  const fetchConversations = async () => {
    try {
      const config = await authHeader();
      const res = await axios.get(
        `${API_URL}/api/conversations/${currentUser.uid}`,
        config,
      );
      console.log("Conversations response:", res.data);
      setConversations(res.data);
    } catch (err) {
      console.log("fetch conversations error:", err.message);
    }
  };

  // fetch all users (for starting a new conversation / search)
  const fetchAllUsers = async () => {
    try {
      const config = await authHeader();
      const res = await axios.get(`${API_URL}/api/users`, config);
      setAllUsers(res.data);
    } catch (err) {
      console.log("fetch users error:", err.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversationId) scrollToBottom();
  }, [messages, conversationId]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;
    setShowScrollDown(!isNearBottom);
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      fetchAllUsers();
    }
  }, [currentUser]);

  // listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);

        if (document.visibilityState === "visible") {
          socket.emit("message:seen", {
            conversationId: message.conversationId,
            userId: currentUser.uid,
            senderId: message.senderId,
          });
        }
      }
      // refresh conversation list so last message preview updates
      fetchConversations();
    };

    socket.on("message:receive", handleReceive);
    return () => socket.off("message:receive", handleReceive);
  }, [socket, conversationId]);

  // Listen for read receipts
  useEffect(() => {
    if (!socket) return;

    const handleSeen = ({ conversationId: seenConvId, userId }) => {
      if (seenConvId === conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.seenBy?.includes(userId)
              ? msg
              : { ...msg, seenBy: [...(msg.seenBy || []), userId] },
          ),
        );
      }
    };

    socket.on("message:seen", handleSeen);
    return () => socket.off("message:seen", handleSeen);
  }, [socket, conversationId]);

  // listen for online/offline status
  useEffect(() => {
    if (!socket) return;

    const handleOnline = (userId) => {
      setOnlineUserIds((prev) => [...new Set([...prev, userId])]);
    };
    const handleOffline = (userId) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== userId));
    };
    const handleOnlineList = (userIds) => {
      setOnlineUserIds(userIds);
    };

    socket.on("user:online", handleOnline);
    socket.on("user:offline", handleOffline);
    socket.on("online:list", handleOnlineList);

    return () => {
      socket.off("user:online", handleOnline);
      socket.off("user:offline", handleOffline);
      socket.off("online:list", handleOnlineList);
    };
  }, [socket]);

  // start or open a conversation with a user (matches Member 2's conversationRoutes.js)
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setIsTyping(false);
    try {
      const config = await authHeader();

      const res = await axios.post(
        `${API_URL}/api/conversations`,
        { participantId: user.uid },
        config,
      );

      setConversationId(res.data._id);

      const msgRes = await axios.get(
        `${API_URL}/api/messages/${res.data._id}`,
        config,
      );
      setMessages(msgRes.data);

      if (socket) {
        socket.emit("message:seen", {
          conversationId: res.data._id,
          userId: currentUser.uid,
          senderId: user.uid,
        });
      }
    } catch (err) {
      console.log("select user error:", err.message);
    }
  };

  // send a message
  const handleSend = () => {
    if (!socket || !conversationId || !selectedUser || !messageText.trim())
      return;

    const tempId = Date.now(); // temporary ID for optimistic UI update

    const messageData = {
      conversationId,
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      content: messageText,
      type: "text",
    };

    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        _id: tempId,
        createdAt: new Date(),
        seenBy: [],
        status: "sent",
      },
    ]);
    setMessageText("");

    socket.emit("message:send", messageData, (res) => {
      if (res?.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId
              ? { ...msg, _id: res.messageId, status: "delivered" }
              : msg,
          ),
        );
      }
    });
  };

  const handleTypingStart = () => {
    if (socket && selectedUser) {
      socket.emit("typing:start", {
        receiverId: selectedUser.uid,
        senderId: currentUser.uid,
      });
    }
  };

  const handleTypingStop = () => {
    if (socket && selectedUser) {
      socket.emit("typing:stop", {
        receiverId: selectedUser.uid,
        senderId: currentUser.uid,
      });
    }
  };

  // Handle typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleTypingStart = (senderId) => {
      if (senderId === selectedUser?.uid) setIsTyping(true);
    };
    const handleTypingStop = (senderId) => {
      if (senderId === selectedUser?.uid) setIsTyping(false);
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, selectedUser]);

  // Handle user logout
  const handleLogout = async () => {
    await logout();
  };

  // build sidebar list from real conversations (includes otherUser + lastMessage from backend)
  const chatListUsers = conversations.map((conv) => {
    const other = conv.otherUser || {};
    return {
      id: conv._id,
      uid: other.uid,
      name: other.displayName || "Unknown",
      initials: other.displayName?.slice(0, 2).toUpperCase() || "??",
      color: "bg-purple-600",
      isOnline: onlineUserIds.includes(other.uid),
      time: conv.lastMessage?.timestamp
        ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      message: conv.lastMessage?.content || "Say hi 👋",
      raw: other,
    };
  });

  const onlineUsersForStrip = chatListUsers
    .filter((u) => u.isOnline)
    .map((u) => ({
      id: u.uid,
      name: u.name,
      initials: u.initials,
      isOnline: true,
      avatar: "",
    }));

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar
        setView={setView}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {view === "chat" && (
        <>
          <ChatList
            users={chatListUsers}
            onlineUsers={onlineUsersForStrip}
            onSelectUser={(chatListUser) => handleSelectUser(chatListUser.raw)}
          />

          {/* TEMPORARY — start new chat list, remove once search/new-chat UI is built */}
          <div className="w-[260px] bg-[#0f0a1a] border-r border-[#2d1f4e] p-4 overflow-y-auto">
            <p className="text-[#6b5a8a] text-xs font-bold uppercase tracking-wider mb-3">
              Start New Chat (temp)
            </p>
            {allUsers.length === 0 && (
              <p className="text-[#6b5a8a] text-xs italic">
                No other users yet — sign up a second account
              </p>
            )}
            {allUsers.map((u) => (
              <div
                key={u.uid}
                onClick={() => handleSelectUser(u)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#1a1133] cursor-pointer mb-1"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                  {u.displayName?.[0]}
                </div>
                <span className="text-white text-sm truncate">
                  {u.displayName}
                </span>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-[#130a1e] flex flex-col overflow-hidden relative">
            {selectedUser ? (
              <>
                <ChatHeader
                  userName={selectedUser.displayName}
                  userAvatar={selectedUser.displayName
                    ?.slice(0, 2)
                    .toUpperCase()}
                  isOnline={onlineUserIds.includes(selectedUser.uid)}
                />
                <div
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 p-4 overflow-y-auto space-y-2"
                >
                  {messages.map((msg, i) => {
                    const currentMsgDate = new Date(
                      msg.createdAt || Date.now(),
                    ).toDateString();

                    const prevMsgDate =
                      i > 0
                        ? new Date(
                            messages[i - 1].createdAt || Date.now(),
                          ).toDateString()
                        : null;

                    const showDateDivider =
                      i === 0 || currentMsgDate !== prevMsgDate;

                    return (
                      <div key={msg._id || i}>
                        {showDateDivider && (
                          <DateDivider
                            label={getDateLabel(msg.createdAt || Date.now())}
                          />
                        )}

                        <MessageBubble
                          message={msg.content}
                          isOwn={msg.senderId === currentUser.uid}
                          status={
                            msg.senderId === currentUser.uid
                              ? msg.seenBy?.includes(selectedUser.uid)
                                ? "read"
                                : msg.status || "delivered"
                              : undefined
                          }
                          timestamp={new Date(
                            msg.createdAt || Date.now(),
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          avatar={selectedUser.displayName?.[0]}
                        />
                      </div>
                    );
                  })}
                  ;
                  <div ref={messagesEndRef} />
                </div>

                {showScrollDown && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute bottom-24 right-6 w-9 h-9 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}

                {isTyping && (
                  <TypingIndicator userName={selectedUser?.displayName} />
                )}
                <InputMessage
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onSend={handleSend}
                  onTypingStart={handleTypingStart}
                  onTypingStop={handleTypingStop}
                  placeholder="Type a message..."
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#6b5a8a] text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </>
      )}

      {view === "profile" && (
        <div className="flex-1 overflow-y-auto">
          <UserProfilePage currentUser={currentUser} onLogout={handleLogout} />
        </div>
      )}

      {view === "settings" && (
        <div className="flex-1 bg-[#130a1e] p-4 overflow-y-auto">
          <Settings onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default Chat;
