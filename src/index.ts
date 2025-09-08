import { Client, CacheFactory, ColorResolvable, GatewayIntentBits, Options, ActivityType } from 'discord.js';
import Logger from './classes/logging/Logger';
import onReady from './events/onReady';
import onMessageCreate from './events/onMessageCreate';
import onVoiceStateUpdate from './events/onVoiceStateUpdate';


/* ==== TYPE DEFINITION ===================================================== */
/** Constant for all embeds sent, but not meaningful as bot instance propery. */
export const embedColor: ColorResolvable = Number.parseInt(process.env.EMBED_COLOR as string) ?? "Random";

/** Main class that rapresents the bot itself.
 *  On init, logs the bot into Discord and starts listening to the events */
export default class MarioMicidial extends Client {

    /* ==== STATIC PROPERTIES =============================================== */
    /** Define caching policies - do not cache anything that is not used. */
    private static readonly makeCache: CacheFactory = Options.cacheWithLimits({
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

    /** Define permissions needed for the bot to operate.
     *  Old intents: [ 'GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES' ] */
    private static readonly intents: GatewayIntentBits[] = [
    
        // Messages
        GatewayIntentBits.MessageContent,

        // Guild
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks
    ]

    /* ==== SINGLETON ======================================================= */
    /** Private constructor to ensure no une instance the bot again.
     *  Configuration is defined in the class itself and used directly. */
    private constructor() {
        super({ makeCache: MarioMicidial.makeCache, intents: MarioMicidial.intents });
        this.version = process.env.VERSION ?? "SNAPSHOT";
        this.embedColor = embedColor;
    }
    /** Singleton bot instance - initialized and retrieved with Self::get(). */
    private static instance: MarioMicidial;

    /** Method to be used to create / retrieve the singleton bot instance. */
    public static get() {
        if(!MarioMicidial.instance) MarioMicidial.instance = new MarioMicidial();
        return MarioMicidial.instance;
    }

    /* ==== INSTANCE PROPERTIES & METHODS =================================== */
    /** Current bot release version. */
    public version: string;
    /** Color to be used for all of the created embeds. */
    public embedColor: ColorResolvable;

    /** Define bot startup behaviour - login and start listening to events. */
    public init = () => {
        Logger.info(`Deployment started on env [${process.env.NODE_ENV}] and version [${this.version}]`);

        // Bot login
        this.login(process.env.TOKEN);

        // On bot login event, execute only once     
        this.once("ready", onReady);
        Logger.info("Listening on event 'ready'");

        // On message created (sent), execute every time  
        this.on("messageCreate", onMessageCreate);
        Logger.info("Listening on event 'messageCreate'");

        // On message created (sent), execute every time  
        this.on("voiceStateUpdate", onVoiceStateUpdate);
        Logger.info("Listening on event 'voiceStateUpdate'");
    }

    /** Update bot custom activity and yellow status (presence) on startup */
    public updatePresence() {
        this.user?.setPresence({
            activities: [{
                type: ActivityType.Listening,
                name: `to Pippz`
            }],
            status: 'idle'
        });
    }
}


/* ==== INIT ================================================================ */
/** This block runs if file is started directly, not when imported.
 *  Used so that the slash command registration can be triggered without
 *  initializing the application. */
if (require.main === module) {
    MarioMicidial.get().init();
}

/*
process.on("unhandledRejection", e => {
	Logger.error(`Unhandled promise rejection: ${e}`);
})*/