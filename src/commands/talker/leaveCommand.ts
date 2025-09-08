import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer } from "../../events/onMessageCreate";
import { getTalker } from "../../classes/Talker";


const leaveCommandMetadata: CommandMetadata<{ guildId: string }, void> = {
    category: "TTS", description: "Kicks the bot out from the voice channel, but doesn't clear the current queue and other informations.",
    aliases: ["leave", "l", "clear", "stop", "fanculo"], usage: `\`${DEFAULT_PREFIX}leave\``,
    
    command: ({ guildId }) => {
        getTalker(guildId)?.reset()
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
export default leaveCommandMetadata;