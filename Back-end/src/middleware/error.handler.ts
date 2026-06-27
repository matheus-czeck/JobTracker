import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors/app.error.js";

export function defaultError(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Problema interno do servidor" });
  return;
}
