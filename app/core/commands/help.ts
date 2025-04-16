import { Message } from "@grammyjs/types";
import { Context } from "grammy";
import { LanguageModel } from "../../models/language.model";
import { createUserCommandMenu, getUser } from "../../services/user.service";

export async function getHelp(
  ctx: Context,
  db: any,
): Promise<Message.TextMessage> {
  const isKnownUser = await getUser(ctx.chatId?.toString() ?? "", db);
  const commands = await ctx.api.getMyCommands();
  const user_panel = createUserCommandMenu(commands);
  return await ctx.reply(
    getCommandText(isKnownUser?.language || LanguageModel.UNKNOWN),
    {
      reply_markup: user_panel,
    },
  );
}

function getCommandText(userLanguage: LanguageModel): string {
  const msgs: Record<string, string> = {
    hebrew: "אתה כבר מחובר, בבקשה בחר פקודה אחרת",
    english: "Your available commands",
    russian: "Ваши доступные команды",
    unknown: "Your available commands",
  };
  return msgs[userLanguage];
}
