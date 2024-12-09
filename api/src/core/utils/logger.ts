import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { logConfig } from '@/config/log';
import { appConfig } from '@/config/app';
import { LogLevel } from 'typeorm';

export class Logger {
  private static instance: winston.Logger;

  private static createLogger(): winston.Logger {
    if (!fs.existsSync(logConfig.DIR)) {
      fs.mkdirSync(logConfig.DIR, { recursive: true });
    }

    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: logConfig.DATETIME_FORMAT }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
        const metadataStr = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
        return `[${timestamp}] ${level}: ${message}${metadataStr}${stack ? `\n${stack}` : ''}`;
      })
    );

    const transports: winston.transport[] = [];

    if (logConfig.CONSOLE_ENABLED) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize({ all: true }), logFormat),
        })
      );
    }

    if (logConfig.FILE_ENABLED) {
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: path.join(logConfig.DIR, 'app-%DATE%.log'),
          datePattern: logConfig.DATE_FORMAT,
          zippedArchive: true,
          maxSize: logConfig.MAX_SIZE,
          maxFiles: logConfig.MAX_FILES,
        })
      );
    }

    return winston.createLogger({
      level: logConfig.LEVEL,
      format: logFormat,
      transports,
    });
  }

  private static getInstance(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = this.createLogger();
    }
    return Logger.instance;
  }

  public static info(message: string, metadata?: object): void {
    this.getInstance().info(message, metadata);
  }

  public static error(message: string, error?: Error | null, metadata?: object): void {
    const logMeta = {
      ...metadata,
      ...(error && { stack: error.stack }),
    };
    this.getInstance().error(message, logMeta);
  }

  public static warn(message: string, metadata?: object): void {
    this.getInstance().warn(message, metadata);
  }

  public static debug(message: string, metadata?: object): void {
    if (appConfig.DEBUG) this.getInstance().debug(message, metadata);
  }

  public static setLevel(level: LogLevel): void {
    this.getInstance().level = level;
  }
}
