import { NextFunction, Request, Response } from "express";
import { generateQRCode } from "./qrcodes.service";
import QRCodeModel from "./qrcodes.model";

export const createQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { target_url } = req.body;
    const ownerID = res.locals.user.id;

    if (!target_url) {
      return res.status(400).json({ error: "Please attached the link!" });
    }

    const {redirectUrl, qr_id} = await generateQRCode(ownerID, target_url);

    res.json({
      success: true,
      qr_code_redirect_url: redirectUrl,
      id: qr_id
    });
  } catch (error) {
    // next(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getAllUsersCodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerID = res.locals.user.id;

    if (!ownerID) {
      return res.status(400).json({ error: "User have no access writes" });
    }

    const codes = await QRCodeModel.find({owner: ownerID});

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
  } catch (error) {
    // next(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const qrId = req.params.qr_id;
  console.log("QR PARAMS", qrId);

  try {
    const qrRecord = await QRCodeModel.findOneAndUpdate(
      { qr_id: qrId },
      { $inc: { scan_count: 1 } },
      { new: true }
    );

    if (qrRecord && qrRecord.target_url) {
      res.redirect(302, qrRecord.target_url);
    } else {
      res.status(404).send("QR-Code can't be find");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const qrId = req.params.qr_id;

    const qrRecord = await QRCodeModel.findOneAndDelete({ qr_id: qrId });

    if (!qrRecord) {
      return res.status(404).json({ error: "QR-Code can't be find" });
    }

    res.json({
      success: true,
      message: "QR-Code deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};