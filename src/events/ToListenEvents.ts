/* ==== Imports =========================================================================================================================== */
import { Message, VoiceState } from "discord.js";


import { Event } from "../interfaces/Event"
import { MarioMicidial } from "../classes/MarioMicidial";
import { MessageHandler } from "../commands/MessageHandler";
import { startsWithCaseUnsensitive } from "../utils/UtilityFunctions";
import { Talker } from "../classes/Talker";
import { getTalker } from "../commands/LogicHandler";
import { marioMicidialInstance } from "..";

/* ==== Events ============================================================================================================================ */
export const toListenEvents: Event[] = [
    {   // Event triggered on every text message
        name: "messageCreate",
        fn: async (_: MarioMicidial, msg: Message) => {
            if(msg.author.id == "827489562707755078") return msg.react("🖕🏿").catch(() => {});
            if(msg.author.bot) return;                                                  // Bot message: reject
            
            if (!startsWithCaseUnsensitive(msg.content, process.env.PREFIX)/* && !startsWithCaseUnsensitive(msg.content, "%")*/) return;    // No prefix: reject - Remove prefix from msg.content
            msg.content = msg.content.substring(process.env.PREFIX.length + (msg.content.charAt(process.env.PREFIX.length) == " " ? 1 : 0));

            MessageHandler(msg);                                                        // Handle command and output
        }
    },
    {
        name: "voiceStateUpdate",
        fn: (_: VoiceState, oldState: VoiceState, newState: VoiceState) => {

            const guildId: string = oldState.guild.id;
            const talker: Talker = getTalker(guildId);

            if(!talker || oldState.id !== marioMicidialInstance.user.id) return;
            
            if(!newState.channelId) return talker?.reset();
            if(talker.voiceChannel && newState.channelId !== talker.voiceChannel.id) talker.voiceChannel = newState.channel;
        }
    }
];