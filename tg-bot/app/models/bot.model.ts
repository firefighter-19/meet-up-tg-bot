import { Api, Bot, Context, RawApi } from "grammy";

export type BotModel = Bot<Context, Api<RawApi>>;
