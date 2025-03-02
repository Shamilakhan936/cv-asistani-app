type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogMessage[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logMessage = this.formatMessage(level, message, data);
    this.logs.push(logMessage);

    // Console'a yazdır
    const consoleMessage = `[${logMessage.timestamp}] ${level.toUpperCase()}: ${message}`;
    switch (level) {
      case 'info':
        console.log(consoleMessage, data || '');
        break;
      case 'warn':
        console.warn(consoleMessage, data || '');
        break;
      case 'error':
        console.error(consoleMessage, data || '');
        break;
      case 'debug':
        console.debug(consoleMessage, data || '');
        break;
    }

    // Burada ileride loglama servisi eklenebilir (örn: CloudWatch, Sentry vb.)
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }

  // Son n adet logu getir
  getLogs(count: number = 100): LogMessage[] {
    return this.logs.slice(-count);
  }

  // Belirli bir seviyedeki logları getir
  getLogsByLevel(level: LogLevel): LogMessage[] {
    return this.logs.filter(log => log.level === level);
  }

  // Logları temizle
  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 