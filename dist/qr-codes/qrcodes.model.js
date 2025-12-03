"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userQrCodeSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    qr_id: {
        type: String,
        required: true,
    },
    target_url: {
        type: String,
        required: true,
    },
    scan_count: {
        type: Number,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
const QRCodeModel = (0, mongoose_1.model)("userQRCodes", userQrCodeSchema);
exports.default = QRCodeModel;
