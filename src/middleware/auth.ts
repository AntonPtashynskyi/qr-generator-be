import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not-authorized";
import { tokenService } from "../services/tokenServices";

export default function (req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return next(new NotAuthorizedError("No access or refresh token provided"));
  }

  try {
    const payload = tokenService.verifyAccessToken(accessToken) as {
      id: string;
    };
    
    res.locals.user = payload;
    next();
  } catch (error: any) {
    if (
      error.name === "TokenExpiredError" ||
      (error.name === "JsonWebTokenError" && refreshToken)
    ) {
      try {
        const refreshPayload = tokenService.verifyRefreshToken(
          refreshToken
        ) as { id: string };
        const { exp, iat, ...cleanPayload } = refreshPayload as any;

        const { accessToken: newAccessToken } =
          tokenService.generateAccessToken(refreshPayload);

        tokenService.setAuthAccessTokenCookies(res, newAccessToken);

        res.locals.user = cleanPayload;
        return next();
      } catch (error) {
        return next(new NotAuthorizedError("Refresh token invalid or expired"));
      }
    }
    next(new NotAuthorizedError("Access token is now valid"));
  }
}
