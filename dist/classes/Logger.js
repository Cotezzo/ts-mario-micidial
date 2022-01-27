"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassLogger = exports.Logger = void 0;
/* ==== Consts ============================================================================================================================ */
const RESET_COLOR = "\x1b[0m";
/* ==== Classes =========================================================================================================================== */
class Logger {
    static time = (text) => console.time(Logger.getStringWithoutDate("CLK", "\x1b[96m", text));
    static timeEnd = (text) => console.timeEnd(Logger.getStringWithoutDate("CLK", "\x1b[96m", text));
    static debug = (text) => console.log(Logger.getString("DBG", "\x1b[35m", text));
    static log = (text) => console.log(Logger.getString("LOG", "\x1b[32m", text));
    static info = (text) => console.log(Logger.getString("INF", "\x1b[36m", text));
    static warn = (text) => console.log(Logger.getString("WRN", "\x1b[33m", text));
    static error = (text) => console.log(Logger.getString("ERR", "\x1b[31m", text));
    static getString = (level, color, text) => `[\x1b[90m${new Date().toLocaleTimeString()}${RESET_COLOR}] [${color}${level}${RESET_COLOR}] ${text}`;
    static getStringWithoutDate = (level, color, text) => `[\x1b[90m${color}${level}${RESET_COLOR}] ${text}`;
}
exports.Logger = Logger;
class ClassLogger {
    className;
    isProd;
    constructor(className) {
        this.className = className;
        this.isProd = process.env.ENVIROMENT === "P";
    }
    a = () => `[\x1b[1m${this.className}${RESET_COLOR}] `;
    debug = (text) => { if (this.isProd)
        Logger.debug(this.a() + text); };
    log = (text) => Logger.log(this.a() + text);
    info = (text) => Logger.info(this.a() + text);
    warn = (text) => Logger.warn(this.a() + text);
    error = (text) => Logger.error(this.a() + text);
    time = (text) => Logger.time(this.a() + text);
    timeEnd = (text) => Logger.timeEnd(this.a() + text);
}
exports.ClassLogger = ClassLogger;
/*
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    Reset: "\x1b[0m",       // Reset coloured text

    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

"\x1b[NUMEROm"


FG  BG

30	40	Black
31	41	Red
32	42	Green
33	43	Yellow
34	44	Blue
35	45	Magenta
36	46	Cyan
37	47	White
90	100	Bright Black (Gray)
91	101	Bright Red
92	102	Bright Green
93	103	Bright Yellow
94	104	Bright Blue
95	105	Bright Magenta
96	106	Bright Cyan
97	107	Bright White
*/ 
//# sourceMappingURL=Logger.js.map