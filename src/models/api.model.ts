import { UserEntity } from "src/users/entities/user.entity";

export type RequestWithUser = {
    currentUser: UserEntity;
  } & Request;