import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { changePasswordSchema, loginSchema, registerSchema } from "../validators/schemas";

const router = Router();

router.post("/register", validateBody(registerSchema), auth.register);
router.post("/login", validateBody(loginSchema), auth.login);
router.post("/logout", auth.logout);
router.get("/me", authMiddleware, auth.me);
router.put("/password", authMiddleware, validateBody(changePasswordSchema), auth.changePassword);

export default router;
