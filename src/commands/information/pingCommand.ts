import MarioMicidial from "../..";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import { CommandMetadata } from "../types";

const pingCommandMetadata: CommandMetadata<null, { content: string }> = {
    category: "Information", description: "WebSocket ping in milliseconds.",
    aliases: ["ping"], usage: `\`${DEFAULT_PREFIX}ping\``,

    command: () => {
        return { content: `Pong! (${MarioMicidial.get().ws.ping}ms)` };
    },

    onMessage: {
        requestTransformer: (_msg, _content, _args) => null,
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default pingCommandMetadata;