import { Message } from "@grammyjs/types";
import { Context } from "grammy";
import { CallBackData, Codes } from "../../models/callback-query-data.model";
import { InitialStep } from "../../models/get-initial-settings.model";
import { LanguageModel } from "../../models/language.model";
import { UserModel } from "../../models/user.model";
import {
  getLanguagePanel,
  getMessageText,
  handleLanguageAnswer,
} from "../../services/language.service";
import { getHelp } from "../commands/help";

export async function handleCallBackQueryData(
  data: CallBackData,
  ctx: Context,
  user: UserModel,
  db: any,
): Promise<void> {
  const obj: Record<string, () => Promise<void | Error>> = {
    [Codes.language_panel]: () =>
      handleLanguageAnswer({
        ctx,
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
        db,
        value: data.value as LanguageModel,
      }),
    [Codes.help]: () => getHelp(ctx, db),
  };

  if (obj.hasOwnProperty(data.code)) {
    await obj[data.code]();
  } else {
    ctx.reply("Command is not handled");
  }
}

export async function defineUserStep(
  ctx: Context,
  user: UserModel,
): Promise<unknown> {
  const steps: Record<string, any> = {
    [InitialStep.LANGUAGE_CHOOSE]: handleLanguagePanel(ctx, user),
    [InitialStep.ENTER_NAME]: handleEnterName(ctx, user),
    [InitialStep.LINKED_IN]: languagePanelHandler(ctx, user),
  };
  return await steps[user.currentUserStep];
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

async function handleUserLanguageAnswer(
  data: CallBackData,
  ctx: Context,
  user: UserModel,
  db: any,
): Promise<Message.TextMessage> {
  await handleLanguageAnswer({
    ctx,
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
    db,
    value: data.value as LanguageModel,
  }).then(() => {});
}

async function handleEnterName(
  ctx: Context,
  user: UserModel,
): Promise<Message.TextMessage> {
  const nameMsgs: Record<string, string> = {
    hebrew: getResultTextForHebrew(),
    english: getResultTextForEnglish(),
    russian: getResultTextForRussian(),
  };
  return await ctx.reply(nameMsgs[user.language]);
}

export function getResultTextForHebrew(): string {
  return `Please enter your full name in the next format "SURNAME, NAME"`;
}
export function getResultTextForEnglish(): string {
  return `Please enter your full name in the next format "SURNAME, NAME"`;
}
export function getResultTextForRussian(): string {
  return `Пожалуйста, введите своё полное имя одной строчкой в формате "ФАМИЛИЯ, ИМЯ"`;
}
