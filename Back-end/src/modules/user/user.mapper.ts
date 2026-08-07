import UserEntity from "./user.entity.js";
import { type ResponseUserDto } from "./user.dto.js";

export class UserMapper {
  static toResponse(user: UserEntity): ResponseUserDto {
    if (!user.id) throw new Error("Id usuario nulo!");
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
