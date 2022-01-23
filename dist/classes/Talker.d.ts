import { ButtonInteraction, CommandInteraction, Message, StageChannel, VoiceChannel } from "discord.js";
export declare const LANGUAGE_TYPE: {
    google: number;
    freetts: number;
    soundoftext: number;
    ibm: number;
};
export declare class Talker {
    static supportedLanguages: Set<string>;
    static supportedVoices: {
        Salli: {
            value: string;
            language: string;
        };
        Joanna: {
            value: string;
            language: string;
        };
        Matthew: {
            value: string;
            language: string;
        };
        Ivy: {
            value: string;
            language: string;
        };
        Justin: {
            value: string;
            language: string;
        };
        Kendra: {
            value: string;
            language: string;
        };
        Kimberly: {
            value: string;
            language: string;
        };
        Joey: {
            value: string;
            language: string;
        };
        Zeina: {
            value: string;
            language: string;
        };
        Naja: {
            value: string;
            language: string;
        };
        Lotte: {
            value: string;
            language: string;
        };
        Ruben: {
            value: string;
            language: string;
        };
        Raveena: {
            value: string;
            language: string;
        };
        Aditi: {
            value: string;
            language: string;
        };
        Amy: {
            value: string;
            language: string;
        };
        Brian: {
            value: string;
            language: string;
        };
        Emma: {
            value: string;
            language: string;
        };
        Geraint: {
            value: string;
            language: string;
        };
        Mathieu: {
            value: string;
            language: string;
        };
        Celine: {
            value: string;
            language: string;
        };
        Lea: {
            value: string;
            language: string;
        };
        Chantal: {
            value: string;
            language: string;
        };
        Hans: {
            value: string;
            language: string;
        };
        Marlene: {
            value: string;
            language: string;
        };
        Vicki: {
            value: string;
            language: string;
        };
        Karl: {
            value: string;
            language: string;
        };
        Dora: {
            value: string;
            language: string;
        };
        Giorgio: {
            value: string;
            language: string;
        };
        Bianca: {
            value: string;
            language: string;
        };
        Carla: {
            value: string;
            language: string;
        };
        Takumi: {
            value: string;
            language: string;
        };
        Mizuki: {
            value: string;
            language: string;
        };
        Seoyeon: {
            value: string;
            language: string;
        };
        Liv: {
            value: string;
            language: string;
        };
        Jacek: {
            value: string;
            language: string;
        };
        Ewa: {
            value: string;
            language: string;
        };
        Jan: {
            value: string;
            language: string;
        };
        Maja: {
            value: string;
            language: string;
        };
        Vitoria: {
            value: string;
            language: string;
        };
        Ricardo: {
            value: string;
            language: string;
        };
        Camila: {
            value: string;
            language: string;
        };
        Ines: {
            value: string;
            language: string;
        };
        Cristiano: {
            value: string;
            language: string;
        };
        Carmen: {
            value: string;
            language: string;
        };
        Tatyana: {
            value: string;
            language: string;
        };
        Maxim: {
            value: string;
            language: string;
        };
        Lucia: {
            value: string;
            language: string;
        };
        Enrique: {
            value: string;
            language: string;
        };
        Conchita: {
            value: string;
            language: string;
        };
        Mia: {
            value: string;
            language: string;
        };
        Penelope: {
            value: string;
            language: string;
        };
        Miguel: {
            value: string;
            language: string;
        };
        Lupe: {
            value: string;
            language: string;
        };
        Astrid: {
            value: string;
            language: string;
        };
        Filiz: {
            value: string;
            language: string;
        };
        Gwyneth: {
            value: string;
            language: string;
        };
    };
    static supportedIbmVoices: {
        Omar: {
            language: string;
            voice: string;
        };
        Wang: {
            language: string;
            voice: string;
        };
        Zhang: {
            language: string;
            voice: string;
        };
        Li: {
            language: string;
            voice: string;
        };
        Alena: {
            language: string;
            voice: string;
        };
        Adele: {
            language: string;
            voice: string;
        };
        Bram: {
            language: string;
            voice: string;
        };
        Emma: {
            language: string;
            voice: string;
        };
        Liam: {
            language: string;
            voice: string;
        };
        Allison: {
            language: string;
            voice: string;
        };
        Emily: {
            language: string;
            voice: string;
        };
        Henry: {
            language: string;
            voice: string;
        };
        Kevin: {
            language: string;
            voice: string;
        };
        Lisa: {
            language: string;
            voice: string;
        };
        Michael: {
            language: string;
            voice: string;
        };
        Olivia: {
            language: string;
            voice: string;
        };
        Craig: {
            language: string;
            voice: string;
        };
        Madison: {
            language: string;
            voice: string;
        };
        Steve: {
            language: string;
            voice: string;
        };
        Kate: {
            language: string;
            voice: string;
        };
        Charlotte: {
            language: string;
            voice: string;
        };
        James: {
            language: string;
            voice: string;
        };
        Louise: {
            language: string;
            voice: string;
        };
        Renee: {
            language: string;
            voice: string;
        };
        Nicolas: {
            language: string;
            voice: string;
        };
        Birgit: {
            language: string;
            voice: string;
        };
        Dieter: {
            language: string;
            voice: string;
        };
        Erika: {
            language: string;
            voice: string;
        };
        Francesca: {
            language: string;
            voice: string;
        };
        Emi: {
            language: string;
            voice: string;
        };
        Hyunjun: {
            language: string;
            voice: string;
        };
        Si: {
            language: string;
            voice: string;
        };
        Yuna: {
            language: string;
            voice: string;
        };
        Youngmi: {
            language: string;
            voice: string;
        };
        Isabela: {
            language: string;
            voice: string;
        };
        Enrique: {
            language: string;
            voice: string;
        };
        Laura: {
            language: string;
            voice: string;
        };
        Sofia: {
            language: string;
            voice: string;
        };
        Ingrid: {
            language: string;
            voice: string;
        };
    };
    private textQueue;
    private ttsSpeed;
    volume: number;
    language: string;
    languageType: number;
    deleteMessages: boolean;
    voiceChannel: VoiceChannel | StageChannel;
    private connection;
    private player;
    private resource;
    constructor();
    private shiftIfEmpty;
    addText: (risp: Message | CommandInteraction | ButtonInteraction, text: string) => Promise<void>;
    tryToPlay: (risp?: Message | CommandInteraction | ButtonInteraction) => Promise<any> | void;
    skipText: () => void;
    skipAll: () => void;
    speak: () => any;
    setVolume: (volume?: number) => void;
    reset: () => void;
    private isPlaying;
    private checkVoice;
}
