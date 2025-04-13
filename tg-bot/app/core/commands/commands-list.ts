import { BotCommand } from "@grammyjs/types";

export const knownUserCommands: BotCommand[] = [
  {
    command: "/main",
    description: "Order product",
  },
  {
    command: "/help",
    description: "Get help",
  },
];

export const unknownUserCommands: BotCommand[] = [
  {
    command: "/start",
    description: "Start bot",
  },
  {
    command: "/help",
    description: "Get help",
  },
];
