import { Talker } from "../classes/Talker";
import { Command, Commands } from "../interfaces/CommandLogic";
declare const logicHandler: Commands<Command>;
export declare const getTalker: (guildId: string) => Talker;
export { logicHandler };
