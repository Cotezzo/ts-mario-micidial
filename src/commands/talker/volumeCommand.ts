import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer } from "../../events/onMessageCreate";
import { getTalker } from "../../classes/Talker";

const VOLUME_REGEX: RegExp = /[0-9]{1,2}(\.[0-9])?/;

const volumeCommandMetadata: CommandMetadata<{ volume: number, guildId: string }, void> = {
    category: "TTS", description: "Changes the volume of the voice [Default: 1].",
    aliases: ["volume", "v"], usage: `\`${DEFAULT_PREFIX}volume 2\``,
    
    command: ({ volume, guildId }) => {
        getTalker(guildId)?.setVolume(volume);
    },

    onMessage: {
        requestTransformer: (msg, _content, _args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            if(!VOLUME_REGEX.test(_content))
                throw new Error(`Invalid volume provided`);

            return { volume: parseFloat(_content), guildId: msg.guildId }
        },
        responseTransformer: msgReactResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default volumeCommandMetadata;