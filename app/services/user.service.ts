import { BotCommand } from "@grammyjs/types";
import { InlineKeyboard } from "grammy";
import { LanguageModel } from "../models/language.model";
import { UserModel } from "../models/user.model";

export async function getUser(
  id: string | undefined,
  db: any,
): Promise<UserModel | undefined> {
  if (id) {
    return await db[id];
  }
  return undefined;
}

export async function setUser(
  chatId: string,
  user: UserModel,
  db: any,
): Promise<UserModel> {
  db[chatId] = user;
  return db[chatId];
}

export function createUserCommandMenu(
  userCommands: BotCommand[],
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  userCommands.forEach(({ command, description }) => {
    keyboard.add({
      text: description,
      callback_data: JSON.stringify({
        code: command,
        value: description,
      }),
    });
  });

  return keyboard;
}

export function getUserMenu(userLanguage: LanguageModel): string {
  const msgs: Record<string, string> = {
    hebrew: "התפריט שלך",
    english: "Your menu",
    russian: "Ваше меню",
    unknown: "Your menu",
  };
  return msgs[userLanguage];
}
