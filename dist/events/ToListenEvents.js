"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toListenEvents = void 0;
const MessageHandler_1 = require("../commands/MessageHandler");
const UtilityFunctions_1 = require("../utils/UtilityFunctions");
const LogicHandler_1 = require("../commands/LogicHandler");
const __1 = require("..");
/* ==== Events ============================================================================================================================ */
exports.toListenEvents = [
    {
        name: "messageCreate",
        fn: async (_, msg) => {
            if (msg.author.id == "827489562707755078")
                return msg.react("🖕🏿").catch(() => { });
            if (msg.author.bot)
                return; // Bot message: reject
            if (!UtilityFunctions_1.startsWithCaseUnsensitive(msg.content, process.env.PREFIX) /* && !startsWithCaseUnsensitive(msg.content, "%")*/)
                return; // No prefix: reject - Remove prefix from msg.content
            msg.content = msg.content.substring(process.env.PREFIX.length + (msg.content.charAt(process.env.PREFIX.length) == " " ? 1 : 0));
            MessageHandler_1.MessageHandler(msg); // Handle command and output
        }
    },
    {
        name: "voiceStateUpdate",
        fn: (_, oldState, newState) => {
            const guildId = oldState.guild.id;
            const talker = LogicHandler_1.getTalker(guildId);
            if (!talker || oldState.id !== __1.marioMicidialInstance.user.id)
                return;
            if (!newState.channelId)
                return talker?.reset();
            if (talker.voiceChannel && newState.channelId !== talker.voiceChannel.id)
                talker.voiceChannel = newState.channel;
        }
    }
];
//# sourceMappingURL=ToListenEvents.js.map