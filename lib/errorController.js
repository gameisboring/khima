const httpStatus = require('http-status-codes')
const { logger } = require('./winston')
const requestIp = require('request-ip')

exports.pageNotFoundError = (req, res) => {
  const errorCode = httpStatus.NOT_FOUND
  const ip = requestIp.getClientIp(req)
  const agent = req.header('User-Agent')
  logger.error(
    `Page Not Found Error | ${req.method} ${req.url} | FROM : ${ip} | USERAGENT : ${agent}`
  )
  res.status(errorCode)
  res.send(`${errorCode} | The page does not exist! `)
}

exports.respondInternalError = (errors, req, res, next) => {
  const errorCode = httpStatus.INTERNAL_SERVER_ERROR
  const ip = requestIp.getClientIp(req)
  const agent = req.header('User-Agent')
  logger.error(
    `Respond Internal Error : ${errors.stack} | URL : ${req.method} ${req.url} | FROM : ${ip} | USERAGENT : ${agent}`
  )
  res.status(errorCode)
  res.send(`${errorCode} | Sorry, our application is experiencing a problem!`)
}
