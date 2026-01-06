import dotenv from 'dotenv';

dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from "express";
import helmet from 'helmet';

import qrRouter from './qr-codes/qrcodes.router';
import userRouter from './users/users.router';
import mongoose from 'mongoose';

const {
  PORT,
  MONGO_URI,
  NODE_ENV,
  DEV_FRONTEND_URL,
  PROD_FRONTEND_URL,
  PROD_PUBLIC_URL  // Public URL via nginx (e.g., http://57.128.218.53:8080)
} = process.env;

// Determine environment-specific URLs
const isDevelopment = NODE_ENV === 'development';

// Allowed origins for CORS - whitelist of trusted sources only
const allowedOrigins = isDevelopment
  ? [DEV_FRONTEND_URL, 'http://localhost:3000'].filter(Boolean)  // Development
  : [
      PROD_PUBLIC_URL || PROD_FRONTEND_URL,  // Production: Public access via nginx
      'http://frontend:3000',                 // Production: Internal Docker network (Next.js SSR)
    ].filter(Boolean);

const app = express();

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
  xPoweredBy: false,
}));

// CORS configuration - allow only whitelisted origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked CORS request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

app.use(userRouter)
app.use(qrRouter);

const init = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("✅ Connected to DB");

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on PORT: ${PORT}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`🔒 Allowed CORS origins:`, allowedOrigins);
    });
  } catch (error) {
    console.log('❌ Error on server init', error);
  }
};

init();