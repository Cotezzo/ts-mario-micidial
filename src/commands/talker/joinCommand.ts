import { Message } from "discord.js";
import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer } from "../../events/onMessageCreate";
import { getOrCreateTalker } from "../../classes/Talker";


const joinCommandMetadata: CommandMetadata<{ i: Message, guildId: string }, void> = {
    category: "TTS", description: "The bot will join your voice channel. If there's something in the queue, it will play.",
    aliases: ["join", "j"], usage: `\`${DEFAULT_PREFIX}join\``,
    
    command: ({ i, guildId }) => {
        getOrCreateTalker(guildId)?.tryToPlay(i)
    },

    onMessage: {
        requestTransformer: (msg, _content, _args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            return { i: msg, guildId: msg.guildId }
        },
        responseTransformer: msgReactResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default joinCommandMetadata;