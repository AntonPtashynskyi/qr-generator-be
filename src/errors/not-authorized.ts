import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(message = "Not authorized") {
    super(message);
    this.message = message;

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeError() {
    return { message: this.message };
  }
}
