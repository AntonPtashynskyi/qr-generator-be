import jwt from "jsonwebtoken";
import { Response } from "express";

const TOKEN_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export interface JwtPayload {
  id: string;
  email?: string;
}

export const tokenService = {
  generateTokens(payload: JwtPayload) {
    const { exp, iat, ...cleanPayload } = payload as any;

    const accessToken = jwt.sign(cleanPayload, TOKEN_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(cleanPayload, REFRESH_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  },

  generateAccessToken(payload: JwtPayload) {
    const { exp, iat, ...cleanPayload } = payload as any;
    const accessToken = jwt.sign(cleanPayload, TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return { accessToken };
  },

  verifyAccessToken(token: string) {
    return jwt.verify(token, TOKEN_SECRET);
  },

  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET);
  },

  setAuthAccessTokenCookies(res: Response, accessToken: string) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: 20 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
  },

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 20 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
  },

  clearAuthCookies(res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  },
};
