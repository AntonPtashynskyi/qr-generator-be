"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qrcodes_controller_1 = require("./qrcodes.controller");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.get("/r/:qr_id", qrcodes_controller_1.getQRCode);
router.post("/qrcodes", [auth_1.default], qrcodes_controller_1.createQRCode);
router.get("/qrcodes", [auth_1.default], qrcodes_controller_1.getAllUsersCodes);
router.delete("/qrcodes/:qr_id", [auth_1.default], qrcodes_controller_1.deleteQRCode);
exports.default = router;
