/* ==== Imports =========================================================================================================================== */
import { ButtonInteraction, CommandInteraction, CommandInteractionOptionResolver, GuildMember, Message, StageChannel, VoiceChannel } from "discord.js";
import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, entersState, getVoiceConnection, joinVoiceChannel, StreamType, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";

import { ClassLogger } from "./Logger";

import { promisify } from "util";
import axios from "axios";
const wait = promisify(setTimeout);

import { v4 } from "uuid";

const logger: ClassLogger = new ClassLogger("Talker");

const ibmHeaders = { "cookie": "tts-demo=s%3A6OQEZy9xbWIlSU3DC5KaNGqvWMrrQlYC.kiboEHFQ0cqTmTmsrrBo3AhL3%2B9zSW4tQGj4Zhl00Z0;" };

export const LANGUAGE_TYPE = {
    google: 0,
    freetts: 1,
    soundoftext: 2,
    ibm: 3
};

/* ==== Class ============================================================================================================================= */
export class Talker {

    /* ==== Voices and Languages ================== */
    public static supportedLanguages = new Set([
        'af', 'ar', 'bg', 'bn', 'bs',    'ca',
        'cs', 'cy', 'da', 'de', 'el',    'en',
        'eo', 'es', 'et', 'fi', 'fr',    'gu',
        'hi', 'hr', 'hu', 'id', 'is',    'it',
        'ja', 'jv', 'km', 'kn', 'ko',    'ku',
        'la', 'lv', 'mk', 'ml', 'mr',    'ms',
        'my', 'ne', 'nl', 'no', 'pl',    'pt',
        'ro', 'ru', 'si', 'sk', 'sq',    'su',
        'sv', 'sw', 'ta', 'te', 'th',    'tl',
        'tr', 'uk', 'ur', 'vi', 'zh-cn', 'zh-tw'
    ]);
    // REMOVED: am, az, hy, eu, be, ceb, co, fy, ka, gl, ht, ha, haw, iw, hmn, ig, ga, kk, rw, ky, lo, lt, lb
    // mg, mt, mi, mn, ny, or, ps, fa, pa, sm, gd, st, sn, sd, sr, sl, so, tg, tt, tk, xh, yi, yo, ug, uz, zu

