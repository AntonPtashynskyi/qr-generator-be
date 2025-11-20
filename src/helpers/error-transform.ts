import { Error } from "mongoose";

export const errorTransform = (err: Error.ValidationError) => {
  return Object.values(err.errors).map((err) => {
    return {message: err.message}
})};
