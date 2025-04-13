import { InlineKeyboard } from "grammy";
import { CallbackVariables } from "../dto/callback-query";
import { Codes } from "../models/callback-query-data.model";
import { LanguageModel } from "../models/language.model";

export function getLanguagePanel(): InlineKeyboard {
  const languageOptions = getBtnText();
  return createLanguageMenu(languageOptions);
}

export function getMessageText(userName: string): string {
  return `Hello ${userName}! Please, choose language.`;
}

function getBtnText(): Record<string, string> {
  return {
    [LanguageModel.ENGLISH]: `${String.fromCodePoint(
      0x1f1ec,
      0x1f1e7,
    )} English`,
    [LanguageModel.HEBREW]: `${String.fromCodePoint(0x1f1ee, 0x1f1f1)} עברית`,
    [LanguageModel.RUSSIAN]: `${String.fromCodePoint(
      0x1f1f7,
      0x1f1fa,
    )} Русский`,
  };
}

export function createLanguageMenu(
  languageOptions: Record<string, string>,
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  Object.entries(languageOptions).forEach(([key, value]) => {
    keyboard.add({
      text: value,
      callback_data: JSON.stringify({
        code: Codes.language_panel,
        value: key,
      }),
    });
  });

  return keyboard;
}

export async function handleLanguageAnswer({
  ctx,
  user
}: CallbackVariables): Promise<void | Error> {
  if (ctx.from?.username) {
    const { username } = ctx.from;
    const msgs: Record<string, string> = {
      hebrew: getTextForHebrew(username),
      english: getTextForEnglish(username),
      russian: getTextForRussian(username),
    };
    if (user. && ctx?.chatId) {
      await ctx
        .editMessageText(msgs[value])
        // .then(async () => {
        //   await setUser(ctx.chatId!.toString(), user, db);
        //   const nameMsgs: Record<string, string> = {
        //     hebrew: getResultTextForHebrew(),
        //     english: getResultTextForEnglish(),
        //     russian: getResultTextForRussian(),
        //   };
        //   await ctx.reply(nameMsgs[value]);
        // })
        // .then(async () => {
        //   const commands = await ctx.api.getMyCommands();
        //   const user_panel = createUserCommandMenu(commands);
        //   await ctx.reply(getUserMenu(value), {
        //     reply_markup: user_panel,
        //   });
        // })
        .catch(() => {
          return new Error("Something went wrong trying to modify result");
        });
    }
  }
}

function getTextForHebrew(userName: string): string {
  return `ברוכים הבאים! ${userName} תודה!`;
}
function getTextForEnglish(userName: string): string {
  return `Thank you ${userName}! Welcome!`;
}
function getTextForRussian(userName: string): string {
  return `Спасибо ${userName}! Добро пожаловать!`;
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
