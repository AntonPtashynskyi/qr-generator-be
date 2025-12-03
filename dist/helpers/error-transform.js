"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorTransform = void 0;
const errorTransform = (err) => {
    return Object.values(err.errors).map((err) => {
        return { message: err.message };
    });
};
exports.errorTransform = errorTransform;
