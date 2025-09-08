export type ContextData = { requestId?: string, commandId?: string, userId?: string, serverId?: string };
export type ContextDataKey = "request-id" | "command-id" |  "user-id" | "server-id";
export type LogLevel = { id: number, label: string, color: string };