import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer } from "../../events/onMessageCreate";
import { getTalker } from "../../classes/Talker";


const skipCommandMetadata: CommandMetadata<{ guildId: string }, void> = {
    category: "TTS", description: "Skips the current text.",
    aliases: ["skip", "s"], usage: `\`${DEFAULT_PREFIX}skip\``,
    
    command: ({ guildId }) => {
        getTalker(guildId)?.skipText()
    },

    onMessage: {
        requestTransformer: (msg, _content, _args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            return { guildId: msg.guildId }
        },
        responseTransformer: msgReactResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default skipCommandMetadata;