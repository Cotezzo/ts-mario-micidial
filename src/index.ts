/* ==== Imports =========================================================================================================================== */
import { MarioMicidial } from './classes/MarioMicidial';

import dotenv from "dotenv";    // Configure process.env globally
import { Options } from 'discord.js';
dotenv.config();

/* ==== Core ============================================================================================================================== */
export const marioMicidialInstance: MarioMicidial = new MarioMicidial({
    intents: [ 'GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES' ],
    makeCache: Options.cacheWithLimits({ MessageManager: 0, GuildBanManager: 0, BaseGuildEmojiManager: 0, GuildEmojiManager: 0, GuildInviteManager: 0, GuildStickerManager: 0, ReactionManager: 0, ReactionUserManager: 0, ApplicationCommandManager: 0, PresenceManager: 0, StageInstanceManager: 0 })
});
marioMicidialInstance.init();