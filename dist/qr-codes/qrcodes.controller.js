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
exports.deleteQRCode = exports.getQRCode = exports.getAllUsersCodes = exports.createQRCode = void 0;
const qrcodes_service_1 = require("./qrcodes.service");
const qrcodes_model_1 = __importDefault(require("./qrcodes.model"));
const createQRCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { target_url } = req.body;
        const ownerID = res.locals.user.id;
        if (!target_url) {
            return res.status(400).json({ error: "Please attached the link!" });
        }
        const { redirectUrl, qr_id } = yield (0, qrcodes_service_1.generateQRCode)(ownerID, target_url);
        res.json({
            success: true,
            qr_code_redirect_url: redirectUrl,
            id: qr_id
        });
    }
    catch (error) {
        // next(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.createQRCode = createQRCode;
const getAllUsersCodes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerID = res.locals.user.id;
        if (!ownerID) {
            return res.status(400).json({ error: "User have no access writes" });
        }
        const codes = yield qrcodes_model_1.default.find({ owner: ownerID });
        const codesTransform = codes.map((code) => {
            return {
                id: code.qr_id,
                targetUrl: code.target_url,
                scanCount: code.scan_count,
                date: code.created_at,
            };
        });
        res.json({
            success: true,
            codes: codesTransform,
        });
    }
    catch (error) {
        // next(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.getAllUsersCodes = getAllUsersCodes;
const getQRCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const qrId = req.params.qr_id;
    console.log("QR PARAMS", qrId);
    try {
        const qrRecord = yield qrcodes_model_1.default.findOneAndUpdate({ qr_id: qrId }, { $inc: { scan_count: 1 } }, { new: true });
        if (qrRecord && qrRecord.target_url) {
            res.redirect(302, qrRecord.target_url);
        }
        else {
            res.status(404).send("QR-Code can't be find");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getQRCode = getQRCode;
const deleteQRCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const qrId = req.params.qr_id;
        const qrRecord = yield qrcodes_model_1.default.findOneAndDelete({ qr_id: qrId });
        if (!qrRecord) {
            return res.status(404).json({ error: "QR-Code can't be find" });
        }
        res.json({
            success: true,
            message: "QR-Code deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteQRCode = deleteQRCode;
