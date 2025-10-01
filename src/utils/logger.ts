import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Log levels type
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

// Logger configuration interface
export interface LoggerConfig {
  level?: LogLevel;
  context?: string;
  enableFileLogging?: boolean;
  enableRotation?: boolean;
  logDirectory?: string;
  maxFiles?: string;
  maxSize?: string;
  enableConsole?: boolean;
}

export class Logger {
  private logger: winston.Logger;
  private context: string;
  private static instances: Map<string, Logger> = new Map();

  constructor(context: string = 'App', config: LoggerConfig = {}) {
    this.context = context;
    
    // Ensure logs directory exists
    const logDirectory = config.logDirectory || 'logs';
    this.ensureLogDirectoryExists(logDirectory);

    // Default configuration
    const defaultConfig: Required<LoggerConfig> = {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      context,
      enableFileLogging: process.env.NODE_ENV !== 'test',
      enableRotation: process.env.NODE_ENV === 'production',
      logDirectory,
      maxFiles: '14d', // Keep logs for 14 days
      maxSize: '20m',  // Max file size 20MB
      enableConsole: true,
      ...config,
    };

    this.logger = winston.createLogger({
      level: defaultConfig.level,
      format: this.createLogFormat(context),
      transports: this.createTransports(defaultConfig),
      // Handle uncaught exceptions and rejections
      exceptionHandlers: defaultConfig.enableFileLogging 
        ? [new winston.transports.File({ filename: join(logDirectory, 'exceptions.log') })]
        : [],
      rejectionHandlers: defaultConfig.enableFileLogging 
        ? [new winston.transports.File({ filename: join(logDirectory, 'rejections.log') })]
        : [],
      exitOnError: false, // Don't exit on handled exceptions
    });
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectoryExists(logDirectory: string): void {
    try {
      if (!existsSync(logDirectory)) {
        mkdirSync(logDirectory, { recursive: true });
      }
    } catch (error) {
      console.warn(`Failed to create log directory ${logDirectory}:`, error);
    }
  }

  /**
   * Create log format with context
   */
  private createLogFormat(context: string): winston.Logform.Format {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const baseFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    );

    if (isProduction) {
      // JSON format for production (better for log aggregation)
      return winston.format.combine(
        baseFormat,
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
          const logObject: any = {
            timestamp,
            level: level.toUpperCase(),
            context,
            message,
            ...(metadata || {}),
          };
          
          if (stack) {
            logObject.stack = stack;
          }
          
          return JSON.stringify(logObject);
        })
      );
    } else {
      // Human-readable format for development
      return winston.format.combine(
        baseFormat,
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
          const contextStr = context ? `[${context}]` : '';
          const metaStr = Object.keys(metadata || {}).length > 0 
            ? `\n${JSON.stringify(metadata, null, 2)}` 
            : '';
          const stackStr = stack ? `\n${stack}` : '';
          
          return `${timestamp} ${level} ${contextStr} ${message}${metaStr}${stackStr}`;
        })
      );
    }
  }

  /**
   * Create winston transports
   */
  private createTransports(config: Required<LoggerConfig>): winston.transport[] {
    const transports: winston.transport[] = [];

    // Console transport
    if (config.enableConsole) {
      transports.push(new winston.transports.Console({
        level: config.level,
        handleExceptions: true,
        handleRejections: true,
      }));
    }

    // File transports
    if (config.enableFileLogging) {
      if (config.enableRotation) {
        // Rotating file transport for production
        transports.push(
          new DailyRotateFile({
            filename: join(config.logDirectory, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: config.maxFiles,
            maxSize: config.maxSize,
            level: config.level,
            handleExceptions: true,
            handleRejections: true,
          }),
          new DailyRotateFile({
            filename: join(config.logDirectory, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: config.maxFiles,
            maxSize: config.maxSize,
            level: 'error',
            handleExceptions: true,
            handleRejections: true,
          })
        );
      } else {
        // Simple file transport for development
        transports.push(
          new winston.transports.File({
            filename: join(config.logDirectory, 'combined.log'),
            level: config.level,
            handleExceptions: true,
            handleRejections: true,
          }),
          new winston.transports.File({
            filename: join(config.logDirectory, 'error.log'),
            level: 'error',
            handleExceptions: true,
            handleRejections: true,
          })
        );
      }
    }

    return transports;
  }

  /**
   * Create child logger with additional context
   */
  child(childContext: string, metadata: Record<string, any> = {}): winston.Logger {
    return this.logger.child({ context: `${this.context}:${childContext}`, ...metadata });
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log HTTP message (useful for request/response logging)
   */
  public http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Enhanced error logging with better error object handling
   */
  public error(message: string, error?: any, meta?: any): void {
    const errorMeta = { ...meta };
    
    if (error instanceof Error) {
      errorMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorMeta.error = error;
    }
    
    this.logger.error(message, errorMeta);
  }

  /**
   * Set log level dynamically
   */
  public setLevel(level: LogLevel): void {
    this.logger.level = level;
  }

  /**
   * Get current log level
   */
  public getLevel(): string {
    return this.logger.level;
  }

  /**
   * Add transport dynamically
   */
  public addTransport(transport: winston.transport): void {
    this.logger.add(transport);
  }

  /**
   * Remove transport
   */
  public removeTransport(transport: winston.transport): void {
    this.logger.remove(transport);
  }

  /**
   * Profile timing for performance monitoring
   */
  public profile(id: string, meta?: any): void {
    this.logger.profile(id, meta);
  }

  /**
   * Start timing for performance monitoring
   */
  public startTimer(): winston.Profiler {
    return this.logger.startTimer();
  }

  /**
   * Get singleton logger instance
   */
  public static getInstance(context: string = 'App', config?: LoggerConfig): Logger {
    if (!Logger.instances.has(context)) {
      Logger.instances.set(context, new Logger(context, config));
    }
    return Logger.instances.get(context)!;
  }

  /**
   * Create new logger instance
   */
  public static create(context: string, config?: LoggerConfig): Logger {
    return new Logger(context, config);
  }

  /**
   * Clear all singleton instances (useful for testing)
   */
  public static clearInstances(): void {
    Logger.instances.clear();
  }

  /**
   * Get underlying winston logger (for advanced use cases)
   */
  public getWinstonLogger(): winston.Logger {
    return this.logger;
  }
}

// Export default logger instance for HttpService
export const logger = Logger.getInstance('HttpService');

// Export additional pre-configured loggers for different contexts
export const httpLogger = Logger.getInstance('HTTP', { level: 'http' });
export const dbLogger = Logger.getInstance('Database');
export const authLogger = Logger.getInstance('Auth');
export const mcpLogger = Logger.getInstance('MCP');

// Export logger factory function
export const createLogger = (context: string, config?: LoggerConfig): Logger => {
  return Logger.create(context, config);
};

// Export singleton getter
export const getLogger = (context: string, config?: LoggerConfig): Logger => {
  return Logger.getInstance(context, config);
};