import UserEntity from "../../modules/user/user.entity.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/app.error.js";

interface TokenPayload {
  sub: string;
}

class JwtProvider {
  static generate(user: UserEntity): string {
    if (!user.id) throw new AppError("Nao foi possivel gerar o token", 500);

    return jwt.sign(
      {
        sub: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
  }

  static verify(token: string): TokenPayload {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!payload.sub) throw new AppError("Token invalido", 401);

    return { sub: payload.sub };
  }
}

export default JwtProvider;
