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
exports.generateQRCode = void 0;
const uuid_1 = require("uuid");
const qrcode_1 = __importDefault(require("qrcode"));
const qrcodes_model_1 = __importDefault(require("./qrcodes.model"));
const { NODE_ENV, DEV_BASE_URL, PROD_BASE_URL } = process.env;
// Determine environment-specific BASE_URL
const isDevelopment = NODE_ENV === 'development';
const BASE_URL = isDevelopment ? DEV_BASE_URL : PROD_BASE_URL;
const generateQRCode = (ownerID, target_url) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate uniq QR_id;
    const uniqQRID = (0, uuid_1.v4)();
    try {
        // Save to DB under ownerID, target_url, uniqQRID
        yield qrcodes_model_1.default.create({
            owner: ownerID,
            qr_id: uniqQRID,
            target_url,
            scan_count: 0,
        });
        // Create redirectURL
        const redirectUrl = `${BASE_URL}/r/${uniqQRID}`;
        // Generate QR code image
        return { redirectUrl, qr_id: uniqQRID };
        // return await generateQrCodeDataUrl(redirectUrl);
    }
    catch (error) {
        console.error("Error during creation new QR Code:", error);
        throw new Error("QR Code Can not create ");
    }
});
exports.generateQRCode = generateQRCode;
const generateQrCodeDataUrl = (redirectUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield qrcode_1.default.toDataURL(redirectUrl, {
            errorCorrectionLevel: "H",
        });
    }
    catch (error) {
        console.error("Generate QR code Error:", error);
        throw new Error("QR Code Can not be generated");
    }
});
