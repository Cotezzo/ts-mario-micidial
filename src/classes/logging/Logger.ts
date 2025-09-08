import Context from "./Context";
import { LogLevel } from "./types";

export default class Logger {

    /* ==== PUBLIC STATIC METHODS =========================================== */
    public static trace =  (msg: string)               =>  Logger.print(Logger.LogLevels.trace, msg);
    public static debug =  (msg: string)               =>  Logger.print(Logger.LogLevels.debug, msg);
    public static info =   (msg: string)               =>  Logger.print(Logger.LogLevels.info,  msg);
    public static warn =   (msg: string, e?: Error)    =>  Logger.print(Logger.LogLevels.warn,  msg, e);
    public static error =  (msg: string, e?: Error)    =>  Logger.print(Logger.LogLevels.error, msg, e);

    /* ==== STATIC CONFIGURATION ============================================ */
    /** Format separators characters to be used to change the text color */
    private static readonly Colors: { [k: string]: string } = {
        reset: "\x1b[0m",   dim: "\x1b[90m",    bright: "\x1b[1m",  red: "\x1b[31m",
        yellow: "\x1b[33m", green: "\x1b[32m",  blue: "\x1b[36m",   purple: "\x1b[35m"
    }

    /** Available logging levels - contain metadata used to format the logs */
    private static readonly LogLevels: { [k: string]: LogLevel } = {
        trace:  { id: 0, label: "TRC", color: Logger.Colors.purple  },
        debug:  { id: 1, label: "DBG", color: Logger.Colors.blue    },
        info:   { id: 2, label: "INF", color: Logger.Colors.green   },
        warn:   { id: 3, label: "WRN", color: Logger.Colors.yellow  },
        error:  { id: 4, label: "ERR", color: Logger.Colors.red     },
    }

    /** Logger date options - format "20/05/2024, 22:06:31.531". */
    private static readonly dateOptions: any/*Intl.DateTimeFormatOptions*/ = {
        year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric",
        fractionalSecondDigits: 3
    };
    
    /** Global log level retrieved and set by the environment - if none is found, info is used. */
    private static readonly logLevel: LogLevel = (() => {
        if(process.env.LOG_LEVEL)
            for(const entry of Object.entries(Logger.LogLevels)) {
                const [k, v] = entry;
                if(process.env.LOG_LEVEL.toUpperCase() === k.toUpperCase()) return v;
            }
    
        return Logger.LogLevels.info;
    })();

    /* ==== PRIVATE STATIC METHODS ========================================== */
    /** Prints coloured log level and timestamp, followed by message and error stacktrace (if any).
     *  Ex: "[INFO] 20/05/2024, 22:06:31.531 [//] Hello world!"
     *  @param {Logger.LogLevels} logLevel Log level associated with this log.
     *  @param {string} message Log message to be printed.
     *  @param {Error?} error Exception to be logged (optional). */
    private static print = (logLevel: LogLevel, message: string, error?: Error) => {

        // If global level is higher than input level, don't log (ex: DEBUG < INFO = don't log)
        if(logLevel.id < Logger.logLevel.id) return;

        // Retrieve current context informations
        const { requestId, commandId, userId, serverId } = Context.get();

        // Generate and format log message
        const log = `\r[${logLevel.color}${logLevel.label}${Logger.Colors.reset}]${Logger.Colors.bright} \
${Logger.Colors.dim}${new Date().toLocaleTimeString("en-GB", Logger.dateOptions)}${Logger.Colors.reset}${Logger.getPackage()} \
[${commandId}/${userId}/${serverId}/${requestId}] ${message}`;

        // If there is an error to be displayed, use console.error to print the stacktrace
        if(error)   console.error(log, error);
        else        console.log(log);
    }

    static packageEnabled = process.env.LOG_PACKAGE_ENABLED ?? true;
    /** Retrieves the current package in which the logger has been called and
     *  produces a readable package path to be printed with the log. */
    static getPackage() {
        if(!Logger.packageEnabled) return undefined;
        try {
            // Artificially create stack trace
            const stack: string | undefined = new Error().stack;
            if(!stack) return "";

            // Assuming the code is inside the /src/ directory (and there are
            // not /src/ directories inside the /src/ directory) and that the
            // file extension is ejs, js or ts, retrieve the caller fileName.
            let filePath: string | undefined = stack.split("\n", 5)[4];

            const regex = /at (.+?) \(/;
            const match = filePath.match(regex);
            let functionName = "";
            /*if (match) {
                functionName = `::${match[1]}`;
            } */

            filePath = filePath.split("src").pop();
            if(!filePath) return "";
            filePath = filePath.split(/\.e?[tj]s/g, 1)[0];

            // Retrieve directory chain
            let dirs = filePath.split(/[/\\]/g);
            // Remove first empty element
            dirs.shift();
            // Save fileName
            const fileName = dirs.pop();
            if(!fileName) return "";
            // Shorten directories to their first letter
            dirs = dirs.map(d => d.charAt(0));
            // Add complete fileName
            dirs.push(fileName);
            // Recreate path with short package names and '.'s instead of '/'s.
            const pkg = dirs.join(".");

            return ` [${pkg}${functionName}]`;
        } catch(e) {
            console.error("Error retrieving package", e);
            return "";
        }
    }
}