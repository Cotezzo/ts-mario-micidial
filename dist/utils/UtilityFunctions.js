"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startsWithCaseUnsensitive = exports.sleep = exports.capitalizeFirstLetter = void 0;
const capitalizeFirstLetter = (string) => string?.charAt(0).toUpperCase() + string?.slice(1);
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
const startsWithCaseUnsensitive = (str, prefix) => str.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase();
exports.startsWithCaseUnsensitive = startsWithCaseUnsensitive;
//# sourceMappingURL=UtilityFunctions.js.map