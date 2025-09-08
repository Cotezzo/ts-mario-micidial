import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { ContextData, ContextDataKey } from './types';

export default class Context {

    /* ==== PROPERTIES ====================================================== */
    /** Object that creates stores that stay coherent through asynchronous operations.
     *  Used to store and read context data such as request-id, user-id and called APIs. */
    static storage = new AsyncLocalStorage<Map<string, string>>();

    /* ==== METHODS ========================================================= */
    /** Middleware to attach context data and unique request-id to each request.
     *  Used to maintain request-specific data across asynchronous operations.
     *  @param {ContextData} contextData Initial context data.
     *  @param {() => O} callback Method to be called.
     *  @return {O} Callback return value. */
    static initialize<O>({ requestId, commandId, userId, serverId }: ContextData, callback: () => O): O {
        // Initialize new store as a Map
        return Context.storage.run(new Map(), () => {

            // No request-id is given, generate random UUID
            Context.set("request-id", requestId || uuidv4());
            Context.set("command-id", commandId);
            Context.set("user-id", userId);
            Context.set("server-id", serverId);

            // Run and return callback
            return callback();
        });
    };

    /** Add context information by key.
     *  @param {ContextDataKey} key Name of the context information.
     *  @param {string | null} value Value to be associated with the key. */
    static set(key: ContextDataKey, value?: string) {
        if(value) Context.storage.getStore()?.set(key, value);
    };

    /** Retrieves the information saved in the storage.
     *  If properties have not been initialized, empty values are returned instead.
     *  @return {ContextData} Context data. */
    static get(): ContextData {
        const store = Context.storage.getStore();
        return {
            requestId:  store?.get("request-id")    ?? "",
            commandId:  store?.get("command-id")    ?? "",
            userId:     store?.get("user-id")       ?? "",
            serverId:   store?.get("server-id")     ?? ""
        }
    }
}