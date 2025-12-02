import { Router } from 'express';
import { getQRCode, createQRCode, getAllUsersCodes, deleteQRCode } from './qrcodes.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get("/r/:qr_id", getQRCode);
router.post("/qrcodes", [authMiddleware], createQRCode);
router.get("/qrcodes", [authMiddleware], getAllUsersCodes);
router.delete("/qrcodes/:qr_id", [authMiddleware], deleteQRCode);

export default router;