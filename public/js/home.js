'use strict'

var agent = navigator.userAgent.toLowerCase()
if (
  (navigator.appName == 'Netscape' &&
    navigator.userAgent.search('Trident') != -1) ||
  agent.indexOf('msie') != -1
) {
  alert(
    'Internet Explorer(인터넷 익스플로러)는 호환되지 않는 브라우저 입니다. 크롬,엣지,파이어폭스,웨일 과 같은 브라우저로 이용해주시기 바랍니다'
  )
}

$(document).ready(function () {
  console.log('home')
  removeMask()
})
function getAccount() {
  const account = new URL(window.location.href).searchParams.get('acc')
  return account
}
function removeMask() {
  $('#mask').fadeOut(1000)
  $('.window').hide()
}

$('#question-submit-button').on('click', function () {
  if (!$('.question-box > textarea').val()) {
    Swal.fire({
      icon: 'warning',
      title: '질문하실 메세지를 작성해주세요',
    })
    return false
  }
  $.ajax({
    url: '/home/question',
    type: 'POST',
    data: {
      account: getAccount(),
      name: $('.question-box > input').val(),
      context: $('.question-box > textarea').val(),
    },
    dataType: 'JSON',
    success: function (res) {
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: '질문이 성공적으로 제출되었습니다',
        })
        $('.question-box > textarea').val('')
      } else {
        Swal.fire({
          icon: 'error',
          title: '질문 제출에 실패했습니다',
        })
      }
    },
  })
})

setInterval(() => {
  $.ajax({
    url: '/home',
    type: 'POST',
    data: {
      acc: getAccount(),
      name: $('.question-box > input').val(),
    },
    dataType: 'JSON',
    success: () => {
      console.log('ping success')
    },
  }).fail(() => {
    console.log('ping fail')
  })
}, 1000 * 100)
