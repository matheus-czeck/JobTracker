import { type ResponseUserDto } from "../user/user.dto.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { z } from "zod";

export type RegisterUserDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponseDto {
  token: string;
  user: ResponseUserDto;
}
