import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { getOrCreateTalker, LANGUAGE_TYPE, setLanguage, Talker } from "../../classes/Talker";


const languageCommandMetadata: CommandMetadata<{ language: string, guildId: string }, string> = {
    category: "TTS", description: "Changes the language used for the TTS.",
    aliases: ["language2", "lang2"], usage: `\`${DEFAULT_PREFIX}language2 ja\``,
    hidden: true,
    
    command: ({ language, guildId }) => {
        /*
        ! IT WAS DISABLED, DOESN'T WORK

        language = Talker.supportedLanguagesV2[language]
        if(!language) {
            return `Invalid language. **${DEFAULT_PREFIX}languages** for a list of valid languages and voices.`;
        }
        const talker: Talker = getOrCreateTalker(guildId);
        talker.language = language;
        talker.languageType = LANGUAGE_TYPE.soundoftext;
        */
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