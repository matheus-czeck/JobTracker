import PasswordProvider from "../../shared/providers/password.provider.js";

interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
}

class UserEntity {
  private _id: string | undefined;
  private _name: string;
  private _email: string;
  private _password: string;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
  }

  async verifyPassword(password: string): Promise<boolean> {
    return PasswordProvider.compare(password, this._password);
  }

  static create(props: UserProps): UserEntity {
    return new UserEntity(props);
  }
  static restore(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get email() {
    return this._email;
  }

  changeName(name: string) {
    this._name = name;
  }
  changePassword(password: string) {
    this._password = password;
  }
  toPersistence() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
    };
  }
}

export default UserEntity;
