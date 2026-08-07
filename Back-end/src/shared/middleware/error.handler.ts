import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors/app.error.js";
import { ZodError } from "zod";

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
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Dados invalidos",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  res.status(500).json({ error: "Problema interno do servidor" });
  return;
}
