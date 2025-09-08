import { EmbedBuilder } from "discord.js";
import { CommandMetadata } from "../types";
import { DEFAULT_PREFIX, msgReactErrorHandler, msgReplyResponseTransformer } from "../../events/onMessageCreate";
import MarioMicidial from "../..";
import { getTalker, Talker } from "../../classes/Talker";

const infoCommandMetadata: CommandMetadata<{ guildId: string }, { embeds: EmbedBuilder[] }> = {
    category: "Information", description: "Lets the bot speak a bit about himself",
    aliases: ["info"], usage: `\`${DEFAULT_PREFIX}info\``,
    
    command: ({ guildId }) => {
        const bot = MarioMicidial.get();
        const talker: Talker = getTalker(guildId);
        const embed: EmbedBuilder = new EmbedBuilder()
            .setColor(bot.embedColor)
            .setTitle("Mario Micidial informations")
            .setThumbnail(bot.user?.avatarURL() as string | null)
            .addFields(
                { name: "First name",   value: "Mario",             inline: true },
                { name: "Surname",      value: "Micidial",          inline: true },
                { name: "Birthday",     value: `<t:1608163200:D>`,  inline: true },
                { name: "Version",      value: bot.version,         inline: true },

                { name: "Language",     value: talker?.language || "it",                inline: true },
                { name: "Volume",       value: ""+(talker?.volume || "1"),              inline: true },
                { name: "Autodeletion", value: ""+(talker?.deleteMessages || "false"),  inline: true }
            )
            .setFooter({ text: `Created by Boquobbo#5645            Special Thanks to Depa & Pippo` })
            .setThumbnail(bot.user?.avatarURL() || "");
        
        return { embeds: [ embed ] };
    },

    onMessage: {
        requestTransformer: (msg, _content, _args) => {
            if(!msg.guildId) throw Error("Message not from guild");
            return { guildId: msg.guildId }
        },
        responseTransformer: msgReplyResponseTransformer,
        errorHandler: msgReactErrorHandler
    }
}
export default infoCommandMetadata;