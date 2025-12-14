import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import QRCodeModel from "./qrcodes.model";

const { NODE_ENV, DEV_BASE_URL, PROD_BASE_URL } = process.env;

// Determine environment-specific BASE_URL
const isDevelopment = NODE_ENV === 'development';
const BASE_URL = isDevelopment ? DEV_BASE_URL : PROD_BASE_URL;

export const generateQRCode = async (ownerID: string, target_url: string) => {
  // Generate uniq QR_id;
  const uniqQRID = uuidv4();

  try {
    // Save to DB under ownerID, target_url, uniqQRID
    await QRCodeModel.create({
      owner: ownerID,
      qr_id: uniqQRID,
      target_url,
      scan_count: 0,
    });
    // Create redirectURL
    const redirectUrl = `${BASE_URL}/r/${uniqQRID}`;
    // Generate QR code image
    return {redirectUrl, qr_id: uniqQRID};
    // return await generateQrCodeDataUrl(redirectUrl);
  } catch (error) {
    console.error("Error during creation new QR Code:", error);
    throw new Error("QR Code Can not create ");
  }
};

const generateQrCodeDataUrl = async (redirectUrl: string) => {
  try {
    return await QRCode.toDataURL(redirectUrl, {
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("Generate QR code Error:", error);
    throw new Error("QR Code Can not be generated");
  }
};
