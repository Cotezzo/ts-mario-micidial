import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReactResponseTransformer, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { getTalker } from "../../classes/Talker";


const deleteCommandMetadata: CommandMetadata<{ toggle: boolean | undefined, guildId: string }, string> = {
    category: "TTS", description: "Sets wether or not the bot will delete the messages after reading them.",
    aliases: ["autodelete", "delete"], usage: `\`${DEFAULT_PREFIX}delete true\``,
    
    command: ({ toggle, guildId }) => {
        if(toggle === undefined) return `Invalid setting. Use \`off|0|false\` and \`on|1|true\`.`;

        const talker = getTalker(guildId);
        if(!talker) throw Error("No Talker instance found");

        // if(!risp.guild.me.permissionsIn("MANAGE_MESSAGES")) return risp.reply(`I can't delete messages anyway, I don't have permissions.`);

        talker.deleteMessages = toggle;
        return `Autodeletion successfully changed to **${toggle}**.`;
    },

    onMessage: {
        requestTransformer: (msg, _content, args) => {
            if(!args?.length) throw Error("Missing input parameter");
            if(!msg.guildId) throw Error("Message not from guild");

            const input = args[0].toLowerCase();
            let toggle: boolean | undefined = undefined;
            if (/^(on)|1|(true)$/.test(input)) toggle = true;
            else if (/^(off)|0|(false)$/.test(input)) toggle = false;
            return { toggle, guildId: msg.guildId }
        },
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default deleteCommandMetadata;