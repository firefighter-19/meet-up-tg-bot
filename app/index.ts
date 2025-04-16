import { config } from "@dotenvx/dotenvx";
import "reflect-metadata";
import { getHelp } from "./core/commands/help";
import { startCommand } from "./core/commands/start";

import { Bot } from "grammy";
import { handleCallBackQueryData } from "./core/handlers/common.handler";
import { BotModel } from "./models/bot.model";
import { getUser } from "./services/user.service";

config({ path: ["../environment.env"], ignore: ["MISSING_ENV_FILE"] });

const token = process.env.BOT_TOKEN || "";

const bot = new Bot(token);

const tempDb = {};

type StartBotVariables = {
  bot: BotModel;
  database?: any;
};

function startBot({ bot, database }: StartBotVariables): void {
  bot.start();

  bot.command("start", async (ctx) => await startCommand(ctx, database));

  bot.command("help", async (ctx) => await getHelp(ctx, database));

  bot.on("callback_query:data", async (ctx) => {
    const parsed = JSON.parse(ctx.callbackQuery.data);

    const isKnownUser = await getUser(ctx.chatId?.toString(), database);
    if (isKnownUser) {
      await handleCallBackQueryData(parsed, ctx, isKnownUser, database);
    } else {
      if (ctx.chatId) ctx.api.sendMessage(ctx.chatId, "User is not defined");
    }
  });

  bot.on("message", async (ctx) => {
    if (ctx.message.text?.startsWith("/")) return;

    const isKnownUser = await getUser(ctx.chatId?.toString(), database);

    if (isKnownUser) {
      // const currentUserStep = savedUser
    }

    // if (isKnownUser) {
    //   if (JSON.stringify(knownUserCommands) !== JSON.stringify(commands)) {
    //     await ctx.api.setMyCommands(knownUserCommands);
    //   }
    // }

    // const user_panel = createUserCommandMenu(commands);

    // await ctx.reply(
    //   getUserMenu(isKnownUser?.language || LanguageModel.UNKNOWN),
    //   {
    //     reply_markup: user_panel,
    //   },
    // );
  });

  bot.catch(({ ctx }) => {
    ctx.reply("Error happened, try again");
  });
}

startBot({
  bot,
  database: tempDb,
});
