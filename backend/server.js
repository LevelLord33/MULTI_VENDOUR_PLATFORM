import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import seedRoutes, { autoSeedDatabaseIfEmpty } from './routes/seedRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { initSocketService } from './socket/socketService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const httpServer = http.createServer(app);
const io = initSocketService(httpServer);
const PORT = process.env.PORT || 5000;

// Helper to sanitize MongoDB URIs with unencoded special characters in passwords
const sanitizeMongoUri = (rawUri) => {
  if (!rawUri) return 'mongodb://127.0.0.1:27017/multi-vendor-platform';
  let uri = rawUri.trim();

  // If password contains unencoded '@' before host '@'
  if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
    const protocol = uri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : 'mongodb://';
    const rest = uri.slice(protocol.length);
    const querySlashIdx = rest.search(/[\/\?]/);
    const userInfoAndHosts = querySlashIdx > -1 ? rest.slice(0, querySlashIdx) : rest;
    const remainder = querySlashIdx > -1 ? rest.slice(querySlashIdx) : '';

    const lastAtIdx = userInfoAndHosts.lastIndexOf('@');
    if (lastAtIdx > -1) {
      const userInfo = userInfoAndHosts.slice(0, lastAtIdx);
      const hosts = userInfoAndHosts.slice(lastAtIdx + 1);

      const colonIdx = userInfo.indexOf(':');
      if (colonIdx > -1) {
        const username = userInfo.slice(0, colonIdx);
        let password = userInfo.slice(colonIdx + 1);
        if (password.includes('@') && !password.includes('%40')) {
          password = password.replaceAll('@', '%40');
        }
        let cleanedHosts = hosts;
        let dbName = '';
        if (cleanedHosts.includes('/vendorhub?,')) {
          cleanedHosts = cleanedHosts.replace('/vendorhub?,', ',');
          dbName = '/vendorhub';
        }
        let cleanedRemainder = remainder;
        if (dbName && !cleanedRemainder.startsWith('/')) {
          cleanedRemainder = dbName + (cleanedRemainder.startsWith('?') ? cleanedRemainder : `?${cleanedRemainder}`);
        }
        uri = `${protocol}${username}:${password}@${cleanedHosts}${cleanedRemainder}`;
      }
    }
  }
  return uri;
};

const MONGODB_URI = sanitizeMongoUri(process.env.MONGODB_URI);

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-id', 'x-user-name']
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Attach Socket.IO instance to Express req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root route - redirect directly to the frontend application
app.get('/', (req, res) => {
  res.redirect('http://localhost:5173');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'VendorHub Multi-Vendor Platform Backend',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cluster: MONGODB_URI.includes('mongodb.net') ? 'MongoDB Atlas Cloud' : 'Local / Custom'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/seed', seedRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Exception:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB Atlas (or fallback)
mongoose.set('bufferCommands', false);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000
  })
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB Atlas database!');
    await autoSeedDatabaseIfEmpty();
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection note:', err.message);
    console.warn('ℹ️ Running in resilient hybrid mode with seed data & local storage fallback active.');
  });

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Vendor Hub Backend Server running on port ${PORT}`);
    console.log(`📍 API endpoints active at http://localhost:${PORT}/api`);
    console.log(`⚡ Real-Time Socket.IO running on port ${PORT}`);
  });
}

export { app, httpServer, io };
export default app;
