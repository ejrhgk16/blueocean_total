import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment-timezone';

const koreanTime = () => moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

export const loggerConfig = WinstonModule.createLogger({
  levels:{
    error: 0,
    warn:1,
    customInfo: 2,
    info:3
  },
  transports: [
    new winston.transports.DailyRotateFile({
      filename: './logfiles/back_log_error-%DATE%.log',
      datePattern: 'YYYY-MM',
      level: 'customInfo',
      format: winston.format.combine(
        winston.format.timestamp({ format: koreanTime }),
        winston.format.json()
      ),
      maxSize: '20m',
      maxFiles: '12',
    }),
  ],
});