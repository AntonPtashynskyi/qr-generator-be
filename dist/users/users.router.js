"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const router = (0, express_1.Router)();
router.post("/sign-up", users_controller_1.createUser);
router.post("/login", users_controller_1.logIn);
router.post("/logout", users_controller_1.logOut);
exports.default = router;
