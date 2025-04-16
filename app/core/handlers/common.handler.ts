import { Message } from "@grammyjs/types";
import { Context } from "grammy";
import { CallbackVariables } from "../../dto/callback-query";
import { CallBackData, Codes } from "../../models/callback-query-data.model";
import { InitialStep } from "../../models/get-initial-settings.model";
import { LanguageModel } from "../../models/language.model";
import { UserModel } from "../../models/user.model";
import {
  getLanguagePanel,
  getMessageText,
  handleLanguageAnswer,
} from "../../services/language.service";
import { setUser } from "../../services/user.service";
import { getHelp } from "../commands/help";

export async function handleCallBackQueryData(
  data: CallBackData,
  ctx: Context,
  user: UserModel,
  db: any,
): Promise<void> {
  const obj: Record<string, () => Promise<Message.TextMessage>> = {
    [Codes.language_panel]: () =>
      handleUserLanguageAnswer({
        ctx,
        db,
        user: {
          createdAt: user.createdAt,
          currentUserStep: InitialStep.ENTER_NAME,
          id: user.id,
          language: data.value as LanguageModel,
          name: user.name,
          username: user.username,
          updateAt: new Date(),
          deletedAt: null,
          isAdmin: false,
          isPartner: false,
        },
        value: data.value as LanguageModel,
      }),
    [Codes.help]: () => getHelp(ctx, db),
  };

  if (obj.hasOwnProperty(data.code)) {
    await obj[data.code]();
  } else {
    await ctx.reply("Command is not handled");
  }
}

export async function defineUserStep(
  ctx: Context,
  user: UserModel,
): Promise<unknown> {
  const steps: Record<string, any> = {
    [InitialStep.LANGUAGE_CHOOSE]: () => handleLanguagePanel(ctx, user),
    [InitialStep.ENTER_NAME]: () => handleEnterName(ctx, user.language),
    [InitialStep.LINKED_IN]: () => handleLinkedIn(ctx, user.language),
  };
  return await steps[user.currentUserStep]();
}

export async function handleLanguagePanel(
  ctx: Context,
  user: UserModel,
): Promise<Message.TextMessage> {
  const menu = getLanguagePanel();
  return await ctx.reply(getMessageText(user?.username || ""), {
    reply_markup: menu,
  });
}

async function handleUserLanguageAnswer({
  ctx,
  user,
  db,
  value,
}: CallbackVariables): Promise<Message.TextMessage> {
  return await handleLanguageAnswer({
    ctx,
    user,
    db,
    value,
  })
    .then(async () => {
      const savedUser = await setUser(ctx.chatId!.toString(), user, db);
      return await handleEnterName(ctx, savedUser.language);
    })
    .catch(async (err) => {
      console.log("err ===========>: ", err);
      return await ctx.reply("");
    });
}

async function handleEnterName(
  ctx: Context,
  value: LanguageModel,
): Promise<Message.TextMessage> {
  const nameMsgs: Record<string, () => string> = {
    hebrew: () => getResultTextForHebrew(),
    english: () => getResultTextForEnglish(),
    russian: () => getResultTextForRussian(),
  };
  return await ctx.reply(nameMsgs[value]());
}

export function getResultTextForHebrew(): string {
  return `אנא הזן את שמך המלא בפורמט הבא "SURNAME, NAME"`;
}
export function getResultTextForEnglish(): string {
  return `Please enter your full name in the next format "SURNAME, NAME"`;
}
export function getResultTextForRussian(): string {
  return `Пожалуйста, введите своё полное имя одной строчкой в формате "ФАМИЛИЯ, ИМЯ"`;
}

async function handleLinkedIn(
  ctx: Context,
  value: LanguageModel,
): Promise<Message.TextMessage> {
  const nameMsgs: Record<string, () => string> = {
    hebrew: () => getLinkedInHebrew(),
    english: () => getLinkedInEnglish(),
    russian: () => getLinkedInRussian(),
  };
  return await ctx.reply(nameMsgs[value]());
}

export function getLinkedInHebrew(): string {
  return `אנא ספק את הקישור לפרופיל הלינקדאין שלך`;
}
export function getLinkedInEnglish(): string {
  return `Please provide your LinkedIn profile link`;
}
export function getLinkedInRussian(): string {
  return `Пожалуйста, отправьте ссылку на ваш профиль LinkedIn`;
}
