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
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const not_authorized_1 = require("../errors/not-authorized");
const bcryptjs_1 = require("bcryptjs");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        require: [true, "Email should be provided"],
        unique: [true, "Email must be uniq"],
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => {
                const emailRegex = /^[\w._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                return emailRegex.test(value);
            },
            message: "Email is not valid",
        },
    },
    password: {
        type: String,
        require: [true, "Password is require"],
        validate: {
            validator: (value) => {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
                return passwordRegex.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter and one number",
        },
        select: false,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (_doc, ret) => {
            delete ret.password;
            return ret;
        },
    },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                const salt = yield (0, bcryptjs_1.genSalt)(8);
                if (this.password) {
                    this.password = yield (0, bcryptjs_1.hash)(this.password, salt);
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
});
userSchema.methods.generateAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15min",
    });
};
// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET as string, {
//     expiresIn: "7d",
//   });
// };
userSchema.statics.findUserByCredential = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email })
            .select("+password")
            .orFail(() => new not_authorized_1.NotAuthorizedError("User with thin credentials not found"));
        const isCorrectPassword = yield (0, bcryptjs_1.compare)(password, user.password);
        if (isCorrectPassword) {
            return user;
        }
        throw new not_authorized_1.NotAuthorizedError("Invalid credentials");
    });
};
const userModel = (0, mongoose_1.model)("user", userSchema);
exports.default = userModel;
