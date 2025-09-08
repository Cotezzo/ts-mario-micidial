import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { LANGUAGE_TYPE, setLanguage, Talker } from "../../classes/Talker";
import { capitalizeFirstLetter } from "../../utils/UtilityFunctions";


const voiceIbmCommandMetadata: CommandMetadata<{ voice: string, guildId: string }, string> = {
    category: "TTS", description: "Changes the voice used for the TTS.",
    aliases: ["voiceibm"], usage: `\`${DEFAULT_PREFIX}voice ja\``,
    
    command: ({ voice, guildId }) => {
        if(!Talker.supportedIbmVoices[voice]) {
            return `Invalid voice. **${DEFAULT_PREFIX}languages** for a list of valid languages and voices.`;
        }
        setLanguage(voice, LANGUAGE_TYPE.ibm, guildId);
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
export default voiceIbmCommandMetadata;