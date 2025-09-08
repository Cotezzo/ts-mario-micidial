import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { LANGUAGE_TYPE, setLanguage, Talker } from "../../classes/Talker";


const languageCommandMetadata: CommandMetadata<{ language: string, guildId: string }, string> = {
    category: "TTS", description: "Changes the language used for the TTS.",
    aliases: ["language", "lang"], usage: `\`${DEFAULT_PREFIX}language ja\``,
    
    command: ({ language, guildId }) => {
        console.log("audio")
        if(!Talker.supportedLanguages.has(language)) {
            return `Invalid language. **${DEFAULT_PREFIX}languages** for a list of valid languages and voices.`;
        }
        setLanguage(language, LANGUAGE_TYPE.google, guildId);
        return `Language successfully changed to **${language}**.`;
    },

    onMessage: {
        requestTransformer: (msg, _content, args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            return { language: args[0]?.toLowerCase(), guildId: msg.guildId }
        },
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default languageCommandMetadata;