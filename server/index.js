const express = require('express')
const http = require('http')
const { Server } = require('socket.io');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const { initializeApp, cert }= require('firebase-admin/app');
const socketHandler = require('./socket/socketHandler');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes')
const conversationRoutes = require('./routes/conversationRoutes');
const mongoose = require('mongoose');


dotenv.config();

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app-eight-livid-12.vercel.app"
    ],
    headers: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true
  }
})

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://chat-app-eight-livid-12.vercel.app"
  ],
  headers: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH"],
  credentials: true
}));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes); 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
socketHandler(io);

server.listen(PORT, () => {
  setInterval(() => {
    fetch('https://chat-app-r541.onrender.com/')
      .then(() => console.log('Pinged self!'))
      .catch(() => console.log('Self ping failed.'));
  }, 1000 * 60 * 10);
});