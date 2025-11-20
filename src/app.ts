import cookieParser from 'cookie-parser';
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import helmet from 'helmet';

import qrRouter from './qr-codes/qrcodes.router';
import userRouter from './users/users.router';

const { PORT } = process.env;

const app = express();

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
  xPoweredBy: false,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Hello");
})

app.use(userRouter)
app.use(qrRouter);

const init = async () => {
  try {
    app.listen(PORT, () => {
      console.log("Server Listen PORT:", PORT);
    });
  } catch (error) {
    console.log('Error on server init', error);
  }
};

init();