    public static supportedVoices = {
        "Salli": { value: "Salli_Female", language: "en-US" },
        "Joanna": { value: "Joanna_Male", language: "en-US" },
        "Matthew": { value: "Matthew_Male", language: "en-US" },
        "Ivy": { value: "Ivy_Female", language: "en-US" },
        "Justin": { value: "Justin_Male", language: "en-US" },
        "Kendra": { value: "Kendra_Female", language: "en-US" },
        "Kimberly": { value: "Kimberly_Female", language: "en-US" },
        "Joey": { value: "Joey_Male", language: "en-US" },
        "Zeina": { value: "Zeina_Female", language: "ar-XA" },
        "Naja": { value: "Naja_Female", language: "da-DK" },
        // "Mads": { value: "Mads_Male", language: "nl-NL" },
        "Lotte": { value: "Lotte_Female", language: "nl-NL" },
        "Ruben": { value: "Ruben_Male", language: "nl-NL" },
        // "Nicole": { value: "Nicole_Female", language: "en-AU" },
        // "Russell": { value: "Russell_Male", language: "en-AU" },
        // "Olivia": { value: "Olivia_Male", language: "en-AU" },
        "Raveena": { value: "Raveena_Female", language: "en-IN" },
        "Aditi": { value: "Aditi_Female", language: "en-IN" },
        "Amy": { value: "Amy_Female", language: "en-GB" },
        "Brian": { value: "Brian_Male", language: "en-GB" },
        "Emma": { value: "Emma_Female", language: "en-GB" },
        "Geraint": { value: "Geraint_Male", language: "en-GB-WL" },
        "Mathieu": { value: "Mathieu_Male", language: "fr-FR" },
        "Celine": { value: "Celine_Female", language: "fr-FR" },
        "Lea": { value: "Lea_Female", language: "fr-FR" },
        "Chantal": { value: "Chantal_Female", language: "fr-CA" },
        "Hans": { value: "Hans_Male", language: "de-DE" },
        "Marlene": { value: "German_Female", language: "de-DE" },
        "Vicki": { value: "Vicki_Female", language: "de-DE" },
        "Karl": { value: "Karl_Male", language: "is-IS" },
        "Dora": { value: "Dora_Female", language: "is-IS" },
        "Giorgio": { value: "Giorgio_Male", language: "it-IT" },
        "Bianca": { value: "Bianca_Female", language: "it-IT" },
        "Carla": { value: "Carla_Female", language: "it-IT" },
        "Takumi": { value: "Takumi_Male", language: "ja-JP" },
        "Mizuki": { value: "Mizuki_Female", language: "ja-JP" },
        "Seoyeon": { value: "Seoyeon_Female", language: "ko-KR" },
        "Liv": { value: "Liv_Female", language: "nb-NO" },
        "Jacek": { value: "Jacek_Male", language: "pl-PL" },
        "Ewa": { value: "Ewa_Female", language: "pl-PL" },
        "Jan": { value: "Jan_Male", language: "pl-PL" },
        "Maja": { value: "Maja_Female", language: "pl-PL" },
        "Vitoria": { value: "Vitoria_Female", language: "pt-BR" },
        "Ricardo": { value: "Ricardo_Male", language: "pt-BR" },
        "Camila": { value: "Camila_Female", language: "pt-BR" },
        "Ines": { value: "Ines_Female", language: "pt-PT" },
        "Cristiano": { value: "Cristiano_Male", language: "pt-PT" },
        "Carmen": { value: "Carmen_Female", language: "ro-RO" },
        "Tatyana": { value: "Tatyana_Female", language: "ru-RU" },
        "Maxim": { value: "Maxim_Male", language: "ru-RU" },
        "Lucia": { value: "Lucia_Female", language: "es-ES" },
        "Enrique": { value: "Enrique_Male", language: "es-ES" },
        "Conchita": { value: "Conchita_Female", language: "es-ES" },
        "Mia": { value: "Mia_Female", language: "es-MX" },
        "Penelope": { value: "Penelope_Female", language: "es-US" },
        "Miguel": { value: "Miguel_Male", language: "es-US" },
        "Lupe": { value: "Lupe_Female", language: "es-US" },
        "Astrid": { value: "Astrid_Female", language: "sv-SE" },
        "Filiz": { value: "Filiz_Female", language: "tr-TR" },
        "Gwyneth": { value: "Gwyneth_Female", language: "cy-GB" }
    };

