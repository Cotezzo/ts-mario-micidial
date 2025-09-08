import { Message, MessagePayload, MessageReaction, MessageReplyOptions } from "discord.js";
import Context from "../classes/logging/Context";
import Logger from "../classes/logging/Logger";
import { CommandMetadata } from "../commands/types";
import { commandMetadataMap } from "../commands/registration";


/** Default prefix that can be used by users to activate text commands.
 *  If default prefix is not defined in the environment, use "ham". */
export const DEFAULT_PREFIX: string = process.env.PREFIX ?? "+";
const DEFAULT_PREFIX_REGEX = new RegExp(`^(${escapeRegExp(DEFAULT_PREFIX)})`);
const DEFAULT_PREFIX_REPLACE_REGEX = new RegExp(`^(${escapeRegExp(DEFAULT_PREFIX)})\\s?`, "i");
const VALID_PREFIX_REGEX: RegExp = /^\w{0,30}$/;

/** Escapes special characters so they are not interpreted by the regexp. */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Before exporting, wrap event logic in context init for versbose logging. */
export default function (msg: Message): void {
    Context.initialize({ userId: msg.author.username, serverId: msg.guildId || undefined }, () => onMessageCreate(msg));
}


/** Handle newly created message and reply if a command is called. */
async function onMessageCreate(msg: Message): Promise<void> {
    // If the message author is a bot, ignore
    if (msg.author.bot) return;

    // Normalize message content for better parsing
    const lowerCaseContent: string = msg.content.toLowerCase();
    
    // If message doesn't start with default prefix, return
    if (!DEFAULT_PREFIX_REGEX.test(lowerCaseContent)) return;

    // Remove prefix (and optional following space) from message start
    // and get all the words as command and arguments
    let content = msg.content.replace(DEFAULT_PREFIX_REPLACE_REGEX, "");
    const args = content.split(/[\n ]+/);

    // If there's no arg, there's no command; return
    if (!args.length) {
        msgReplyResponseTransformer(msg, { content: "Cazzo vuoi?" });
        return
    }

    // Extract command name from first argument
    // If there is no command, use the "say" command by default
    const commandName: string | undefined = args[0].toLocaleLowerCase();

    // If command doesn't exist or it can't be invoked with messages, return
    const commandMetadata: CommandMetadata<any, any> | undefined = commandMetadataMap[commandName];
    if (!commandMetadata) {
        executeCommand(commandMetadataMap["say"], msg, content, args);
        return;
    }

    if(!commandMetadata.onMessage || commandMetadata.hidden) return;

    // Validate name characters to avoid errors during RegExp construction
    //if(!VALID_PREFIX_REGEX.test(commandName)) return;

    // Remove command name and space from args and content before passing it
    args.shift();
    content = content.replace(new RegExp(`^(${commandName})\\s?`, "i"), "");
    
    // Add command name to context and log full message
    Logger.info(msg.content);
    executeCommand(commandMetadata, msg, content, args);
}



/** The callback function is generic and only takes the command response
 *  as parameter - in order to use the message, bring it into the callback
 *  method scope creating the function when needed. */
export function msgReplyResponseTransformer(msg: Message, reply: string | MessagePayload | MessageReplyOptions) {
    return msg.reply(reply)
        .catch(e => Logger.error("msgReplyResponseTransformer error", e));
}
/** Similar to msgReplyResponseTransformer, but only reacts with an emoji
 *  when the command has been correctly executed. */
export function msgReactResponseTransformer(msg: Message) {
    return msg.react("🤝")
        .catch(e => Logger.error("msgReactResponseTransformer error", e));
}
/** Similar to msgReplyResponseTransformer, but only reacts with an emoji
 *  when the command has been correctly executed. */
export function ignoreableMsgReactResponseTransformer(msg: Message, ignore: boolean = false) {
    if(ignore) return;
    return msgReactResponseTransformer(msg);
}

/** Default error handler method to be used for commands that can be executed
 *  via the onMessageCreateTransformer.
 *  It reacts to the original user message with an emoji. */
export function msgReactErrorHandler(msg: Message, e: Error): Promise<void | MessageReaction> {
    Logger.error("Text command execution error\n", e);
    return msg.react("902680070018175016") //  Old emoji: "❌"
        .catch(e => Logger.error("msgReactErrorHandler error", e));
}

async function executeCommand<I, O>({ aliases, command, onMessage }: CommandMetadata<I, O>, msg: Message, content: string, args: string[]) {
    // Core text command logic:
    // - Parse content/args into proper input
    // - Pass input to main command logic and retrieve output
    // - Use output to create a response to the user (if needed)
    // - Handle exceptions creating a response to the user (if needed)
    Context.set("command-id", aliases[0]);
    try {
        const input = await onMessage!.requestTransformer(msg, content, args);
        Logger.debug(`requestTransformer executed, input: ${JSON.stringify(input)}`);
        const output = await command(input);
        Logger.debug(`command executed, output: ${JSON.stringify(output)}`);
        await onMessage!.responseTransformer(msg, output);
        Logger.debug(`responseTransformer executed`);
    } catch (e: any) {
        await onMessage!.errorHandler(msg, e);
    }
}