"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startsWithCaseUnsensitive = exports.capitalizeFirstLetter = void 0;
exports.sleep = sleep;
const capitalizeFirstLetter = (string) => (string === null || string === void 0 ? void 0 : string.charAt(0).toUpperCase()) + (string === null || string === void 0 ? void 0 : string.slice(1));
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const startsWithCaseUnsensitive = (str, prefix) => str.substring(0, prefix.length).toLowerCase() == prefix.toLowerCase();
exports.startsWithCaseUnsensitive = startsWithCaseUnsensitive;
