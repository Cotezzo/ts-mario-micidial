/* ==== Imports =========================================================================================================================== */
import { Message } from "discord.js";
import { ClassLogger } from "../classes/Logger";
import { MessageCommandHandlerMap } from "../interfaces/CommandHandlers";
import { Command } from "../interfaces/CommandLogic";
import { applyAlias } from "../utils/applyAlias";
import { logicHandler } from "./LogicHandler";



const logger = new ClassLogger("MessageHandler");

/* ==== Handler [Core] ==================================================================================================================== */
export const MessageHandler = async (msg: Message): Promise<any> => {
    const args = msg.content.split(/[\n ]+/);                                                   // Command arguments without prefix
    if (!args[0]) return msg.reply("Cazzo vuoi?");                                              // Prefix only: reject

    let cmdName = args.shift().toLowerCase();
    let cmd = commandHandlerMap[cmdName];                                          // Get commandHandler
    if(!cmd) {
        args.unshift(cmdName);
        cmdName = "say";
        cmd = commandHandlerMap[cmdName];
    }

    logger.log(`${msg.guild.name} - ${msg.author.username}: ${msg.content}`);                   // Log command

    try{
        await cmd(msg, logicHandler[cmdName], ...args);                                               // Call internal command with parameters given directly by users
    }catch(e){
        logger.error(`Error during the execution of ${cmdName}: ` + e.message);
    }
}

/* ==== Command Handlers ================================================================================================================== */
const commandHandlerMap: MessageCommandHandlerMap = {
    "ping, invite, help, languages, langs": (msg, cmd: Command, arg: string) => msg.reply(cmd.fn(arg)),
    "info": (msg, cmd: Command) => msg.reply(cmd.fn(msg.guildId)),
    "j, join, l, leave, v, volume, s, skip, sa, ss, skipall, lang, language, voice, ibm, delete, say": (msg, cmd: Command, ...args: string[]) => cmd.fn(msg, args)
}

/* ==== Post Processing =================================================================================================================== */
applyAlias(commandHandlerMap);