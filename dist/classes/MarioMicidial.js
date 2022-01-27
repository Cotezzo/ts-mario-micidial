"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarioMicidial = void 0;
/* ==== Imports =========================================================================================================================== */
const discord_js_1 = require("discord.js");
const LoginEvent_1 = require("../events/LoginEvent");
const ToListenEvents_1 = require("../events/ToListenEvents");
const Logger_1 = require("./Logger");
const logger = new Logger_1.ClassLogger("MarioMicidial");
/* ==== Class ============================================================================================================================= */
/**
 * Main class that rapresents the bot itself.
 * On init, logs in the bot into Discord and starts to listen on all the events.
 */
class MarioMicidial extends discord_js_1.Client {
    init = () => {
        const isProd = process.env.ENVIROMENT == "P" ? true : false;
        Logger_1.Logger.info(`==== Deploy started on enviroment ${isProd ? "PRODUCTION" : "TEST"} ====`);
        this.login(isProd ? process.env.productionToken : process.env.testToken); // Bot login
        this.once(LoginEvent_1.loginEvent.name, LoginEvent_1.loginEvent.fn.bind(null, this)); // On bot login event, execute only once        
        logger.info(`Listening on event '${LoginEvent_1.loginEvent.name}'`);
        for (const event of ToListenEvents_1.toListenEvents) { // Event Listeners (loop through each event and start listening)
            this.on(event.name, event.fn.bind(null, this));
            logger.info(`Listening on event '${event.name}'`);
        }
    };
}
exports.MarioMicidial = MarioMicidial;
//# sourceMappingURL=MarioMicidial.js.map