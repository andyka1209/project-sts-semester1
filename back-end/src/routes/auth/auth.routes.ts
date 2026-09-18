import { Router } from "express";
import authController from "../../controller/auth/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/seed-admin", authController.seedAdmin);

export default router;