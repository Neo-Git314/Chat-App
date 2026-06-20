const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    // User comes Online
    socket.on('user:online', async (userId) => {
      socket.userId = userId;
      socket.join(userId);
      await User.findOneAndUpdate({ uid: userId }, { isOnline :true });
      io.emit('user:online', userId);
    })

    // Handling Message Sending
    socket.on('message:send', async (data) => {
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
      } catch (err) {
        console.log('message:send error:', err);
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
    socket.on('disconnect', async () => {
      if (socket.userId) {
        await User.findOneAndUpdate({ uid: socket.userId }, 
          { isOnline: false, lastSeen: Date.now() }
        );
        io.emit('user:offline', socket.userId);
      }
    })
  })
}

module.exports = socketHandler;