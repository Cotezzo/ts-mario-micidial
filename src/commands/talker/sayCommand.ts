import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, ignoreableMsgReactResponseTransformer, msgReactErrorHandler, msgReactResponseTransformer } from "../../events/onMessageCreate";
import { getOrCreateTalker } from "../../classes/Talker";
import { Message } from "discord.js";
import Logger from "../../classes/logging/Logger";


const sayCommandMetadata: CommandMetadata<{ content: string, guildId: string, i: Message }, boolean> = {
    category: "TTS", description: "TALK!!!!!!!!!!!!",
    aliases: ["say"], usage: `\`${DEFAULT_PREFIX}say this is an example message\`\
    ${DEFAULT_PREFIX}this is another example    \`// This command can be used without the name!\``,

    command: ({ content, guildId, i }) => {
        const talker = getOrCreateTalker(guildId);

        // Aggiungo all'oggetto la frase da leggere, assieme ad un nome univoco
        talker.addText(i, content);

        // Se è impostato per farlo, elimina il messaggio
        if(talker.deleteMessages) {
            i.delete().catch(() => {});
            return true;
        }
        return false;
    },

    onMessage: {
        requestTransformer: (msg, _content, args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            if(!args?.length) throw Error("Missing message content");

            return { content: args.join(" "), guildId: msg.guildId, i: msg }
        },
        responseTransformer: ignoreableMsgReactResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default sayCommandMetadata;