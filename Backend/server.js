const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');           // ← Added
const { Server } = require("socket.io");

const connectDB = require('./config/db');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const app = express();

// Create HTTP Server (Required for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: ["https://enqury-form-ss.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io globally accessible
global.io = io;

// Middleware
app.use(cors({
    origin: ["https://enqury-form-ss.vercel.app", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/chat-leads', require('./routes/chatLeadRoutes'));

// Health Check
app.get('/', (req, res) => {
    res.send('Enquiry Backend is running...');
});

// Socket Connection
io.on("connection", (socket) => {
    console.log(`✅ User Connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Socket.io is ready`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();