"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTalker = exports.setLanguage = exports.getOrCreateTalker = exports.getTalker = exports.Talker = exports.LANGUAGE_TYPE = void 0;
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const util_1 = require("util");
const axios_1 = __importDefault(require("axios"));
const wait = (0, util_1.promisify)(setTimeout);
const uuid_1 = require("uuid");
const Logger_1 = __importDefault(require("./logging/Logger"));
const ibmHeaders = { "cookie": "tts-demo=s%3A6OQEZy9xbWIlSU3DC5KaNGqvWMrrQlYC.kiboEHFQ0cqTmTmsrrBo3AhL3%2B9zSW4tQGj4Zhl00Z0;" };
exports.LANGUAGE_TYPE = {
    google: 0,
    freetts: 1,
    soundoftext: 2,
    ibm: 3
};
class Talker {
    constructor() {
        this.addText = (risp, text) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Input: " + text);
            if (!text)
                return;
            this.textQueue.push(text);
            this.tryToPlay(risp);
        });
        this.tryToPlay = (risp) => {
            var _a, _b, _c, _d, _e, _f;
            if (this.isPlaying())
                return;
            if (risp) {
                if (!(risp.member instanceof discord_js_1.GuildMember))
                    return;
                const newChannel = (_a = risp.member.voice) === null || _a === void 0 ? void 0 : _a.channel;
                if (!newChannel)
                    return;
                if (((_b = this.voiceChannel) === null || _b === void 0 ? void 0 : _b.id) !== newChannel.id) {
                    this.voiceChannel = newChannel;
                    this.connection = (0, voice_1.joinVoiceChannel)({ channelId: this.voiceChannel.id, guildId: this.voiceChannel.guildId, adapterCreator: this.voiceChannel.guild.voiceAdapterCreator });
                    Logger_1.default.info("New connection enstablished");
                }
            }
            if (this.connection && ((_c = this.player) === null || _c === void 0 ? void 0 : _c.state.status) === "idle" || ((_d = this.player) === null || _d === void 0 ? void 0 : _d.state.status) === "autopaused")
                return this.speak();
            if (this.connection && this.connection.state.status != "destroyed")
                return;
            (_e = this.connection) === null || _e === void 0 ? void 0 : _e.on("error", () => Logger_1.default.warn("Connection error"));
            Logger_1.default.info("Listening on connection event 'error'");
            (_f = this.connection) === null || _f === void 0 ? void 0 : _f.on("stateChange", (_, newState) => __awaiter(this, void 0, void 0, function* () {
                Logger_1.default.info("Connection state changed to " + newState.status);
                if (newState.status === voice_1.VoiceConnectionStatus.Disconnected) {
                    if (newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                        try {
                            yield (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Connecting, 5000);
                        }
                        catch (_a) {
                            this.connection.destroy();
                        }
                    }
                    else if (this.connection.rejoinAttempts < 5) {
                        yield wait((this.connection.rejoinAttempts + 1) * 5000);
                        this.connection.rejoin();
                    }
                    else
                        this.connection.destroy();
                }
                else if (newState.status === voice_1.VoiceConnectionStatus.Destroyed)
                    Logger_1.default.warn("Connection destroyed");
            }));
            Logger_1.default.info("Listening on connection event 'stateChange'");
            return this.speak();
        };
        this.skipText = () => {
            this.textQueue.shift();
            this.player.stop();
        };
        this.skipAll = () => {
            this.textQueue = [];
            this.player.stop();
        };
        this.speak = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.textQueue.length)
                return;
            if (!this.resource || !this.voiceChannel)
                return;
            Logger_1.default.info(`QUEUE: [${this.textQueue.join(", ")}]`);
            if (this.textQueue[0].length === 0) {
                Logger_1.default.warn("Removing empty string...");
                this.textQueue.shift();
                return this.speak();
            }
            try {
                let text, stream;
                if (this.languageType === exports.LANGUAGE_TYPE.google) {
                    text = this.textQueue[0].substring(0, 200);
                    this.textQueue[0] = this.textQueue[0].substring(200);
                    const audioURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.toLowerCase())}&tl=${this.language}&client=tw-ob&ttsspeed=${this.ttsSpeed}`;
                    stream = yield axios_1.default.get(audioURL, { responseType: 'stream' }).then(resp => resp.data);
                }
                else if (this.languageType === exports.LANGUAGE_TYPE.freetts) {
                    text = this.textQueue[0];
                    this.textQueue[0] = "";
                    const voice = Talker.supportedVoices[this.language];
                    console.time("IVONA generation time");
                    stream = yield axios_1.default.get(`https://nextup.com/ivona/php/nextup-polly/CreateSpeech/CreateSpeechGet3.php?voice=${this.language}&language=${voice.language}&text=${encodeURIComponent(text)}`)
                        .then((r) => axios_1.default.get(r.data, { responseType: 'stream' }))
                        .then(resp => resp.data);
                    console.timeEnd("IVONA generation time");
                }
                else if (this.languageType === exports.LANGUAGE_TYPE.ibm) {
                    text = this.textQueue[0];
                    this.textQueue[0] = "";
                    const voice = Talker.supportedIbmVoices[this.language];
                    console.time("IBM generation time");
                    const sessionID = (0, uuid_1.v4)();
                    stream = yield axios_1.default.post("https://www.ibm.com/demos/live/tts-demo/api/tts/store", { ssmlText: `<prosody pitch=\"default\" rate=\"-0%\">${text}</prosody>`, sessionID }, { "headers": ibmHeaders })
                        .then(() => axios_1.default.get(`https://www.ibm.com/demos/live/tts-demo/api/tts/newSynthesize?voice=${voice.voice}&id=${sessionID}`, { "headers": ibmHeaders, responseType: "stream" }))
                        .then(r => r.data);
                    console.timeEnd("IBM generation time");
                }
                if (stream)
                    this.resource = (0, voice_1.createAudioResource)(stream, { inlineVolume: true, inputType: voice_1.StreamType.Arbitrary });
            }
            catch (e) {
                this.textQueue.shift();
                Logger_1.default.error("Stream creation error: " + e);
                return this.speak();
            }
            this.setVolume();
            this.player.play(this.resource);
            this.connection = (0, voice_1.getVoiceConnection)(this.voiceChannel.guildId);
            (_a = this.connection) === null || _a === void 0 ? void 0 : _a.subscribe(this.player);
        });
        this.setVolume = (volume = this.volume) => {
            var _a, _b;
            this.volume = volume;
            (_b = (_a = this.resource) === null || _a === void 0 ? void 0 : _a.volume) === null || _b === void 0 ? void 0 : _b.setVolume(this.volume);
        };
        this.reset = () => {
            var _a, _b;
            (_a = this.player) === null || _a === void 0 ? void 0 : _a.stop();
            (_b = this.connection) === null || _b === void 0 ? void 0 : _b.disconnect();
            this.textQueue = [];
            this.connection = undefined;
            this.volume = 1;
            this.resource = undefined;
            this.voiceChannel = undefined;
        };
        this.isPlaying = () => this.player.state.status === "playing";
        this.checkVoice = (risp) => {
            var _a;
            if (!(risp.member instanceof discord_js_1.GuildMember))
                return;
            const vc = (_a = risp.member.voice) === null || _a === void 0 ? void 0 : _a.channel;
            if (vc && (!this.voiceChannel || this.voiceChannel.id == vc.id))
                return this;
        };
        this.textQueue = [];
        this.volume = 1;
        this.language = "it";
        this.languageType = exports.LANGUAGE_TYPE.google;
        this.ttsSpeed = "1";
        this.deleteMessages = false;
        this.player = (0, voice_1.createAudioPlayer)();
        this.player.on("stateChange", (_, newState) => Logger_1.default.info("AudioPlayer state changed to " + newState.status));
        this.player.on("error", (e) => Logger_1.default.error("AudioPlayer error: " + e.message));
        this.player.on(voice_1.AudioPlayerStatus.Idle, () => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("FINISHED PLAYING SOMETHING");
            this.speak();
        }));
        Logger_1.default.info("New instance created and listening on AudioPlayer events");
    }
}
exports.Talker = Talker;
Talker.supportedLanguages = new Set([
    'af', 'ar', 'bg', 'bn', 'bs', 'ca',
    'cs', 'cy', 'da', 'de', 'el', 'en',
    'eo', 'es', 'et', 'fi', 'fr', 'gu',
    'hi', 'hr', 'hu', 'id', 'is', 'it',
    'ja', 'jv', 'km', 'kn', 'ko', 'ku',
    'la', 'lv', 'mk', 'ml', 'mr', 'ms',
    'my', 'ne', 'nl', 'no', 'pl', 'pt',
    'ro', 'ru', 'si', 'sk', 'sq', 'su',
    'sv', 'sw', 'ta', 'te', 'th', 'tl',
    'tr', 'uk', 'ur', 'vi', 'zh-cn', 'zh-tw'
]);
Talker.supportedVoices = {
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
    "Lotte": { value: "Lotte_Female", language: "nl-NL" },
    "Ruben": { value: "Ruben_Male", language: "nl-NL" },
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
Talker.supportedIbmVoices = {
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
    Ingrid: { language: "sv", voice: "sv-SE_IngridVoice" }
};
const talkerMap = {};
const getTalker = (guildId) => talkerMap[guildId];
exports.getTalker = getTalker;
const getOrCreateTalker = (guildId) => {
    if (!talkerMap[guildId])
        talkerMap[guildId] = new Talker();
    return talkerMap[guildId];
};
exports.getOrCreateTalker = getOrCreateTalker;
const setLanguage = (input, type, guildId) => {
    const talker = (0, exports.getOrCreateTalker)(guildId);
    talker.language = input;
    talker.languageType = type;
};
exports.setLanguage = setLanguage;
const deleteTalker = (guildId) => {
    delete talkerMap[guildId];
    Logger_1.default.info(`RadioPlayer ${guildId} destroyed`);
};
exports.deleteTalker = deleteTalker;
