'use strict'

var agent = navigator.userAgent.toLowerCase()
if (
  (navigator.appName == 'Netscape' &&
    navigator.userAgent.search('Trident') != -1) ||
  agent.indexOf('msie') != -1
) {
  alert(
    'Internet Explorer(인터넷 익스플로러)는 호환되지 않는 브라우저 입니다. 크롬,엣지,파이어폭스,웨일 과 같은 브라우저를 이용해주시기 바랍니다'
  )
}

const input_account = $('#account-input')
const input_name = $('#name-input')
const accountCheck = /^[\s0-9]+$/
const nameCheck = /^[가-힣a-zA-Z\s]+$/
$(document).ready(function () {
  removeMask()
})
$('#submitBtn').on('click', function () {
  if (!input_account.val()) {
    try {
      Swal.fire({
        icon: 'warning',
        title: '면허번호를 입력해주세요',
      })
    } catch (error) {
      console.log(error)
      alert('면허번호를 입력해주세요')
    }
    return false
  } else {
    if (!accountCheck.test(input_account.val())) {
      Swal.fire({
        icon: 'warning',
        title: '면허번호에는\n숫자만 입력해주세요',
      })
      return false
    }
  }

  if (!input_name.val()) {
    Swal.fire({
      icon: 'warning',
      title: '성함을 입력해주세요',
    })
    return false
  } else {
    if (!nameCheck.test(input_name.val())) {
      Swal.fire({
        icon: 'warning',
        title: '성함은 한글과\n영문만 입력해주세요',
      })
      return false
    }
  }

  const postData = {
    account: input_account.val(),
    name: input_name.val(),
  }
  login(postData)
})
input_account.keypress(function (key) {
  if (key.keyCode == 13) {
    $('#submitBtn').click()
  }
})
input_name.keypress(function (key) {
  if (key.keyCode == 13) {
    $('#submitBtn').click()
  }
})

function login(postData) {
  $.ajax({
    url: '/login',
    type: 'POST',
    data: postData,
    dataType: 'JSON',
    success: function (res) {
      switch (res.ok) {
        case true: {
          if (res.role === 'a') {
            Swal.fire({
              title: '이동할 페이지 선택',
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: '관리자 페이지',
              cancelButtonColor: '#d33',
              cancelButtonText: '시청 페이지',
            })
              .then(function (res) {
                $('body').css('display', 'none')
                return res
              })
              .then(function (result) {
                if (result.isConfirmed) {
                  location.href = '/admin?acc=' + postData.account
                } else {
                  location.href = '/home?acc=' + postData.account
                }
              })
            break
          }
          try {
            Swal.fire({
              icon: 'success',
              title: '로그인 되었습니다',
              backdrop: '#fff',
            })
              .then(function () {
                $('body').css('display', 'none')
              })
              .then(function () {
                location.href = '/home?acc=' + postData.account
              })
            break
          } catch (error) {
            console.log(error)
            document.getElementsById('body').style.display = 'none'
            location.href = '/home?acc=' + postData.account
          } finally {
          }
        }

        case false: {
          Swal.fire({
            icon: 'warning',
            title: '로그인 실패',
            text: '성함과 면허번호를 확인해주세요',
          }).then(function () {
            input_account.val('')
            isInvalid(input_account, '')
            input_name.val('')
            isInvalid(input_name, '')
          })
          break
        }

        default: {
          Swal.fire({
            icon: 'warning',
            title: '로그인 실패',
            text: '서버에서 응답을 받지 못했습니다',
          })
          break
        }
      }
    },
  })
}

input_account.on('blur', function () {
  if (input_account.val()) {
    if (accountCheck.test(input_account.val())) {
      isValid(input_account, '✔')
    } else {
      isInvalid(input_account, '숫자만 입력해주세요')
    }
  } else {
    isInvalid(input_account, '면허번호를 입력해주세요')
  }
})
input_name.on('blur', function () {
  if (input_name.val()) {
    if (nameCheck.test(input_name.val())) {
      isValid(input_name, '✔')
    } else {
      isInvalid(input_name, '한글과 영문만 입력해주세요')
    }
  } else {
    isInvalid(input_name, '성함을 입력해주세요')
  }
})

function removeMask() {
  $('#mask').fadeOut(1000)
  $('.window').hide()
}

function isValid(inputDOM, text) {
  const noti = inputDOM.parents('.input-wrapper').find('.notification')
  inputDOM.addClass('border-green-500')
  inputDOM.removeClass('border-red-500')
  noti.text(text).removeClass('text-red-500').addClass('text-green-500')
}

function isInvalid(inputDOM, text) {
  const noti = inputDOM.parents('.input-wrapper').find('.notification')
  inputDOM.addClass('border-red-500')
  inputDOM.removeClass('border-green-500')
  noti.text(text).removeClass('text-green-500').addClass('text-red-500')
}
