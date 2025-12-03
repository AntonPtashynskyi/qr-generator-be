"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.logIn = exports.createUser = void 0;
const mongoose_1 = require("mongoose");
const users_model_1 = __importDefault(require("./users.model"));
const error_transform_1 = require("../helpers/error-transform");
const bad_request_1 = require("../errors/bad-request");
const constants_1 = require("../constants");
const tokenServices_1 = require("../services/tokenServices");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const newUser = yield users_model_1.default.create(user);
        //TODO USE tokenService.generaTeAccessToken() instead
        const token = newUser.generateAccessToken();
        // set Cookies
        const { accessToken, refreshToken } = tokenServices_1.tokenService.generateTokens({
            id: newUser._id.toString(),
        });
        tokenServices_1.tokenService.setAuthCookies(res, accessToken, refreshToken);
        res
            .status(201)
            .cookie("accessToken", token, {
            maxAge: constants_1.ONE_HOUR,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
            .send({ id: newUser._id });
    }
    catch (error) {
        if (error instanceof mongoose_1.Error.ValidationError) {
            const errorMapped = (0, error_transform_1.errorTransform)(error);
            return next(new bad_request_1.BadRequestError(errorMapped[0].message));
        }
        next(error);
    }
});
exports.createUser = createUser;
const logIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield users_model_1.default.findUserByCredential(email, password);
        if (!user) {
            next();
        }
        const { accessToken, refreshToken } = tokenServices_1.tokenService.generateTokens({
            id: user._id.toString(),
        });
        tokenServices_1.tokenService.setAuthCookies(res, accessToken, refreshToken);
        res.status(200).json({ id: user._id, message: "Login successful" });
    }
    catch (error) {
        next(error);
    }
});
exports.logIn = logIn;
const logOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        tokenServices_1.tokenService.clearAuthCookies(res);
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.logOut = logOut;
