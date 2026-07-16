const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User comes Online
    socket.on("user:online", async (userId) => {
      socket.userId = userId;
      socket.join(userId);

      // Get socket set for this user
      let sockets = onlineUsers.get(userId);

      // Is this the user's first active connection?
      const firstConnection = !sockets;

      if (!sockets) {
        sockets = new Set();
        onlineUsers.set(userId, sockets);
      }

      // Add current socket
      sockets.add(socket.id);

      console.log("Online users:");
      console.log(
        [...onlineUsers.entries()].map(([uid, socketSet]) => ({
          uid,
          sockets: [...socketSet],
        }))
      );

      // Only emit online if this is the first socket
      if (firstConnection) {
        try {
          await User.findOneAndUpdate(
            { uid: userId },
            { isOnline: true }
          );

          io.emit("user:online", userId);
        } catch (err) {
          console.error("Error updating user status:", err);
        }
      }

      // Send online list to this client
      socket.emit(
        "online:list",
        [...onlineUsers.keys()]
      );

      // console.log("================================");
    });

    // Handling Message Sending
    socket.on('message:send', async (data, callback) => {
      const { conversationId, senderId, receiverId, content, type } = data;

      try {
        const message = await Message.create({ conversationId, senderId, content, type });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            content,
            senderId,
            type,
            timestamp: message.createdAt || new Date(),
          },
        });
        io.to(receiverId).emit('message:receive', message);

        if (callback) callback({ success: true, messageId: message._id });
      } catch (err) {
        console.log('message:send error:', err);
        if (callback) callback({ success: false, error: 'Failed to send message' });
      }
    })

    // Typing Indicator
    socket.on('typing:start', data => {
      socket.to(data.receiverId).emit('typing:start', data.senderId);
    })

    socket.on('typing:stop', data => {
      socket.to(data.receiverId).emit('typing:stop', data.senderId);
    })

    // Read Receipts
    socket.on('message:seen', async (data) => {
      const { conversationId, userId, senderId } = data;

      try {
        await Message.updateMany({ conversationId, seenBy: { $ne: userId } }, { $push: { seenBy: userId } });

        io.to(senderId).emit('message:seen', { conversationId, userId });
      } catch (err) {
        console.log('message:seen error:', err);
      }
    })

    // User goes Offline
    socket.on('disconnect', async (reason) => {
      if (socket.userId) {
        const sockets = onlineUsers.get(socket.userId);

        if (sockets) {
          // Remove only this socket
          sockets.delete(socket.id);

          console.log(
            `Remaining sockets for ${socket.userId}:`,
            [...sockets]
          );

          // User still has another active socket
          if (sockets.size > 0) {
            return;
          }

          // Last socket disconnected
          onlineUsers.delete(socket.userId);

          await User.findOneAndUpdate(
            { uid: socket.userId },
            {
              isOnline: false,
              lastSeen: new Date(),
            }
          );

          io.emit("user:offline", socket.userId);
        }
      }
    })
  })
}

module.exports = socketHandler;