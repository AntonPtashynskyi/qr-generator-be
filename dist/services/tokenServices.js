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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
exports.tokenService = {
    generateTokens(payload) {
        const _a = payload, { exp, iat } = _a, cleanPayload = __rest(_a, ["exp", "iat"]);
        const accessToken = jsonwebtoken_1.default.sign(cleanPayload, TOKEN_SECRET, {
            expiresIn: "1d",
        });
        const refreshToken = jsonwebtoken_1.default.sign(cleanPayload, REFRESH_SECRET, {
            expiresIn: "7d",
        });
        return { accessToken, refreshToken };
    },
    generateAccessToken(payload) {
        const _a = payload, { exp, iat } = _a, cleanPayload = __rest(_a, ["exp", "iat"]);
        const accessToken = jsonwebtoken_1.default.sign(cleanPayload, TOKEN_SECRET, {
            expiresIn: "1d",
        });
        return { accessToken };
    },
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
    },
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
    },
    setAuthAccessTokenCookies(res, accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
        });
    },
    setAuthCookies(res, accessToken, refreshToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
        });
    },
    clearAuthCookies(res) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
    },
};
