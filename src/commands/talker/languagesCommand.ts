import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import MarioMicidial from "../..";
import { EmbedBuilder } from "discord.js";


const skipCommandMetadata: CommandMetadata<void, { embeds: EmbedBuilder[] }> = {
    category: "TTS", description: "Shows the list of all the possible languages.",
    aliases: ["langs", "languages"], usage: `\`${DEFAULT_PREFIX}languages\``,
    
    command: () => {

        const bot = MarioMicidial.get();
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(bot.embedColor)
            .setTitle("Available languages")
            .addFields(
                { name:`Languages (\`${DEFAULT_PREFIX}lang\`)`, value: "`af`, `ar`, `bg`, `bn`, `bs`, `ca`, `cs`, `cy`, `da`, `de`, `el`, `en`, `eo`, `es`, `et`, `fi`, `fr`, `gu`, `hi`, `hr`, `hu`, `id`, `is`, `it`, `ja`, `jv`, `km`, `kn`, `ko`, `ku`, `la`, `lv`, `mk`, `ml`, `mr`, `ms`, `my`, `ne`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `si`, `sk`, `sq`, `su`, `sv`, `sw`, `ta`, `te`, `th`, `tl`, `tr`, `uk`, `ur`, `vi`, `zh-cn`, `zh-tw`" },
                { name:`Voices (\`${DEFAULT_PREFIX}voice\`)`, value: "`(en) Salli\n(en) Joanna\n(en) Matthew\n(en) Ivy\n(en) Justin\n(en) Kendra\n(en) Kimberly\n(en) Joey\n(ar) Zeina\n(da) Naja\n(nl) Lotte\n(nl) Ruben\n(en) Raveena\n(en) Aditi\n(en) Amy\n(en) Brian\n(en) Emma\n(en) Geraint\n(fr) Mathieu`", inline: true },
                { name:"­",         value: "`(fr) Celine\n(fr) Lea\n(fr) Chantal\n(de) Hans\n(de) Marlene\n(de) Vicki\n(is) Karl\n(is) Dora\n(it) Giorgio\n(it) Bianca\n(it) Carla\n(ja) Takumi\n(ja) Mizuki\n(ko) Seoyeon\n(nb) Liv\n(pl) Jacek\n(pl) Ewa\n(pl) Jan\n(pl) Maja`", inline: true },
                { name:"­",         value: "`(pt) Vitoria\n(pt) Ricardo\n(pt) Camila\n(pt) Ines\n(pt) Cristiano\n(ro) Carmen\n(ru) Tatyana\n(ru) Maxim\n(es) Lucia\n(es) Enrique\n(es) Conchita\n(es) Mia\n(es) Penelope\n(es) Miguel\n(es) Lupe\n(sv) Astrid\n(tr) Filiz\n(cy) Gwyneth`", inline: true }
            );
        
        return { embeds: [ embed ] };


        /* Old stuff
        const fields: any = [
            { name: "Languages", value: `\`${[...Talker.supportedLanguages].join(`\`, \``)}\`` }
        ];*/

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
        
        // return {"embeds":[{"color":"DARK_VIVID_PINK","title":"Available languages","fields":[{"name":"Languages","value":"`af`, `ar`, `bg`, `bn`, `bs`, `ca`, `cs`, `cy`, `da`, `de`, `el`, `en`, `eo`, `es`, `et`, `fi`, `fr`, `gu`, `hi`, `hr`, `hu`, `id`, `is`, `it`, `ja`, `jv`, `km`, `kn`, `ko`, `ku`, `la`, `lv`, `mk`, `ml`, `mr`, `ms`, `my`, `ne`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `si`, `sk`, `sq`, `su`, `sv`, `sw`, `ta`, `te`, `th`, `tl`, `tr`, `uk`, `ur`, `vi`, `zh-cn`, `zh-tw`"},{"name":"Ibm Voices","value":"`(ar) Omar\n(zh) Wang\n(zh) Zhang\n(zh) Li\n(cs) Alena\n(nl) Adele\n(nl) Bram\n(nl) Emma\n(nl) Liam\n(en) Allison\n(en) Emily\n(en) Henry\n(en) Kevin`","inline":true},{"name":"­","value":"`(en) Lisa\n(en) Michael\n(en) Olivia\n(en) Craig\n(en) Madison\n(en) Steve\n(en) Kate\n(en) Charlotte\n(en) James\n(fr) Louise\n(fr) Renee\n(fr) Nicolas\n(de) Birgit`","inline":true},{"name":"­","value":"`(de) Dieter\n(de) Erika\n(it) Francesca\n(ja) Emi\n(ko) Hyunjun\n(ko) Si\n(ko) Yuna\n(ko) Youngmi\n(pt) Isabela\n(es) Enrique\n(es) Laura\n(es) Sofia\n(sv) Ingrid`","inline":true}]}]};
        // return {"embeds":[{"color":"DARK_VIVID_PINK","title":"Available languages","fields":[{"name":"Languages","value":"`af`, `ar`, `bg`, `bn`, `bs`, `ca`, `cs`, `cy`, `da`, `de`, `el`, `en`, `eo`, `es`, `et`, `fi`, `fr`, `gu`, `hi`, `hr`, `hu`, `id`, `is`, `it`, `ja`, `jv`, `km`, `kn`, `ko`, `ku`, `la`, `lv`, `mk`, `ml`, `mr`, `ms`, `my`, `ne`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `si`, `sk`, `sq`, `su`, `sv`, `sw`, `ta`, `te`, `th`, `tl`, `tr`, `uk`, `ur`, `vi`, `zh-cn`, `zh-tw`"},{"name":"Voices","value":"`(en) Salli\n(en) Joanna\n(en) Matthew\n(en) Ivy\n(en) Justin\n(en) Kendra\n(en) Kimberly\n(en) Joey\n(ar) Zeina\n(da) Naja\n(nl) Lotte\n(nl) Ruben\n(en) Raveena\n(en) Aditi\n(en) Amy\n(en) Brian\n(en) Emma\n(en) Geraint\n(fr) Mathieu`","inline":true},{"name":"­","value":"`(fr) Celine\n(fr) Lea\n(fr) Chantal\n(de) Hans\n(de) Marlene\n(de) Vicki\n(is) Karl\n(is) Dora\n(it) Giorgio\n(it) Bianca\n(it) Carla\n(ja) Takumi\n(ja) Mizuki\n(ko) Seoyeon\n(nb) Liv\n(pl) Jacek\n(pl) Ewa\n(pl) Jan\n(pl) Maja`","inline":true},{"name":"­","value":"`(pt) Vitoria\n(pt) Ricardo\n(pt) Camila\n(pt) Ines\n(pt) Cristiano\n(ro) Carmen\n(ru) Tatyana\n(ru) Maxim\n(es) Lucia\n(es) Enrique\n(es) Conchita\n(es) Mia\n(es) Penelope\n(es) Miguel\n(es) Lupe\n(sv) Astrid\n(tr) Filiz\n(cy) Gwyneth`","inline":true},{"name":"Ibm Voices","value":"`(ar) Omar\n(zh) Wang\n(zh) Zhang\n(zh) Li\n(cs) Alena\n(nl) Adele\n(nl) Bram\n(nl) Emma\n(nl) Liam\n(en) Allison\n(en) Emily\n(en) Henry\n(en) Kevin`","inline":true},{"name":"­","value":"`(en) Lisa\n(en) Michael\n(en) Olivia\n(en) Craig\n(en) Madison\n(en) Steve\n(en) Kate\n(en) Charlotte\n(en) James\n(fr) Louise\n(fr) Renee\n(fr) Nicolas\n(de) Birgit`","inline":true},{"name":"­","value":"`(de) Dieter\n(de) Erika\n(it) Francesca\n(ja) Emi\n(ko) Hyunjun\n(ko) Si\n(ko) Yuna\n(ko) Youngmi\n(pt) Isabela\n(es) Enrique\n(es) Laura\n(es) Sofia\n(sv) Ingrid`","inline":true}]}]};
    },

    onMessage: {
        requestTransformer: (msg, _content, _args) => {},
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default skipCommandMetadata;