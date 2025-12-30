import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from "express";
import helmet from 'helmet';

import qrRouter from './qr-codes/qrcodes.router';
import userRouter from './users/users.router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  MONGO_URI,
  NODE_ENV,
  DEV_FRONTEND_URL,
  PROD_FRONTEND_URL
} = process.env;

// Determine environment-specific URLs
const isDevelopment = NODE_ENV === 'development';
const FRONTEND_URL = isDevelopment ? DEV_FRONTEND_URL : PROD_FRONTEND_URL;

const app = express();

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
  xPoweredBy: false,
}));

// CORS configuration - allow frontend to make requests
app.use(cors({
  origin: FRONTEND_URL, // Automatically switches between dev and prod
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
    console.log("Connected to DB");
    
    app.listen(PORT, () => {
      console.log("Server Listen PORT:", PORT);
    });
  } catch (error) {
    console.log('Error on server init', error);
  }
};

init();