"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marioMicidialInstance = void 0;
/* ==== Imports =========================================================================================================================== */
const MarioMicidial_1 = require("./classes/MarioMicidial");
const dotenv_1 = __importDefault(require("dotenv")); // Configure process.env globally
const discord_js_1 = require("discord.js");
dotenv_1.default.config();
/* ==== Core ============================================================================================================================== */
exports.marioMicidialInstance = new MarioMicidial_1.MarioMicidial({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
    makeCache: discord_js_1.Options.cacheWithLimits({ MessageManager: 0, GuildBanManager: 0, BaseGuildEmojiManager: 0, GuildEmojiManager: 0, GuildInviteManager: 0, GuildStickerManager: 0, ReactionManager: 0, ReactionUserManager: 0, ApplicationCommandManager: 0, PresenceManager: 0, StageInstanceManager: 0 })
});
exports.marioMicidialInstance.init();
//# sourceMappingURL=index.js.map