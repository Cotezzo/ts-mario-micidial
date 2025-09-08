import MarioMicidial from "..";
import Logger from "../classes/logging/Logger";
import { registerCommands } from "../commands/registration";


/** Event triggered when the bot has successfully logged in.
 *  Update bot activity and log some guild info. */
export default async function onReady() {
    // Register commands
    await registerCommands();

    // Update bot activity status
    MarioMicidial.get().updatePresence();

    // Retrieve list of guilds the bot is in
    const guilds = MarioMicidial.get().guilds.cache;

    // Print guilds number and names
    Logger.info(`Currently in ${guilds.size} servers`);
    //for(const [_, guild] of guilds) Logger.trace(`- ${guild.name}`);

    Logger.info(`========= Deployment completed =========`);
}