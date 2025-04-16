import { Context } from "grammy";
import { LanguageModel } from "../models/language.model";
import { UserModel } from "../models/user.model";

export type CallbackVariables = {
  db: any;
  user: UserModel;
  ctx: Context;
  value: LanguageModel;
};
