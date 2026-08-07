import { AppError } from "../../shared/errors/app.error.js";
import UserEntity from "../user/user.entity.js";
import UserRespository from "../user/user.repository.js";
import PasswordProvider from "../../shared/providers/password.provider.js";
import { type RegisterUserDto } from "./auth.dto.js";
import { UserMapper } from "../user/user.mapper.js";
import { type LoginDto, type AuthResponseDto } from "./auth.dto.js";
import UserRepository from "../user/user.repository.js";
import JWtProvider from "../../shared/providers/jwt.provider.js";

class AuthService {
  static async registerUser(dto: RegisterUserDto) {
    const { email, name, password } = dto;

    const user = await UserRespository.findByEmail(email);

    if (user) throw new AppError("Usuario ja existe!", 409);

    const hashedPassword = await PasswordProvider.hash(password);

    const newUser = UserEntity.create({
      email,
      name,
      password: hashedPassword,
    });

    const createdUser = await UserRespository.create(newUser);

    return UserMapper.toResponse(createdUser);
  }

  static async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("Credenciais invalidas!", 401);

    const isValid = await user.verifyPassword(password);

    if (!isValid) throw new AppError("Credenciais invalidas!", 401);

    const token = JWtProvider.generate(user);

    const response: AuthResponseDto = { token, user: UserMapper.toResponse(user) };

    return response;
  }
}
export default AuthService;
