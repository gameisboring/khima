const express = require('express')
const router = express.Router()
const { logger, logError, logReqInfo } = require('../lib/winston')
var pool = require('../lib/db')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 메인(로그인)
router.get('/', async function (req, res, next) {
  logReqInfo(req)
  checkStart(req, res)
})
// 등록
router.get('/register', function (req, res, next) {
  logReqInfo(req)
  res.redirect('/')
})
// 로그인
router.get('/login', function (req, res, next) {
  logReqInfo(req)
  res.redirect('/')
})

// 로그인 정보 처리 미들웨어
router.post('/login', async (req, res, next) => {
  // 요청 body 변수 할당
  console.log(req.body)
  const { account, name } = req.body
  logReqInfo(req, account, name)
  // 시청자 정보 조회
  try {
    const sql = 'SELECT * FROM `nfun`.`USERS` WHERE ACCOUNT = ? AND NAME = ?;'
    const [rows, fields] = await pool.query(sql, [account, name])
    // if 조회 정보 없음
    if (rows.length === 0) {
      logger.error(`로그인 실패 | 등록번호 : ${account} | 이름 : ${name}`)
      res.json({ ok: false })
    } else {
      if (rows[0].ROLE == 'A') {
        // 관리자 제어
        logger.info(`관리자 로그인 | 등록번호 : ${account} | 이름 : ${name}`)
        res.status(200).json({ ok: true, role: 'a' })
        return
      } else if (rows[0].ROLE == 'V') {
        logger.info(
          `로그인 성공 | 등록번호 : ${account} | 이름 : ${name} | 직책 : ${
            rows[0].ROLE === 'A' ? '관리자' : '시청자'
          }`
        )
        res.status(200).json({ ok: true, role: 'v' })
        return
      } else {
        logger.error(
          `유저 역할 정보 조회 실패 (POST /login SELECT) | 등록번호 : ${account} | 이름 : ${name}`
        )
        console.log(error)
        res.json({ ok: false })
      }
    }
  } catch (error) {
    logger.error(
      `유저 조회 실패 (POST /login SELECT) | 등록번호 : ${account} | 이름 : ${name}`
    )
    console.log(error)
    res.json({ ok: false })
  }
})

// 홈 화면
router.get('/home', async function (req, res) {
  const account = req.query.acc

  if (account) {
    try {
      const [rows, fields] = await pool.query(
        'SELECT NAME FROM `nfun`.`USERS` WHERE ACCOUNT = ?',
        [account]
      )
      const name = rows[0].NAME
      if (rows.length > 0) {
        const sql =
          'insert into NFUN.LOGS(LOGS_ACCOUNT,LOGS_NAME) values (?,(SELECT NAME FROM USERS WHERE ACCOUNT = ?));'

        const [INSERT_rows, INSERT_fields] = await pool.query(sql, [
          account,
          account,
        ])
        if (INSERT_rows.affectedRows <= 0) {
          logError(req, account, name)
        } else {
          logReqInfo(req, account, name)
        }
        res.render('home', {
          account: account,
          name: name,
          title: process.env.MAINPAGE_TITLE,
        })
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

router.post('/home', async (req, res) => {
  const { acc, name } = req.body
  logReqInfo(req, acc, name)
  try {
    await pool.query(
      'INSERT INTO nfun.logs(`LOGS_ACCOUNT`,`LOGS_NAME`) VALUES (?,?);',
      [acc, name]
    )

    res.json({ ok: true })
  } catch (error) {
    console.log(error)
  }
})

// 홈화면 질문 처리 미들웨어
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
