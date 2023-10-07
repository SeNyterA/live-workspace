import { TUser } from 'src/modules/users/user.dto';

export type TLoginPayload = {
  userNameOrEmail: string;
  password: string;
};

export type TLoginResponse = {
  user: TUser;
  token: string;
};
