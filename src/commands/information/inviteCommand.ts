import { DEFAULT_PREFIX, msgReactErrorHandler, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { CommandMetadata } from "../types";

const inviteCommandMetadata: CommandMetadata<null, { content: string }> = {
    category: "Information", description: "Sends the invite link of the bot.",
    aliases: ["invite", "inv"], usage: `\`${DEFAULT_PREFIX}invite\``,

    command: () => {
        return { content: "Inviation link: https://discord.com/oauth2/authorize?client_id=827996006871728159" };
    },

    onMessage: {
        requestTransformer: (_msg, _content, _args) => null,
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default inviteCommandMetadata;