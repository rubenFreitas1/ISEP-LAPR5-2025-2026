import winston from 'winston';
import config from '../../config';

const transports = [];
if(process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.Console()
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      )
    })
  )
}

// Durante os testes, mostrar apenas erros
const logLevel = process.env.NODE_ENV === 'test' ? 'error' : config.logs.level;

const LoggerInstance = winston.createLogger({
  level: logLevel,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports
});

export default LoggerInstance;