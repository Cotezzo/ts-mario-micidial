import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { LANGUAGE_TYPE, setLanguage, Talker } from "../../classes/Talker";
import { capitalizeFirstLetter } from "../../utils/UtilityFunctions";
import Logger from "../../classes/logging/Logger";


const vpoceFreeTTSCommandMetadata: CommandMetadata<{ voice: string, guildId: string }, string> = {
    category: "TTS", description: "Changes the voice used for the TTS.",
    aliases: ["voice"], usage: `\`${DEFAULT_PREFIX}voice ja\``,
    
    command: ({ voice, guildId }) => {
        Logger.info("Selected voice: " + voice)
        if(!Talker.supportedVoices[voice]) {
            return `Invalid voice. **${DEFAULT_PREFIX}languages** for a list of valid languages and voices.`;
        }
        setLanguage(voice, LANGUAGE_TYPE.freetts, guildId);
        return `Voice successfully changed to **${voice}**.`;
    },

    onMessage: {
        requestTransformer: (msg, _content, args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            return { voice: capitalizeFirstLetter(args[0]?.toLowerCase()), guildId: msg.guildId }
        },
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default vpoceFreeTTSCommandMetadata;