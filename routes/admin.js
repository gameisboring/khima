var express = require('express')
var router = express.Router()
const { logReqInfo } = require('../lib/winston')
var pool = require('../lib/db')

// 관리자 화면
router.get('/', async function (req, res, next) {
  const account = req.query.acc

  if (account) {
    try {
      const [rows, fields] = await pool.query(
        "SELECT NAME FROM `nfun`.`USERS` WHERE ACCOUNT = ? AND ROLE = 'A'",
        [account]
      )
      if (rows.length > 0) {
        const name = rows[0].NAME
        logReqInfo(req, account, name)
        res.render('admin', { title: process.env.ADMINPAGE_TITLE })
        return
      }
    } catch (error) {
      console.log(error)
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.write(
    "<script> alert('잘못된 접근입니다. 로그인을 통해 접속해주세요.'); "
  )
  res.write('window.location="/" </script>')
  res.end()
})

// 관리자 유저 리스트 쿼리
router.get('/book', async function (req, res, next) {
  logReqInfo(req)
  try {
    const sql = 'SELECT * FROM `nfun`.`USERS`;'
    const [rows, fields] = await pool.query(sql)
    rows.ok = true
    res.json(rows)
  } catch (error) {
    logger.error('유저 목록 조회 실패')
    console.log(error)
  }
})

// 관리자 유저 리스트 다운로드
router.get('/book/download', async function (req, res, next) {
  logReqInfo(req)
  try {
    const sql =
      'SELECT NAME 이름, ACCOUNT 등록번호 FROM `nfun`.`USERS` WHERE ROLE = "V";'

    const [rows, fields] = await pool.query(sql)
    const csvFromRowsObject2 = xlsx.utils.json_to_sheet(rows)
    const stream = xlsx.stream.to_csv(csvFromRowsObject2)

    const fileName =
      __dirname +
      '/public/download/' +
      process.env.MAINPAGE_TITLE +
      '_참가자리스트.csv'

    stream.pipe(fs.createWriteStream(fileName))

    res.download(fileName)
  } catch (error) {
    logger.error('유저 목록 조회 실패')
    console.log(error)
  }
})

// 관리자 질문 리스트 쿼리
router.get('/question', async function (req, res, next) {
  logReqInfo(req)
  try {
    const sql = 'SELECT * FROM `nfun`.`QUESTION`;'
    const [rows, fields] = await pool.query(sql)
    rows.ok = true
    res.json(rows)
  } catch (error) {
    logger.error('질문 목록 조회 실패')
    console.log(error)
  }
})

// 관리자 질문 리스트 다운로드
router.get('/question/download', async function (req, res, next) {
  logReqInfo(req)
  try {
    const sql =
      'SELECT QST_TIME 질문시각 ,QST_NAME 이름,QST_ACCOUNT 면허번호,QST_CONTEXT 질문내용 FROM `nfun`.`QUESTION`;'

    const [rows, fields] = await pool.query(sql)
    rows.forEach((data) => {
      data.질문시각 = new Date(data.질문시각).toLocaleString()
    })

    const fileServe = new Promise((res, rej) => {
      if (rows) {
        const csvFromRowsObject2 = xlsx.utils.json_to_sheet(rows)
        const stream = xlsx.stream.to_csv(csvFromRowsObject2)
        const fileName =
          __dirname +
          '/public/download/' +
          process.env.MAINPAGE_TITLE +
          '_질문리스트.csv'
        stream.pipe(fs.createWriteStream(fileName))
        res(fileName)
      }
    })

    fileServe.then((fileName) => {
      res.sendFile(fileName)
    })
  } catch (error) {
    logger.error('질문 목록 조회 실패')
    console.log(error)
  }
})

// 어드민 정보 조회 쿼리
router.get('/info', async function (req, res, next) {
  logReqInfo(req)

  try {
    const sql =
      'SELECT (SELECT COUNT(*) FROM NFUN.LOGS) HITS , (SELECT COUNT(*) FROM NFUN.USERS) USERS, (SELECT COUNT(*) FROM NFUN.QUESTION) QUESTIONS, START FROM NFUN.CONFIG;'
    const [rows, fields] = await pool.query(sql)
    rows.ok = true
    res.json(rows).status(200)
  } catch (error) {
    logger.error('관리자 정보 목록 조회 실패')
    console.log(error)
  }
})

module.exports = router
