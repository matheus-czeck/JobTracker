import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error.js";
import JwtProvider from "../providers/jwt.provider.js";

class AuthMiddleware {
  static authenticate(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization) throw new AppError("Token nao informado", 401);

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) throw new AppError("Token invalido", 401);

    const payload = JwtProvider.verify(token);

    req.userId = payload.sub;

    next();
  }
}

export default AuthMiddleware;
