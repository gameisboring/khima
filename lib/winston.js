const winston = require('winston')
const winstonDaily = require('winston-daily-rotate-file')
const requestIp = require('request-ip')

let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  // winston.format.printf((info) => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`)
  winston.format.printf(
    (info) => `[${info.timestamp}] | [${info.level}] | ${info.message}`
  )
)

let notalignColorsAndTime = winston.format.combine(
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD|HH:MM:SS',
  }),
  winston.format.printf(
    (info) => `[${info.timestamp}] | [${info.level}] | ${info.message}`
  )
)

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winstonDaily({
      filename: 'logs/my_log',
      zippedArchive: true,
      format: winston.format.combine(notalignColorsAndTime),
    }),

    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
})

// 요청 로그 남기기
const logReqInfo = (req, account, name, object) => {
  const ip = requestIp.getClientIp(req)
  if (object) {
    var key = Object.keys(object)
    var val = Object.values(object)
  }

  const agent = req.header('User-Agent')
  logger.info(
    `${req.method} ${req.url} | FROM : ${ip} | ACCOUNT : ${
      account ? account : 'null'
    } | NAME : ${name ? name : 'null'} | USERAGENT : ${agent} | ${
      key != undefined ? key + ' : ' + val : ''
    }`
  )
}

// 에러 로그 남기기
const logError = (req, account, name, object) => {
  const ip = requestIp.getClientIp(req)
  if (object) {
    const key = Object.keys(object)
    const val = Object.values(object)
    logger.error(
      `${req.method} ${req.url} | FROM : ${ip} | ACCOUNT : ${
        account ? account : 'null'
      } | NAME : ${name ? name : 'null'} | ${key ? key + ' : ' + val : ''}`
    )
  } else {
    logger.error(
      `${req.method} ${req.url} | FROM : ${ip} | ACCOUNT : ${
        account ? account : 'null'
      } | NAME : ${name ? name : 'null'} `
    )
  }
}

module.exports = { logger, logError, logReqInfo }
