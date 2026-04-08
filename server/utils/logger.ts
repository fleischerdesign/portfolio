export interface LogContext {
  service?: string;
  action?: string;
  entity?: string;
  entityId?: number;
  userId?: number;
  [key: string]: unknown;
}

interface LogEntry {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: string;
  context: LogContext;
  error?: string;
}

const formatLogEntry = (entry: LogEntry): string => {
  return JSON.stringify(entry);
};

export const logger = {
  info: (context: LogContext, message: string): void => {
    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    console.log(formatLogEntry(entry));
  },

  warn: (context: LogContext, message: string): void => {
    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    console.warn(formatLogEntry(entry));
  },

  error: (
    context: LogContext,
    message: string,
    error?: Error | unknown,
  ): void => {
    const entry: LogEntry = {
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error instanceof Error ? error.message : String(error),
    };
    console.error(formatLogEntry(entry));
  },

  debug: (context: LogContext, message: string): void => {
    if (process.env.NODE_ENV !== "production") {
      const entry: LogEntry = {
        level: "debug",
        message,
        timestamp: new Date().toISOString(),
        context,
      };
      console.log(formatLogEntry(entry));
    }
  },
};

export const createLogger = (service: string) => ({
  info: (action: string, message: string, extra?: LogContext) =>
    logger.info({ service, action, ...extra }, message),
  warn: (action: string, message: string, extra?: LogContext) =>
    logger.warn({ service, action, ...extra }, message),
  error: (
    action: string,
    message: string,
    error?: Error | unknown,
    extra?: LogContext,
  ) => logger.error({ service, action, ...extra }, message, error),
  debug: (action: string, message: string, extra?: LogContext) =>
    logger.debug({ service, action, ...extra }, message),
});
