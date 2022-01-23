"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const Logger_1 = require("../classes/Logger");
const applyAlias_1 = require("../utils/applyAlias");
const LogicHandler_1 = require("./LogicHandler");
const logger = new Logger_1.ClassLogger("MessageHandler");
/* ==== Handler [Core] ==================================================================================================================== */
const MessageHandler = async (msg) => {
    const args = msg.content.split(/[\n ]+/); // Command arguments without prefix
    if (!args[0])
        return msg.reply("Cazzo vuoi?"); // Prefix only: reject
    let cmdName = args.shift().toLowerCase();
    let cmd = commandHandlerMap[cmdName]; // Get commandHandler
    if (!cmd) {
        args.unshift(cmdName);
        cmdName = "say";
        cmd = commandHandlerMap[cmdName];
    }
    logger.log(`${msg.guild.name} - ${msg.author.username}: ${msg.content}`); // Log command
    try {
        await cmd(msg, LogicHandler_1.logicHandler[cmdName], ...args); // Call internal command with parameters given directly by users
    }
    catch (e) {
        logger.error(`Error during the execution of ${cmdName}: ` + e.message);
    }
};
exports.MessageHandler = MessageHandler;
/* ==== Command Handlers ================================================================================================================== */
const commandHandlerMap = {
    "ping, invite, help, languages, langs": (msg, cmd, arg) => msg.reply(cmd.fn(arg)),
    "info": (msg, cmd) => msg.reply(cmd.fn(msg.guildId)),
    "j, join, l, leave, v, volume, s, skip, sa, ss, skipall, lang, language, voice, ibm, delete, say": (msg, cmd, ...args) => cmd.fn(msg, args)
};
/* ==== Post Processing =================================================================================================================== */
applyAlias_1.applyAlias(commandHandlerMap);
//# sourceMappingURL=MessageHandler.js.map