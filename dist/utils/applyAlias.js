"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAlias = void 0;
/* ==== Function ========================================================================================================================== */
function applyAlias(obj) {
    for (const key of Object.keys(obj)) { // For every property (every command)
        const subkeys = key.split(/,\s?/); // Get aliases (if any)
        if (subkeys.length == 1)
            continue; // If there's only one subkey, continue
        const target = obj[key]; // Store the Command object
        delete obj[key]; // Delete old property
        for (const subkey of subkeys) // For every subproperty
            obj[subkey] = target; // Assign old object
    }
}
exports.applyAlias = applyAlias;
//# sourceMappingURL=applyAlias.js.map