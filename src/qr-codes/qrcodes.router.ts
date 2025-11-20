import { Router } from 'express';
import { getQRCode, createQRCode } from './qrcodes.controller';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get("/r/:qr_id", getQRCode);
router.post("/qrcodes", [authMiddleware], createQRCode);

export default router;