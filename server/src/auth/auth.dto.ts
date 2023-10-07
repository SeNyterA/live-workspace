import { TUser } from 'src/users/user.dto';

export type TLoginPayload = {
  userNameOrEmail: string;
  password: string;
};

export type TLoginResponse = {
  user: TUser;
  token: string;
};
