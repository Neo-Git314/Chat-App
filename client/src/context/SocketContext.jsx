import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.emit("user:online", currentUser.uid);
    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    return () => {
      newSocket.emit("user:offline", currentUser.uid);
      newSocket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io("https://chat-app-r54l.onrender.com", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // emit user:online on initial connect
    newSocket.on("connect", () => {
      newSocket.emit("user:online", currentUser.uid);
    });

    // re-emit user:online on every reconnection too
    newSocket.on("reconnect", () => {
      newSocket.emit("user:online", currentUser.uid);
    });

    return () => {
      newSocket.emit("user:offline", currentUser.uid);
      newSocket.disconnect();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
