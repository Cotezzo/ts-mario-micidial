import { CommandInteraction, Message } from "discord.js";
import { Command } from "./CommandLogic";
export interface MessageCommandHandlerMap {
    [command: string]: (msg: Message, cmdName: Command, ...args: any) => any;
}
export interface CommandInteractionHandlerMap {
    [command: string]: (interaction: CommandInteraction, cmdName: string, ...args: any) => any;
}
