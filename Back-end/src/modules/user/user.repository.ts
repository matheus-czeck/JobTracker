import UserEntity from "./user.entity.js";
import prisma from "../../shared/database.js";

class UserRepository {
  static async create(user: UserEntity) {
    const data = user.toPersistence();

    const createdUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return UserEntity.restore({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      password: createdUser.password,
    });
  }

  static async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }
    return UserEntity.restore({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
  }
}

export default UserRepository;
