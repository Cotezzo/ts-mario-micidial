import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer } from "../../events/onMessageCreate";
import { getTalker } from "../../classes/Talker";


const skipAllCommandMetadata: CommandMetadata<{ guildId: string }, void> = {
    category: "TTS", description: "Skips all currently queued texts.",
    aliases: ["skipall", "ss", "sa"], usage: `\`${DEFAULT_PREFIX}skipall\``,
    
    command: ({ guildId }) => {
        getTalker(guildId)?.skipAll()
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
export default skipAllCommandMetadata;