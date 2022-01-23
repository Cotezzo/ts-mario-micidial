export declare class Logger {
    static time: (text: string) => void;
    static timeEnd: (text: string) => void;
    static debug: (text: string) => void;
    static log: (text: string) => void;
    static info: (text: string) => void;
    static warn: (text: string) => void;
    static error: (text: string) => void;
    private static getString;
    private static getStringWithoutDate;
}
export declare class ClassLogger {
    private className;
    private isProd;
    constructor(className: string);
    private a;
    debug: (text: string) => void;
    log: (text: string) => void;
    info: (text: string) => void;
    warn: (text: string) => void;
    error: (text: string) => void;
    time: (text: string) => void;
    timeEnd: (text: string) => void;
}
