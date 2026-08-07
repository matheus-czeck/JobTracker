import { type Request, type Response } from "express";
import AuthService from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

class AuthController {
  static async register(req: Request, res: Response) {
    const dto = registerSchema.parse(req.body);

    const response = await AuthService.registerUser(dto);

    return res.status(201).json(response);
  }

  static async Login(req: Request, res: Response) {
    const dto = loginSchema.parse(req.body);
    const response = await AuthService.login(dto);
    return res.status(200).json(response);
  }
}

export default AuthController;
