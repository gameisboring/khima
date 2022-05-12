function removeMask() {
  // $('#mask').fadeOut(1e3), $('.window').hide()

  document.getElementById('mask')
  hide()
}

function hide() {
  var div = document.getElementById('mask')
  opacity = Number(window.getComputedStyle(div).getPropertyValue('opacity'))

  if (opacity > 0) {
    //Fade out 핵심 부분
    opacity = opacity - 0.1
    div.style.opacity = opacity
    //img.style.opacity=opacity;
  } else {
    clearInterval(intervalID)
  }
}

function getUsersListWithAjax() {
  $.ajax({
    url: '/admin/book',
    method: 'GET',
    dataType: 'JSON',
    success: (t) => {
      if (t.length > 0)
        for (var e in (console.log(t.length + '명의 참석자 정보 불러오기 성공'),
        $('#booked-body').empty(),
        t))
          bookRender(t[e])
    },
  })
}
function getQuestionListWithAjax() {
  $.ajax({
    url: '/admin/question',
    method: 'GET',
    dataType: 'JSON',
    success: (t) => {
      if (($('#question-body').empty(), t.length > 0))
        for (var e in (console.log(t.length + '개의 질문 정보 불러오기 성공'),
        t))
          questionRender(t[e])
      else nullQuestionRender()
    },
  })
}
function getInfoWithAjax() {
  $.ajax({
    url: '/admin/info',
    method: 'GET',
    dataType: 'JSON',
    success: (t) => {
      t.length > 0 && infoRender(t[0])
    },
  })
}

function bookRender(t) {
  const e = $('#booked-body'),
    s = `\n      <td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="text-sm font-medium text-gray-900">${
      t.NAME
    }</div></div></td><td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-900">${
      t.ACCOUNT
    }</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
      'A' === t.ROLE ? '관리자' : '시청자'
    }</td>`,
    n = document.createElement('tr')
  ;(n.innerHTML = s), e.append(n)
}

function questionRender(t) {
  const e = $('#question-body'),
    s = new Date(t.QST_TIME).toLocaleString(),
    n = `<td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center"><div class="text-sm font-medium text-gray-900">${t.QST_NAME}</div></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${s}</td>`,
    i = document.createElement('tr'),
    d = document.createElement('td'),
    k = document.createElement('div')

  ;(i.innerHTML = n),
    (d.classList = 'px-6 py-4 whitespace-nowrap'),
    (k.classList = 'text-sm text-gray-900'),
    (k.innerText = t.QST_CONTEXT),
    d.append(k),
    i.append(d)
  e.append(i)
}

function infoRender(t) {
  $('#hit-count').text(t.HITS),
    $('#user-count').text(t.USERS),
    $('#question-count').text(t.QUESTIONS)
}
function nullQuestionRender() {
  const t = $('#question-body'),
    e = document.createElement('tr')
  ;(e.innerHTML =
    '<td class="px-6 py-4 whitespace-nowrap">\n    <div class="flex items-center">\n      <div class="">\n        <div class="text-sm font-medium text-gray-900">현재 입력된 데이터가 없습니다</div>\n      </div>\n    </div>\n  </td>'),
    t.append(e)
}

function setUptime() {
  const t = new Date().getTime() - new Date('2022-05-26 09:00:00').getTime(),
    e = Math.abs(Math.floor(t / 864e5)),
    s = String(Math.abs(Math.floor((t / 36e5) % 24))).padStart(2, '0'),
    n = String(Math.abs(Math.floor((t / 6e4) % 60))).padStart(2, '0'),
    i = String(Math.abs(Math.floor((t / 1e3) % 60))).padStart(2, '0')
  t < 0
    ? $('#start-time').text(`D - ${e}일 ${s}시간 ${n}분 ${i}초`)
    : $('#start-time').text(`${e}일 ${s}시간 ${n}분 ${i}초`)
}

function getQuestionList() {
  $('#users').css('display', 'none'),
    getQuestionListWithAjax(),
    $('#questions').css('display', 'flex')
}

function getUsersList() {
  $('#questions').css('display', 'none'),
    getUsersListWithAjax(),
    $('#users').css('display', 'flex')
}
$(document).ready(() => {
  setUptime(),
    setInterval(() => {
      setUptime()
    }, 1e3)
}),
  $(window).load(function () {
    removeMask(),
      getUsersListWithAjax(),
      getQuestionListWithAjax(),
      getInfoWithAjax()
  }),
  $('#download-users-button').on('click', function () {}),
  $('#download-question-button').on('click', function () {
    $.ajax({
      url: '/admin/question/download',
      type: 'get',
      dataType: 'JSON',
      success: (t) => {
        console.log(t)
      },
    })
  })
setInterval(() => {
  getQuestionListWithAjax(), getUsersListWithAjax(), getInfoWithAjax()
}, 5e3)
