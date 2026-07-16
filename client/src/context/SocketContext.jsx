import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      newSocket.emit("user:online", currentUser.uid);
    });

    // newSocket.on("reconnect", () => {
    //   console.log("Reconnected");
    //   newSocket.emit("user:online", currentUser.uid);
    // });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
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
