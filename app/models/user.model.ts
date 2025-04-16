import { LanguageModel } from "./language.model";

export type GetUserVariables = Record<string, UserModel>;

export type UserReturnType = {
  chat_id: string;
  user_db: UserModel;
};

export interface UserModel {
  id: string;
  username: string;
  language: LanguageModel;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
  isAdmin: boolean;
  isPartner: boolean;
  updateAt: Date;
  currentUserStep: string;
}

