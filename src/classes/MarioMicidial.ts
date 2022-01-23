/* ==== Imports =========================================================================================================================== */
import { Client } from 'discord.js';

import { loginEvent } from '../events/LoginEvent';
import { toListenEvents } from '../events/ToListenEvents';
import { ClassLogger, Logger } from './Logger';

const logger = new ClassLogger("MarioMicidial");

/* ==== Class ============================================================================================================================= */
/**
 * Main class that rapresents the bot itself.
 * On init, logs in the bot into Discord and starts to listen on all the events.
 */
export class MarioMicidial extends Client {
    public init = () => {
        const isProd = process.env.ENVIROMENT == "P" ? true : false;

        Logger.info(`==== Deploy started on enviroment ${isProd ? "PRODUCTION" : "TEST"} ====`);
        this.login(isProd ? process.env.productionToken : process.env.testToken);   // Bot login
        
        this.once(loginEvent.name, loginEvent.fn.bind(null, this));                 // On bot login event, execute only once        
        logger.info(`Listening on event '${loginEvent.name}'`);

        for(const event of toListenEvents){                                         // Event Listeners (loop through each event and start listening)
            this.on(event.name, event.fn.bind(null, this));
            logger.info(`Listening on event '${event.name}'`);
        }
    }
}