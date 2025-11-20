import mongoose, { Model, Schema, Document, model } from "mongoose";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized";
import { genSalt, hash, compare } from "bcryptjs";

interface IUser {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

interface UserDoc extends Document, IUser {}
interface UserModel extends Model<UserDoc> {
  findUserByCredential: (
    email: string,
    password: string
  ) => Promise<UserDoc | never>;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: [true, "Email should be provided"],
      unique: [true, "Email must be uniq"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
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
        validator: (value: string) => {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
          return passwordRegex.test(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter and one number",
      },
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await genSalt(8);
      if (this.password) {
        this.password = await hash(this.password, salt);
      }
    }
  } catch (error) {
    next(error as Error);
  }
});

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
//     expiresIn: "15min",
//   });
// };

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET as string, {
//     expiresIn: "7d",
//   });
// };

userSchema.statics.findUserByCredential = async function (
  email: string,
  password: string
) {
  const user = await this.findOne({ email })
    .select("+password")
    .orFail(
      () => new NotAuthorizedError("User with thin credentials not found")
    );

  const isCorrectPassword = await compare(password, user.password);

  if (isCorrectPassword) {
    return user;
  }
  throw new NotAuthorizedError("Invalid credentials");
};

const userModel = model<IUser, UserModel>("user", userSchema);
export default userModel;
