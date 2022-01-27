"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logicHandler = exports.getTalker = void 0;
/* ==== Imports =========================================================================================================================== */
const discord_js_1 = require("discord.js");
const __1 = require("..");
const Logger_1 = require("../classes/Logger");
const Talker_1 = require("../classes/Talker");
const applyAlias_1 = require("../utils/applyAlias");
const UtilityFunctions_1 = require("../utils/UtilityFunctions");
/* ==== Logic Handlers ==================================================================================================================== */
const logicHandler = {
    /* ==== INFORMATION ==== */
    ping: {
        name: "ping", category: "Information", description: "WebSocket ping in milliseconds",
        fn: () => `Pong! (${__1.marioMicidialInstance.ws.ping}ms)`
    },
    invite: {
        name: "invite", category: "Information", description: "Sends the invite link of the bot",
        fn: () => "Bot invitation link: TODO"
    },
    info: {
        name: "info", category: "Information", description: "Lets the bot speak a bit about himself",
        fn: (guildId) => {
            const talker = (0, exports.getTalker)(guildId);
            return { embeds: [new discord_js_1.MessageEmbed()
                        .setColor(process.env.EMBED_COLOR)
                        .setTitle("Mario Micidial informations")
                        .addField("First name", "Mario", true)
                        .addField("Surname", "Micidial", true)
                        .addField("Version", process.env.VERSION, true)
                        .addField("Language", talker?.language ?? "it", true)
                        .addField("Volume", "" + (talker?.volume ?? "1"), true)
                        .addField("Autodeletion", "" + (talker?.deleteMessages ?? "false"), true)
                        .setFooter(`Created by Boquobbo#5645            Special Thanks to Depa & Pippo`)
                        .setThumbnail(__1.marioMicidialInstance.user.avatarURL())
                    // .setThumbnail(`https://cdn.discordapp.com/attachments/638334134388785172/807421835946754048/fumocirno3d.gif`)
                ] };
        }
    },
    help: {
        name: "help", category: "Information", description: "Shows the list of all commands",
        fn: (cmdName) => {
            const embed = new discord_js_1.MessageEmbed().setColor(process.env.embedColor);
            if (!cmdName || !logicHandler.hasOwnProperty(cmdName))
                return { embeds: [embed.setTitle("Haram Leotta Commands")
                            .addFields(Object.entries(categories).map(([key, value]) => { return { name: `${key} Commands`, value: `\`${value.join(`\`, \``)}\`` }; }))] };
            const { name, description, category, aliases, usage } = logicHandler[cmdName];
            embed.setTitle(`Command '${name}' help`)
                .addFields([{ name: "Category", value: category },
                { name: "Description", value: description },
                { name: "Usage", value: usage || "Quando ho voglia li metto" },
                { name: "Aliases", value: aliases || "none" }])
                .setFooter("<> => required argument - [] => optional argument - | => OR");
            return { embeds: [embed] };
        }
    },
    /* ==== TALKER ========== */
    "j, join": {
        name: "join", category: "Talk", description: "The bot will join your voice channel. If there's something in the queue, it will play.", aliases: "j",
        fn: (risp) => getOrCreateTalker(risp.guildId)?.tryToPlay(risp)
    },
    "l, leave, clear, stop, fanculo": {
        name: "leave", category: "Talk", description: "Kicks the bot out from the voice channel, but doesn't clear the current queue and other informations.", aliases: "l",
        fn: (risp) => (0, exports.getTalker)(risp.guildId)?.reset()
    },
    "v, volume": {
        name: "volume", category: "Talk", description: "Changes the volume of the radio [Default: 1].", aliases: "v",
        fn: (risp, volume) => {
            if (!/[0-9]{0,2}(\.[0-9])?/.test(volume))
                return;
            (0, exports.getTalker)(risp.guildId)?.setVolume(parseFloat(volume));
        }
    },
    "s, skip": {
        name: "skip", category: "Talk", description: "Skips the current text.", aliases: "s",
        fn: (risp) => (0, exports.getTalker)(risp.guildId)?.skipText()
    },
    "sa, ss, skipall": {
        name: "skipall", category: "Talk", description: "Skips the current text.", aliases: "sa, ss",
        fn: (risp) => (0, exports.getTalker)(risp.guildId)?.skipAll()
    },
    "langs, languages": {
        name: "languages", category: "Talk", description: "Shows the list of all the possible languages.", aliases: "langs",
        fn: () => {
            // Init
            const fields = [
                { name: "Languages", value: `\`${[...Talker_1.Talker.supportedLanguages].join(`\`, \``)}\`` }
            ];
            /* GENERAZIONE EMBED DA ATTIVARE IN CASO SI CAMBINO SPESSO I LINGUAGGI E LE LISTE, PER ORA OGGETTO STATICO GENERATO E COPIAINCOLLATO */
            /*
            let array = Object.entries(Talker.supportedVoices);

            // Codice rubato dal Doujinshi bot per creare tre colonne in cui elencare gli argomenti
            let resto = array.length % 3;
            let elemPerColon = (array.length - resto) / 3;
        
            let lungs = [elemPerColon + (resto ? 1 : 0)];
            lungs.push(lungs[0] + elemPerColon + (resto == 2 ? 1 : 0));
            lungs.push(lungs[1] + elemPerColon);
        
            fields.push({ name: `Voices`, value: parseFields(array.slice(0, lungs[0])), inline: true });
            if (elemPerColon) fields.push({ name: `­`, value: parseFields(array.slice(lungs[0], lungs[1])), inline: true });
            if (elemPerColon) fields.push({ name: `­`, value: parseFields(array.slice(lungs[1], lungs[2])), inline: true });
            ///


            let array = Object.entries(Talker.supportedIbmVoices);

            // Codice rubato dal Doujinshi bot per creare tre colonne in cui elencare gli argomenti
            let resto = array.length % 3;
            let elemPerColon = (array.length - resto) / 3;
        
            let lungs = [elemPerColon + (resto ? 1 : 0)];
            lungs.push(lungs[0] + elemPerColon + (resto == 2 ? 1 : 0));
            lungs.push(lungs[1] + elemPerColon);
        
            fields.push({ name: `Ibm Voices`, value: parseFields(array.slice(0, lungs[0])), inline: true });
            if (elemPerColon) fields.push({ name: `­`, value: parseFields(array.slice(lungs[0], lungs[1])), inline: true });
            if (elemPerColon) fields.push({ name: `­`, value: parseFields(array.slice(lungs[1], lungs[2])), inline: true });

            const r = { embeds: [ { color: process.env.EMBED_COLOR, title: "Available languages", fields } ] }
            console.log(JSON.stringify(r));
            return r;
            */
            return { "embeds": [{ "color": "DARK_VIVID_PINK", "title": "Available languages", "fields": [{ "name": "Languages", "value": "`af`, `ar`, `bg`, `bn`, `bs`, `ca`, `cs`, `cy`, `da`, `de`, `el`, `en`, `eo`, `es`, `et`, `fi`, `fr`, `gu`, `hi`, `hr`, `hu`, `id`, `is`, `it`, `ja`, `jv`, `km`, `kn`, `ko`, `ku`, `la`, `lv`, `mk`, `ml`, `mr`, `ms`, `my`, `ne`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `si`, `sk`, `sq`, `su`, `sv`, `sw`, `ta`, `te`, `th`, `tl`, `tr`, `uk`, `ur`, `vi`, `zh-cn`, `zh-tw`" }, { "name": "Ibm Voices", "value": "`(ar) Omar\n(zh) Wang\n(zh) Zhang\n(zh) Li\n(cs) Alena\n(nl) Adele\n(nl) Bram\n(nl) Emma\n(nl) Liam\n(en) Allison\n(en) Emily\n(en) Henry\n(en) Kevin`", "inline": true }, { "name": "­", "value": "`(en) Lisa\n(en) Michael\n(en) Olivia\n(en) Craig\n(en) Madison\n(en) Steve\n(en) Kate\n(en) Charlotte\n(en) James\n(fr) Louise\n(fr) Renee\n(fr) Nicolas\n(de) Birgit`", "inline": true }, { "name": "­", "value": "`(de) Dieter\n(de) Erika\n(it) Francesca\n(ja) Emi\n(ko) Hyunjun\n(ko) Si\n(ko) Yuna\n(ko) Youngmi\n(pt) Isabela\n(es) Enrique\n(es) Laura\n(es) Sofia\n(sv) Ingrid`", "inline": true }] }] };
            // return {"embeds":[{"color":"DARK_VIVID_PINK","title":"Available languages","fields":[{"name":"Languages","value":"`af`, `ar`, `bg`, `bn`, `bs`, `ca`, `cs`, `cy`, `da`, `de`, `el`, `en`, `eo`, `es`, `et`, `fi`, `fr`, `gu`, `hi`, `hr`, `hu`, `id`, `is`, `it`, `ja`, `jv`, `km`, `kn`, `ko`, `ku`, `la`, `lv`, `mk`, `ml`, `mr`, `ms`, `my`, `ne`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `si`, `sk`, `sq`, `su`, `sv`, `sw`, `ta`, `te`, `th`, `tl`, `tr`, `uk`, `ur`, `vi`, `zh-cn`, `zh-tw`"},{"name":"Voices","value":"`(en) Salli\n(en) Joanna\n(en) Matthew\n(en) Ivy\n(en) Justin\n(en) Kendra\n(en) Kimberly\n(en) Joey\n(ar) Zeina\n(da) Naja\n(nl) Lotte\n(nl) Ruben\n(en) Raveena\n(en) Aditi\n(en) Amy\n(en) Brian\n(en) Emma\n(en) Geraint\n(fr) Mathieu`","inline":true},{"name":"­","value":"`(fr) Celine\n(fr) Lea\n(fr) Chantal\n(de) Hans\n(de) Marlene\n(de) Vicki\n(is) Karl\n(is) Dora\n(it) Giorgio\n(it) Bianca\n(it) Carla\n(ja) Takumi\n(ja) Mizuki\n(ko) Seoyeon\n(nb) Liv\n(pl) Jacek\n(pl) Ewa\n(pl) Jan\n(pl) Maja`","inline":true},{"name":"­","value":"`(pt) Vitoria\n(pt) Ricardo\n(pt) Camila\n(pt) Ines\n(pt) Cristiano\n(ro) Carmen\n(ru) Tatyana\n(ru) Maxim\n(es) Lucia\n(es) Enrique\n(es) Conchita\n(es) Mia\n(es) Penelope\n(es) Miguel\n(es) Lupe\n(sv) Astrid\n(tr) Filiz\n(cy) Gwyneth`","inline":true},{"name":"Ibm Voices","value":"`(ar) Omar\n(zh) Wang\n(zh) Zhang\n(zh) Li\n(cs) Alena\n(nl) Adele\n(nl) Bram\n(nl) Emma\n(nl) Liam\n(en) Allison\n(en) Emily\n(en) Henry\n(en) Kevin`","inline":true},{"name":"­","value":"`(en) Lisa\n(en) Michael\n(en) Olivia\n(en) Craig\n(en) Madison\n(en) Steve\n(en) Kate\n(en) Charlotte\n(en) James\n(fr) Louise\n(fr) Renee\n(fr) Nicolas\n(de) Birgit`","inline":true},{"name":"­","value":"`(de) Dieter\n(de) Erika\n(it) Francesca\n(ja) Emi\n(ko) Hyunjun\n(ko) Si\n(ko) Yuna\n(ko) Youngmi\n(pt) Isabela\n(es) Enrique\n(es) Laura\n(es) Sofia\n(sv) Ingrid`","inline":true}]}]};
        }
    },
    "lang, language": {
        name: "language", category: "Talk", description: "Changes the language used for the TTS.", aliases: "lang",
        fn: (risp, args) => {
            let language = args[0]?.toLowerCase();
            return setLanguage(Talker_1.Talker.supportedLanguages.has(language), language, Talker_1.LANGUAGE_TYPE.google, risp);
        }
    },
    "voice": {
        name: "voice", category: "Talk", description: "Changes the voice used for the TTS.",
        fn: (risp, args) => {
            const voice = (0, UtilityFunctions_1.capitalizeFirstLetter)(args[0]?.toLowerCase());
            return setLanguage(Talker_1.Talker.supportedVoices[voice], voice, Talker_1.LANGUAGE_TYPE.freetts, risp);
        }
    },
    "ibm": {
        name: "ibm", category: "Talk", description: "Changes the voice used for the TTS.",
        fn: (risp, args) => {
            const voice = (0, UtilityFunctions_1.capitalizeFirstLetter)(args[0]?.toLowerCase());
            return setLanguage(Talker_1.Talker.supportedIbmVoices[voice], voice, Talker_1.LANGUAGE_TYPE.ibm, risp);
        }
    },
    /*
    "lang2, language2": {
        name: "language2", category: "Talk", description: "Changes the language used for the TTS.", aliases: "lang2",
        fn: (risp: Message | CommandInteraction, args) => {
            const language = args[0]?.toLowerCase();
            return setLanguage(Talker.supportedLanguagesV2[language], Talker.supportedLanguagesV2[language], LANGUAGE_TYPE.soundoftext, risp);
            /*
            if(!Talker.supportedLanguagesV2[language]) return risp.reply(`Invalid language. **${process.env.PREFIX}languages** for a list of valid languages.`);

            const talker: Talker = getOrCreateTalker(risp.guildId);
            talker.language = language;
            talker.languageType = LANGUAGE_TYPE.soundoftext;
            risp.reply(`Voice successfully changed to **${language}**.`);
            *
        }
    },
    */
    "delete": {
        name: "delete", category: "Talk", description: "Sets wether or not the bot will delete the messages after reading them.", aliases: "lang",
        fn: (risp, args) => {
            const talker = (0, exports.getTalker)(risp.guildId); //Ricavo oggetto associato al server
            if (!talker)
                return;
            const input = args[0].toLowerCase();
            // if(!risp.guild.me.permissionsIn("MANAGE_MESSAGES")) return risp.reply(`I can't delete messages anyway, I don't have permissions.`);
            if (/^(on)|1|(true)$/.test(input))
                talker.deleteMessages = true;
            else if (/^(off)|0|(false)$/.test(input))
                talker.deleteMessages = false;
            else
                return risp.reply(`Invalid setting. Use \`off|0|false\` and \`on|1|true\`.`);
            risp.reply(`Autodeletion successfully changed to **${args[0]}**.`);
        }
    },
    "say": {
        name: "say", category: "Talk", description: "Joins the voice channel and .",
        fn: (risp, text) => {
            if (!text)
                return;
            const talker = getOrCreateTalker(risp.guildId); //Ricavo oggetto associato al server
            talker.addText(risp, text.join(" ")); //Aggiungo all'oggetto la frase da leggere, assieme ad un nome univoco
            if (talker.deleteMessages && risp instanceof discord_js_1.Message)
                risp.delete().catch(() => { }); //Se è impostato per farlo, elimina il messaggio
        }
    }
};
exports.logicHandler = logicHandler;
const talkerMap = {};
const getTalker = (guildId) => talkerMap[guildId];
exports.getTalker = getTalker;
const getOrCreateTalker = (guildId) => {
    if (!talkerMap[guildId])
        talkerMap[guildId] = new Talker_1.Talker();
    return talkerMap[guildId];
};
const setLanguage = (has, input, type, risp) => {
    if (!has)
        return risp.reply(`Invalid language. **${process.env.PREFIX}languages** for a list of valid languages.`);
    const talker = getOrCreateTalker(risp.guildId);
    talker.language = input;
    talker.languageType = type;
    return risp.reply(`Language successfully changed to **${input}**.`);
};
const deleteTalker = (guildId) => {
    delete talkerMap[guildId];
    Logger_1.Logger.info(`RadioPlayer ${guildId} destroyed`);
};
const categories = {};
for (const { name, category } of Object.values(logicHandler)) {
    if (category)
        if (categories[category])
            categories[category].push(name);
        else
            categories[category] = [name];
}
const parseFields = (array) => `\`${array.map(e => `(${e[1].language.substring(0, 2)}) ${e[0]}`).join("\n")}\``;
// const parseFieldsIbm = (array): string => `\`${array.map(e => `(${e[1].language}) ${e[0]}`).join("\n")}\``;
(0, applyAlias_1.applyAlias)(logicHandler);
//# sourceMappingURL=LogicHandler.js.map