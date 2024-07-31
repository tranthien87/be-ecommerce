
const {createLogger, format, transports} = require('winston');
const { v4: uuidv4 } = require('uuid');
require('winston-daily-rotate-file');

class MyLogger {

    constructor() {
        const formatPrintf = format.printf(({
            level, message, requestId, timestamp, metadata, context
        }) => {
            return `${timestamp} - ${level} - ${context} - ${requestId} - ${message} - ${JSON.stringify(metadata)}`
        })

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({format: "YYYY-MM-DD hh:mm:ss.SSS A"}),
                formatPrintf
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname:'src/logs',
                    level: 'info',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({format: "YYYY-MM-DD hh:mm:ss.SSS A"}),
                        formatPrintf
                    )
                  }),
                  new transports.DailyRotateFile({
                    dirname:'src/logs',
                    level: 'error',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({format: "YYYY-MM-DD hh:mm:ss.SSS A"}),
                        formatPrintf
                    )
                  })
            ]
        })

        
    }
    commonParam(params) {
        let context, req, metadata;
        if(!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params
        }
        const requestId = req?.requestId || uuidv4();
        return {
            context,
            req,
            metadata
        }
    }

    setInfoLog(message, params) {
        const paramsLog = this.commonParam(params);
        const logObject = Object.assign({message}, paramsLog);
        this.logger.info(logObject);
    }

    setErrorLog(message, params) {
        const paramsLog = this.commonParam(params);
        const logObject = Object.assign({message}, paramsLog);
        this.logger.error(logObject);
    }
}


module.exports = new MyLogger();