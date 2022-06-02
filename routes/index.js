const express = require('express')
const router = express.Router()
const { logger, logError, logReqInfo } = require('../lib/winston')
var pool = require('../lib/db')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

router.get('/', async function (req, res, next) {
  logReqInfo(req)
  checkStart(req, res)
})
router.get('/register', function (req, res, next) {
  logReqInfo(req)
  res.redirect('/')
})
router.get('/login', function (req, res, next) {
  logReqInfo(req)
  res.redirect('/')
})

router.post('/login', async (req, res, next) => {
  console.log(req.body)
  const { account, name } = req.body
  logReqInfo(req, account, name)
  try {
    const sql = `SELECT * FROM nfun.USERS WHERE ACCOUNT = ? AND NAME = ? ORDER BY DATE DESC;`
    const [rows, fields] = await pool.query(sql, [account, name])

    if (rows.length === 0) {
      logger.error(
        `로그인 실패 (입력정보 틀림) | 등록번호 : ${account} | 이름 : ${name}`
      )
      res.json({ ok: false })
      return
    }

    if (rows[0].ROLE == 'A') {
      logger.info(`관리자 로그인 | 등록번호 : ${account} | 이름 : ${name}`)
      res.status(200).json({ ok: true, role: 'a' })
      return
    }

    const userDate = new Date(rows[0].DATE).getDay()
    const now = new Date().getDay()

    console.log(userDate + ' : ' + now)

    if (userDate === now) {
      res.status(200).json({ ok: true, date: true })
      logger.info(
        `로그인 성공 | 등록번호 : ${account} | 이름 : ${name} | 직책 : ${
          rows[0].ROLE === 'A' ? '관리자' : '시청자'
        }`
      )
    } else {
      logger.error(
        `로그인 실패 (신청일자 다름) | 등록번호 : ${account} | 이름 : ${name} | 직책 : ${
          rows[0].ROLE === 'A' ? '관리자' : '시청자'
        }`
      )
      res.status(200).json({ ok: true, date: false })
    }

    return
  } catch (error) {
    logger.error(
      `유저 조회 실패 (POST /login SELECT) | 등록번호 : ${account} | 이름 : ${name}`
    )
    console.log(error)
    res.json({ ok: false })
  }
})

router.get('/home', async function (req, res) {
  const account = req.query.acc

  if (account) {
    try {
      const [rows, fields] = await pool.query(
        `SELECT NAME FROM nfun.USERS WHERE ACCOUNT = ? AND DATE_FORMAT(DATE,'%Y-%m-%d') = DATE_FORMAT(NOW(),'%Y-%m-%d');`,
        [account]
      )
      if (rows.length > 0) {
        const name = rows[0].NAME
        const agent = req.header('User-Agent')
        const url = req.method + ' ' + req.url
        const sql = `INSERT INTO NFUN.LOGS(LOGS_ACCOUNT,LOGS_NAME,URL,ACCESS_TIME) values (?,?,?,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:00'));`
        try {
          const [INSERT_rows, INSERT_fields] = await pool.query(sql, [
            account,
            name,
            url,
          ])
          logReqInfo(req, account, name)
        } catch (error) {
          logError(req, account, name, error)
          return
        } finally {
          res.render('home', {
            account: account,
            name: name,
            title: process.env.MAINPAGE_TITLE,
          })
          return
        }
      }
    } catch (error) {
      console.log(error)
      logReqInfo(req, account)
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(
      "<script> alert('잘못된 접근입니다. 로그인을 통해 접속해주세요.'); "
    )
    res.write('window.location="/" </script>')
    res.end()
  }
})

router.post('/home', async (req, res) => {
  const { acc, name } = req.body
  try {
    logReqInfo(req, acc, name)
    /* const agent = req.header('User-Agent')
    const url = req.method + ' ' + req.url
    await pool.query(
      `INSERT INTO NFUN.LOGS(LOGS_ACCOUNT,LOGS_NAME,URL,ACCESS_TIME) values (?,?,?,DATE_FORMAT(NOW(),'%Y-%m-%d %H:%i:00'));`,
      [acc, name, url]
    ) */
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write("<script> alert('행사가 종료되었습니다.'); ")
    res.write('window.location="/" </script>')
    res.end()
  } catch (error) {
    logError(req, acc, name, error)
  }
})

router.post('/home/question', async function (req, res) {
  const { account, name, context } = req.body
  try {
    logReqInfo(req, account, name, { QUESTION: context })
    const sql = ` INSERT INTO NFUN.QUESTION (QST_CONTEXT,QST_ACCOUNT,QST_NAME) VALUES (?,?,?);`
    const [rows, fields] = await pool.query(sql, [context, account, name])

    if (rows.affectedRows === 1) {
      res.json({ ok: true })
    }
  } catch (error) {
    logError(req, account, name, { QUESTION: context })
    console.log(error)
  }
})

async function checkStart(req, res) {
  try {
    const [rows, fields] = await pool.query(`SELECT START FROM NFUN.CONFIG;`)
    const startDate = new Date(rows[0].START)
    const nowDate = new Date()

    if (nowDate > startDate) {
      res.render('login', { title: process.env.MAINPAGE_TITLE })
    } else {
      res.render('register', {
        title: MAINPAGE_TITLE,
        header: '행사 시작 전',
      })
    }
  } catch (error) {
    logError(req)
    console.log(error)
  }
}

module.exports = router
