import { Context } from "grammy";
import { User } from "grammy/types";

export type GetInitialSettingsVariables = {
  chatId: number;
  ctx: Context;
  user: User | undefined;
  db: any;
};

export enum InitialStep {
  LANGUAGE_CHOOSE = "language_choose",
  ENTER_NAME = 'enter_name',
  LINKED_IN = 'linked_in'
}
