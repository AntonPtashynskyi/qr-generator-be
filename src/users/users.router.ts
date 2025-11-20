import { Router } from 'express';
import { createUser, logIn, logOut } from './users.controller';

const router = Router();

router.post("/sign-up", createUser);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;