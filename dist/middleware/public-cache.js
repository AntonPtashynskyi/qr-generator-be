"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publicCache = (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=86400");
    next();
};
exports.default = publicCache;
