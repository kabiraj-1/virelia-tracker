const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Temporary fix to confirm CORS is the issue
app.use(cors({
  origin: '*', // Allows ALL origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.io configuration for production
const io = socketIo(server, {
  cors: {
    origin: [
      "https://virelia-tracker-frontend.vercel.app",  // NEW DOMAIN
      "https://virelia-tracker-frontend-oipev2u8i-kabiraj-1s-projects.vercel.app",   
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    "https://virelia-tracker-frontend.vercel.app",  // NEW DOMAIN
    "https://virelia-tracker-frontend-oipev2u8i-kabiraj-1s-projects.vercel.app",     
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// ... rest of your routes
