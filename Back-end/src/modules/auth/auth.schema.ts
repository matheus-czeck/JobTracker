import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter no minimo 3 caracteres")
    .max(50, "Nome deve ter no maximo 50 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .pipe(
      z.email({
        error: "Email inválido",
      }),
    ),
  password: z
    .string()
    .trim()
    .min(4, "Senha deve ter no minimo 4 caracteres")
    .max(15, "Senha deve ter no maximo 15 caracteres"),
});
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .pipe(
      z.email({
        error: "Email inválido",
      }),
    ),
  password: z
    .string()
    .trim()
    .min(4, "Senha deve ter no minimo 4 caracteres")
    .max(15, "Senha deve ter no maximo 15 caracteres"),
});

export type RegisterUserDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