    public static supportedIbmVoices = {
        Omar: { language: "ar", voice: "ar-AR_OmarVoice" },
    
        Wang: { language: "zh", voice: "zh-CN_WangWeiVoice" },
        Zhang: { language: "zh", voice: "zh-CN_ZhangJingVoice" },
        Li: { language: "zh", voice: "zh-CN_LiNaVoice" },
    
        Alena: { language: "cs", voice: "cs-CZ_AlenaVoice" },
    
        Adele: { language: "nl", voice: "nl-BE_AdeleVoice" },
        Bram: { language: "nl", voice: "nl-BE_BramVoice" },
        Emma: { language: "nl", voice: "nl-NL_EmmaVoice" },
        Liam: { language: "nl", voice: "nl-NL_LiamVoice" },
    
        Allison: { language: "en", voice: "en-US_AllisonV3Voice" },
        Emily: { language: "en", voice: "en-US_EmilyV3Voice" },
        Henry: { language: "en", voice: "en-US_HenryV3Voice" },
        Kevin: { language: "en", voice: "en-US_KevinV3Voice" },
        Lisa: { language: "en", voice: "en-US_LisaV3Voice" },
        Michael: { language: "en", voice: "en-US_MichaelV3Voice" },
        Olivia: { language: "en", voice: "en-US_OliviaV3Voice" },
        
        Craig: { language: "en", voice: "en-AU_CraigVoice" },
        Madison: { language: "en", voice: "en-AU_MadisonVoice" },
        Steve: { language: "en", voice: "en-AU_SteveVoice" },
        
        Kate: { language: "en", voice: "en-GB_KateV3Voice" },
        Charlotte: { language: "en", voice: "en-GB_CharlotteV3Voice" },
        James: { language: "en", voice: "en-GB_JamesV3Voice" },
        
        Louise: { language: "fr", voice: "fr-CA_LouiseV3Voice" },
        Renee: { language: "fr", voice: "fr-FR_ReneeV3Voice" },
        Nicolas: { language: "fr", voice: "fr-FR_NicolasV3Voice" },
    
        Birgit: { language: "de", voice: "de-DE_BirgitV3Voice" },
        Dieter: { language: "de", voice: "de-DE_DieterV3Voice" },
        Erika: { language: "de", voice: "de-DE_ErikaV3Voice" },

        Francesca: { language: "it", voice: "it-IT_FrancescaV3Voice" },

        Emi: { language: "ja", voice: "ja-JP_EmiV3Voice" },

        Hyunjun: { language: "ko", voice: "ko-KR_HyunjunVoice" },
        Si: { language: "ko", voice: "ko-KR_SiWooVoice" },
        Yuna: { language: "ko", voice: "ko-KR_YunaVoice" },
        Youngmi: { language: "ko", voice: "ko-KR_YoungmiVoice" },

        Isabela: { language: "pt", voice: "pt-BR_IsabelaV3Voice" },

        Enrique: { language: "es", voice: "es-ES_EnriqueV3Voice" },
        Laura: { language: "es", voice: "es-ES_LauraV3Voice" },

        Sofia: { language: "es", voice: "es-LA_SofiaV3Voice" },

        // Sofia: { language: "es", voice: "es-US_SofiaV3Voice" },

        Ingrid: { language: "sv", voice: "sv-SE_IngridVoice" }
    }

    /* ==== Talk ================================= */
    private textQueue: string[];        // []
    private ttsSpeed: string;           // 1
    public volume: number;              // 1.0
    public language: string;            // it
    public languageType: number;        // LANGUAGE_TYPE: 0, 1, 2
    public deleteMessages: boolean;     // false

    /* ==== Audio ================================ */
    public voiceChannel: VoiceChannel | StageChannel;                  // The current voiceChannel the bot is in
    private connection: VoiceConnection;                                // Voice connection events handler
    private player: AudioPlayer;                                        // Music player
    private resource: AudioResource<null>;                              // Resource - stream that is being played

    /* ==== Functions ============================ */
    public constructor() {
        this.textQueue = [];
        this.volume = 1;
        this.language = "it";
        this.languageType = LANGUAGE_TYPE.google;
        this.ttsSpeed = "1";
        this.deleteMessages = false;
        
        this.player = createAudioPlayer();                              // Brand new AudioPlayer

        this.player.on("stateChange", (_, newState) => logger.info("AudioPlayer state changed to " + newState.status));
        this.player.on("error", (e) => logger.error("AudioPlayer error: " + e.message));
        this.player.on(AudioPlayerStatus.Idle, async () => {
            this.shiftIfEmpty();
            this.speak();
        });

        logger.info("New instance created and listening on AudioPlayer events");
    }

    private shiftIfEmpty = (): void => { if(this.textQueue[0] === "") this.textQueue.shift(); }

