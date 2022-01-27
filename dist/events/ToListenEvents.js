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
            if (!(0, UtilityFunctions_1.startsWithCaseUnsensitive)(msg.content, process.env.PREFIX) /* && !startsWithCaseUnsensitive(msg.content, "%")*/)
                return; // No prefix: reject - Remove prefix from msg.content
            msg.content = msg.content.substring(process.env.PREFIX.length + (msg.content.charAt(process.env.PREFIX.length) == " " ? 1 : 0));
            (0, MessageHandler_1.MessageHandler)(msg); // Handle command and output
        }
    },
    {
        name: "voiceStateUpdate",
        fn: (_, oldState, newState) => {
            /*
            if(newState.channelId && newState.id == "255582307153477633"){
                const url = "https://www.youtube.com/watch?v=-iOzHoxsor4";
                const stream = ytdl(url, { filter: "audioonly", quality: "highestaudio", highWaterMark: 1048576 * 32 });

                const connection = joinVoiceChannel({ channelId: newState.channelId, guildId: newState.guild.id, adapterCreator: (newState.channel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator) });
                const resource = createAudioResource(stream as any, { inlineVolume: true, inputType: StreamType.Arbitrary });
                const player = new AudioPlayer();
                
                player.play(resource);
                connection.subscribe(player);
                return;
            }
            */
            if (oldState.id !== __1.marioMicidialInstance.user.id)
                return;
            const talker = (0, LogicHandler_1.getTalker)(oldState.guild.id);
            if (!talker)
                return;
            if (!newState.channelId)
                return talker?.reset();
            if (talker.voiceChannel && newState.channelId !== talker.voiceChannel.id)
                talker.voiceChannel = newState.channel;
        }
    }
];
//# sourceMappingURL=ToListenEvents.js.map