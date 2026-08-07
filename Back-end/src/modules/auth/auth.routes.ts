import Express from "express";
import AuthController from "./auth.controller.js";

const router = Express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.Login);

export default router;
