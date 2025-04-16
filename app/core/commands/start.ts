import { Context } from "grammy/web";
import { InitialStep } from "../../models/get-initial-settings.model";
import { LanguageModel } from "../../models/language.model";
import { getUser, setUser } from "../../services/user.service";
import {
  defineUserStep,
  handleLanguagePanel,
} from "../handlers/common.handler";

export async function startCommand(ctx: Context, db: any) {
  const { chatId } = ctx;
  const user = ctx.from;

  const isKnownUser = await getUser(chatId?.toString(), db);

  if (!isKnownUser && chatId) {
    const newUser = {
      createdAt: new Date(),
      currentUserStep: InitialStep.LANGUAGE_CHOOSE,
      id: ctx.from?.id.toString() || "",
      language: LanguageModel.UNKNOWN,
      name: ctx.from?.first_name || "",
      username: ctx.from?.username || "",
      updateAt: new Date(),
      deletedAt: null,
      isAdmin: false,
      isPartner: false,
    };
    return await Promise.all([
      setUser(chatId.toString(), newUser, db),
      handleLanguagePanel(ctx, newUser),
    ]);
  } else if (isKnownUser && chatId) {
    return await defineUserStep(ctx, isKnownUser);
  } else {
    return await ctx.reply("Please, choose language!");
  }
}

function getCommandText(userLanguage: LanguageModel): string {
  const msgs: Record<string, string> = {
    hebrew: "אתה כבר מחובר, בבקשה בחר פקודה אחרת",
    english: "You are already authorized, please choose another command",
    russian: "Вы уже авторизованы, пожалуйста, выберите другую команду",
    unknown: "Please, choose language",
  };
  return msgs[userLanguage];
}
