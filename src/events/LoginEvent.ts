/* ==== Imports =========================================================================================================================== */
import { marioMicidialInstance } from "..";
import { Logger } from "../classes/Logger";

import { Event } from "../interfaces/Event"

/* ==== Events ============================================================================================================================ */
export const loginEvent: Event = {
    name: "ready",
    fn: async () => {
        marioMicidialInstance.user.setPresence({ activities: [{ name: "Pippo", type: "LISTENING" }], status: 'idle' });
        // await populateStationsPool();
        Logger.info(`========= Bot deployed on version ${process.env.VERSION} =========`);
    }
}