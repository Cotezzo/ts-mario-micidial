import { CommandMetadata } from "./types";
import Logger from "../classes/logging/Logger";
import { readdir } from 'fs/promises';
import * as path from 'path';

/** Define command-name / metadata map.
 *  The map is used when events such as message creation, slash or interactions
 *  are triggered. These events call the handler methods to parse the input data
 *  and feed them to the actual co command. */
export const commandMetadataMap: { [k: string]: CommandMetadata<any, any> } = {};
export const commandMetadatas: CommandMetadata<any, any>[] = [];

/** Initialize the commandMetadatas map with all the available commands. */
export async function registerCommands() {
    const directoryPath = __dirname;  // path.resolve(__dirname, '../commands');
    const defaultExportsArray: CommandMetadata<any, any>[] = await loadDefaultExports(directoryPath);
  
    for(const commandMetadata of defaultExportsArray) {
        // Ignore non-command files
        if(!commandMetadata?.aliases) continue;

        commandMetadatas.push(commandMetadata);
        for(const alias of commandMetadata.aliases) {
            Logger.debug(`Registering command ${alias}`);
            commandMetadataMap[alias] = commandMetadata;
        }
    }

    Logger.info("All commands registered");
}

/** Dynamically retrieve all exported modules from given path (recursively). */
async function loadDefaultExports(dir: string): Promise<any[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const modules = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return loadDefaultExports(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
      const module = await import(fullPath);
      return module.default;
    }
  }));

  // Flatten the array since loadDefaultExports can return nested arrays
  return modules.flat();
}