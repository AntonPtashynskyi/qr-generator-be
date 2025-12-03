"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const not_authorized_1 = require("../errors/not-authorized");
const tokenServices_1 = require("../services/tokenServices");
function default_1(req, res, next) {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) {
        return next(new not_authorized_1.NotAuthorizedError("No access or refresh token provided"));
    }
    try {
        const payload = tokenServices_1.tokenService.verifyAccessToken(accessToken);
        res.locals.user = payload;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError" ||
            (error.name === "JsonWebTokenError" && refreshToken)) {
            try {
                const refreshPayload = tokenServices_1.tokenService.verifyRefreshToken(refreshToken);
                const _a = refreshPayload, { exp, iat } = _a, cleanPayload = __rest(_a, ["exp", "iat"]);
                const { accessToken: newAccessToken } = tokenServices_1.tokenService.generateAccessToken(refreshPayload);
                tokenServices_1.tokenService.setAuthAccessTokenCookies(res, newAccessToken);
                res.locals.user = cleanPayload;
                return next();
            }
            catch (error) {
                return next(new not_authorized_1.NotAuthorizedError("Refresh token invalid or expired"));
            }
        }
        next(new not_authorized_1.NotAuthorizedError("Access token is now valid"));
    }
}
