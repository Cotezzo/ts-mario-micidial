export interface Command {
    fn(...args: any[]): any;
    name: string;
    aliases?: string;
    category?: string;
    description?: string;
    usage?: string;
}
export interface Commands<Command> {
    [command: string]: Command;
}
