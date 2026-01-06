import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import userModel from "./users.model";
import { errorTransform } from "../helpers/error-transform";
import { BadRequestError } from "../errors/bad-request";
import { tokenService } from "../services/tokenServices";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;

  try {
    const newUser = await userModel.create(user);

    const { accessToken, refreshToken } = tokenService.generateTokens({
      id: newUser._id.toString(),
    });

    tokenService.setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      id: newUser._id,
      accessToken,
      refreshToken
    });

  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const errorMapped = errorTransform(error);
      return next(new BadRequestError(errorMapped[0].message));
    }

    next(error);
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByCredential(email, password);

    if (!user) {
      next();
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      id: user._id.toString(),
    });

    tokenService.setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({
      id: user._id,
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    tokenService.clearAuthCookies(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
