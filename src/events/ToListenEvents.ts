/* ==== Imports =========================================================================================================================== */
import { Message, VoiceState } from "discord.js";


import { Event } from "../interfaces/Event"
import { MarioMicidial } from "../classes/MarioMicidial";
import { MessageHandler } from "../commands/MessageHandler";
import { startsWithCaseUnsensitive } from "../utils/UtilityFunctions";
import { Talker } from "../classes/Talker";
import { getTalker } from "../commands/LogicHandler";
import { marioMicidialInstance } from "..";
import { AudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel, StreamType } from "@discordjs/voice";
import ytdl from "ytdl-core";

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
        fn: (_: any, oldState: VoiceState, newState: VoiceState) => {

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

            if(oldState.id !== marioMicidialInstance.user.id) return;

            const talker: Talker = getTalker(oldState.guild.id);

            if(!talker) return;
            
            if(!newState.channelId) return talker?.reset();
            if(talker.voiceChannel && newState.channelId !== talker.voiceChannel.id) talker.voiceChannel = newState.channel;
        }
    }
];