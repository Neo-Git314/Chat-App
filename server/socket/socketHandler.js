const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const onlineUsers = new Set();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User comes Online
    socket.on("user:online", async (userId) => {
      console.log("================================");
      console.log("Socket connected");
      console.log("Socket ID:", socket.id);
      console.log("User ID:", userId);

      socket.userId = userId;
      socket.join(userId);
      onlineUsers.add(userId);

      console.log("Online users:");
      console.log(Array.from(onlineUsers));

      await User.findOneAndUpdate(
        { uid: userId },
        { isOnline: true }
      );

      io.emit("user:online", userId);

      socket.emit("online:list", Array.from(onlineUsers));
      socket.broadcast.emit("online:list", Array.from(onlineUsers));

      console.log("================================");
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
      console.log("================================");
      console.log("Socket disconnected");
      console.log("Socket ID:", socket.id);
      console.log("User ID:", socket.userId);
      console.log("Reason:", reason);
      if (socket.userId) {
        console.log("Online users BEFORE delete:");
        console.log(Array.from(onlineUsers));

        onlineUsers.delete(socket.userId);

        console.log("Online users AFTER delete:");
        console.log(Array.from(onlineUsers));
        await User.findOneAndUpdate({ uid: socket.userId },
          { isOnline: false, lastSeen: Date.now() }
        );

        console.log("Emitting user:offline ->", socket.userId);
        io.emit('user:offline', socket.userId);

        console.log("================================");
      }
    })
  })
}

module.exports = socketHandler;