"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedColor = void 0;
const discord_js_1 = require("discord.js");
const Logger_1 = __importDefault(require("./classes/logging/Logger"));
const onReady_1 = __importDefault(require("./events/onReady"));
const onMessageCreate_1 = __importDefault(require("./events/onMessageCreate"));
const onVoiceStateUpdate_1 = __importDefault(require("./events/onVoiceStateUpdate"));
exports.embedColor = (_a = Number.parseInt(process.env.EMBED_COLOR)) !== null && _a !== void 0 ? _a : "Random";
class MarioMicidial extends discord_js_1.Client {
    constructor() {
        var _a;
        super({ makeCache: MarioMicidial.makeCache, intents: MarioMicidial.intents });
        this.init = () => {
            Logger_1.default.info(`Deployment started on env [${process.env.NODE_ENV}] and version [${this.version}]`);
            this.login(process.env.TOKEN);
            this.once("ready", onReady_1.default);
            Logger_1.default.info("Listening on event 'ready'");
            this.on("messageCreate", onMessageCreate_1.default);
            Logger_1.default.info("Listening on event 'messageCreate'");
            this.on("voiceStateUpdate", onVoiceStateUpdate_1.default);
            Logger_1.default.info("Listening on event 'voiceStateUpdate'");
        };
        this.version = (_a = process.env.VERSION) !== null && _a !== void 0 ? _a : "SNAPSHOT";
        this.embedColor = exports.embedColor;
    }
    static get() {
        if (!MarioMicidial.instance)
            MarioMicidial.instance = new MarioMicidial();
        return MarioMicidial.instance;
    }
    updatePresence() {
        var _a;
        (_a = this.user) === null || _a === void 0 ? void 0 : _a.setPresence({
            activities: [{
                    type: discord_js_1.ActivityType.Listening,
                    name: `to Pippz`
                }],
            status: 'idle'
        });
    }
}
MarioMicidial.makeCache = discord_js_1.Options.cacheWithLimits({
    MessageManager: 25,
    GuildBanManager: 0,
    BaseGuildEmojiManager: 0,
    GuildEmojiManager: 0,
    GuildInviteManager: 0,
    GuildStickerManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    ApplicationCommandManager: 0,
    PresenceManager: 0,
    StageInstanceManager: 0
});
MarioMicidial.intents = [
    discord_js_1.GatewayIntentBits.MessageContent,
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
    discord_js_1.GatewayIntentBits.GuildIntegrations,
    discord_js_1.GatewayIntentBits.GuildInvites,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.GuildMessageReactions,
    discord_js_1.GatewayIntentBits.GuildMessageTyping,
    discord_js_1.GatewayIntentBits.GuildVoiceStates,
    discord_js_1.GatewayIntentBits.GuildWebhooks
];
exports.default = MarioMicidial;
if (require.main === module) {
    MarioMicidial.get().init();
}
