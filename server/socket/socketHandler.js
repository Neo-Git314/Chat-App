const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User comes Online
    socket.on("user:online", (userId) => {
      socket.userId = userId;
      socket.join(userId);

      const isFirstConnection = !onlineUsers.has(userId);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);

      if (isFirstConnection) {
        io.emit("user:online", userId);
      }

      socket.emit("online:list", Array.from(onlineUsers.keys()));
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
    socket.on("disconnect", async () => {
      const userId = socket.userId;
      if (!userId) return;

      const sockets = onlineUsers.get(userId);

      if (sockets) {
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          await User.findOneAndUpdate(
            { uid: userId },
            { isOnline: false, lastSeen: Date.now() }
          );

          io.emit("user:offline", userId);
        }
      }
    })
  })
}

module.exports = socketHandler;
