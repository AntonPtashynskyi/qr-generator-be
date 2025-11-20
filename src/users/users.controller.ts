import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import userModel from "./users.model";
import { errorTransform } from "../helpers/error-transform";
import { BadRequestError } from "../errors/bad-request";
import { ONE_HOUR } from "../constants";
import { tokenService } from "../services/tokenServices";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;

  try {
    const newUser = await userModel.create(user);
    //TODO USE tokenService.generaTeAccessToken() instead
    const token = newUser.generateAccessToken();
    // set Cookies
    res
      .status(201)
      .cookie("accessToken", token, {
        maxAge: ONE_HOUR,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .send({ id: newUser._id });
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
    res.status(200).json({ id: user._id, message: "Login successful" });
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