    public addText = async (risp: Message | CommandInteraction | ButtonInteraction, text: string) => {
        logger.info("Input: " + text);
        if (!text) return;                                                              // Se non c'è effettivamente roba da aggiungere, torna
        // this.textQueue.push(...text.match(/.{1,200}/g));                                // Altrimenti inseriscile in coda in blocchi da 200
        this.textQueue.push(text);
        this.tryToPlay(risp);

        // if (!serverTexts.connection) {                                                  // Se non è presente una connessione
        //     if (!msg.member.voice.channel) return serverTexts.texts = [];
        //     serverTexts.connection = await serverTexts.voiceChannel.join().catch(err => {msg.channel.send(`An error occurred: "**${err.message}**"`); return null});             //Entra nel canale vocale
        //     if(!serverTexts.connection) return serverTexts.texts = [];                  //Se connection è null (errore durante entrata canale)
        //     serverTexts.speaking = true;
        //     speak();                                                         //Ed inizia la riproduzione
        // } else if (!serverTexts.speaking) {                                             //O se non sta parlando
        //     serverTexts.speaking = true;
        //     speak();
        // }
    }

    public tryToPlay = (risp?: Message | CommandInteraction | ButtonInteraction): Promise<any> | void => {
        if (this.isPlaying()) return;

        // If risp is given, update properties
        if(risp){
            if (!(risp.member instanceof GuildMember)) return;      // To avoid errors in the next line

            const newChannel = risp.member.voice?.channel
            if(!newChannel) return;
            if(this.voiceChannel?.id !== newChannel.id) {
                this.voiceChannel = newChannel;                     // If nothing is playing, set the voiceChannel to the new one
                // Instance new connection
                // TODO: capire se chiudere vecchie connessione
                this.connection = joinVoiceChannel({ channelId: this.voiceChannel.id, guildId: this.voiceChannel.guildId, adapterCreator: (this.voiceChannel.guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator) });
                logger.info("New connection enstablished");
            }
       }

        // If the connection is in idle (the connection exists but is not playing), play - else connect, if the connection is successfull, play.
        if (this.connection && this.player?.state.status === "idle") return this.speak();

        // If the connection is up return - else, instance new connection and play
        if (this.connection && this.connection.state.status != "destroyed") return;


        // Listeners
        this.connection.on("error", () => logger.warn("Connection error"))
        logger.info("Listening on connection event 'error'");

        this.connection.on("stateChange", async (_, newState) => {
            logger.info("Connection state changed to " + newState.status);
            // Handle disconnection
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    /*  If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect, but there is a chance the connection will recover
                        itself if the reason of the disconnect was due to switching voice channels. This is also the same code for the bot being kicked from the voice channel,
                        so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy the voice connection.                           */
                    try {
                        await entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000);    // Probably moved voice channel
                    } catch {
                        this.connection.destroy();                                                      // Probably removed from voice channel
                    }
                } else if (this.connection.rejoinAttempts < 5) {    		                            // Disconnect is recoverable, and we have <5 repeated attempts so we will reconnect.
                    await wait((this.connection.rejoinAttempts + 1) * 5_000);
                    this.connection.rejoin();
                } else this.connection.destroy();                                                       // Disconnect may be recoverable, but we have no more remaining attempts - destroy.			
            } else if (newState.status === VoiceConnectionStatus.Destroyed) logger.warn("Connection destroyed");   // Once destroyed, stop the subscription
        });

        logger.info("Listening on connection event 'stateChange'");

        return this.speak();
    }

    public skipText = () => {
        if(this.textQueue[0]) this.textQueue[0] = "";
        this.player.stop();
    }
    
    public skipAll = () => {
        this.textQueue = [];
        this.player.stop();
    }

    public speak = async () => {
        if (!this.textQueue.length) return;                      //Se non esiste il testo, chiudo la funzione e metto il flag di riproduzione a false

        logger.info(`TEXT: "${this.textQueue[0]}"`);
        logger.info(`QUEUE: [${this.textQueue.join(", ")}]`);
        logger.info(`--------------------------------------------------`);
        
        try {
            // Get stream
            let text: string, stream: any;


            if(this.languageType === LANGUAGE_TYPE.google) {
                text = this.textQueue[0].substring(0, 200);
                this.textQueue[0] = this.textQueue[0].substring(200);

                const audioURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.toLowerCase())}&tl=${this.language}&client=tw-ob&ttsspeed=${this.ttsSpeed}`;
                stream = await axios.get(audioURL, { responseType: 'stream' }).then(resp => resp.data);


            } else if(this.languageType === LANGUAGE_TYPE.freetts) {
                text = this.textQueue[0];
                this.textQueue[0] = "";

                const voice = Talker.supportedVoices[this.language];
                logger.time("IVONA generation time");

                stream = await axios.get(`https://nextup.com/ivona/php/nextup-polly/CreateSpeech/CreateSpeechGet3.php?voice=${this.language}&language=${voice.language}&text=${encodeURIComponent(text)}`)
                .then((r: any) => axios.get(r.data, { responseType: 'stream' }))
                .then(resp => resp.data);

                /**
                stream = await axios.get(`https://freetts.com/Home/PlayAudio?Language=${voice.language}&Voice=${voice.value}&TextMessage=${encodeURIComponent(text)}&id=${this.language}&type=1`)
                .then((r: any) => { const audioUrl = "https://freetts.com/audio/" + r.data.id; console.log(audioUrl); return audioUrl; })
                .then((audioUrl: string) => axios.get(audioUrl, { responseType: 'stream' }))
                .then(resp => resp.data);
                */

                logger.timeEnd("IVONA generation time");
                
            } else if(this.languageType === LANGUAGE_TYPE.ibm) {

                text = this.textQueue[0];
                this.textQueue[0] = "";

                const voice = Talker.supportedIbmVoices[this.language];
                logger.time("IBM generation time");

                const sessionID = v4();
                stream = await axios.post("https://www.ibm.com/demos/live/tts-demo/api/tts/store",
                    { ssmlText:`<prosody pitch=\"default\" rate=\"-0%\">${text}</prosody>`, sessionID },
                    { "headers": ibmHeaders })
                
                .then(() => axios.get(`https://www.ibm.com/demos/live/tts-demo/api/tts/newSynthesize?voice=${voice.voice}&id=${sessionID}`,
                    { "headers": ibmHeaders, responseType: "stream" }))
                .then(r => r.data);

                logger.timeEnd("IBM generation time");
            }
            
            if(stream) this.resource = createAudioResource(stream as any, { inlineVolume: true, inputType: StreamType.Arbitrary });
        } catch (e) {
            this.shiftIfEmpty();
            logger.error("Stream creation error: " + e);
            return this.speak();
        }

        this.setVolume();                                           // Set the volume of the new stream
        this.player.play(this.resource);                            // Actually start the new stream/resource on the player
        this.connection = getVoiceConnection(this.voiceChannel.guildId);
        this.connection.subscribe(this.player);                     // Apply the player to the connection (??)
    }

    public setVolume = (volume: number = this.volume) => {
        this.volume = volume;                           // Set new volume value
        this.resource?.volume.setVolume(this.volume);   // If there's a resource, apply the volume
    }

    public reset = () => {
        this.player?.stop();
        this.connection?.disconnect();

        this.textQueue = [];

        this.player = createAudioPlayer();
        this.connection = undefined;

        this.volume = 1;

        this.resource = undefined;
        this.voiceChannel = undefined;
    }

    private isPlaying = (): boolean => this.player.state.status === "playing";

    private checkVoice = (risp: Message | CommandInteraction | ButtonInteraction): Talker => {
        if (!(risp.member instanceof GuildMember)) return;
        const vc = risp.member.voice?.channel;
        if (vc && (!this.voiceChannel || this.voiceChannel.id == vc.id)) return this;
    }
}