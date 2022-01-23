"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginEvent = void 0;
/* ==== Imports =========================================================================================================================== */
const __1 = require("..");
const Logger_1 = require("../classes/Logger");
/* ==== Events ============================================================================================================================ */
exports.loginEvent = {
    name: "ready",
    fn: async () => {
        __1.marioMicidialInstance.user.setPresence({ activities: [{ name: "Pippo", type: "LISTENING" }], status: 'idle' });
        // await populateStationsPool();
        Logger_1.Logger.info(`========= Bot deployed on version ${process.env.VERSION} =========`);
    }
};
//# sourceMappingURL=LoginEvent.js.map