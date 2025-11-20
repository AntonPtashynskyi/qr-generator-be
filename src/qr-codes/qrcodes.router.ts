import { Router } from 'express';
import { getQRCode, createQRCode } from './qrcodes.controller';

const router = Router();

router.get("/r/:qr_id", getQRCode);
router.post("/qrcodes", createQRCode);

export default router;