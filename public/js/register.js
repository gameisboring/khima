$('input[name=name]').on('blur', () => {
  if ($('input[name=name]').val().length >= 3) {
    $('input[name=name]').addClass('valid:border-green-500')
    $('input[name=name]').removeClass('border-red-500')
  } else {
    $('input[name=name]').addClass('border-red-500')
    $('input[name=name]').removeClass('valid:border-green-500')
  }
})

$('input[name=belong]').on('blur', () => {
  if ($('input[name=belong]').val().length > 0) {
    $('input[name=belong]').addClass('valid:border-green-500')
    $('input[name=belong]').removeClass('border-red-500')
  } else {
    $('input[name=belong]').addClass('border-red-500')
    $('input[name=belong]').removeClass('valid:border-green-500')
  }
})

$('input[name=email]').on('blur', () => {
  if (emailCheck($('input[name=email]').val())) {
    $('input[name=email]').addClass('valid:border-green-500')
    $('input[name=email]').removeClass('border-red-500')
  } else {
    $('input[name=email]').addClass('border-red-500')
    $('input[name=email]').removeClass('valid:border-green-500')
  }
})

$('input[name=password]').on('blur', () => {
  if (passwordCheck($('input[name=password]').val())) {
    $('input[name=password]').addClass('valid:border-green-500')
    $('input[name=password]').removeClass('border-red-500')
  } else {
    $('input[name=password]').addClass('border-red-500')
    $('input[name=password]').removeClass('valid:border-green-500')
  }
})

function emailCheck(email) {
  var mailRegExp =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
  return mailRegExp.test(email)
}

function passwordCheck(pw) {
  var pwRegExp = /^[A-Za-z0-9]{6,12}$/ //숫자와 문자 포함 형태의 6~12자리 이내의 암호 정규식
  return pwRegExp.test(pw)
}

$('#submitBtn').on('click', function () {
  let check = {}

  if (
    $('input[name=name]').val() &&
    $('input[name=name]').hasClass('valid:border-green-500')
  ) {
    check.name = $('input[name=name]').val()
  } else {
    $('input[name=name]').attr('required', 'required')
    Swal.fire({
      icon: 'warning',
      title: '이름을 입력해주세요',
    })
    return false
  }
  if ($('input[name=belong]').val()) {
    check.belong = $('input[name=belong]').val()
  } else {
    $('input[name=belong]').attr('required', 'required')
    Swal.fire({
      icon: 'warning',
      title: '소속을 입력해주세요',
    })
    return false
  }

  if ($('input[name=email]').val()) {
    if (!emailCheck($('input[name=email]').val())) {
      Swal.fire({
        icon: 'warning',
        title: '올바르지 않은 이메일 주소입니다',
      })
      $('input[name=email]').attr('required', 'required')
      return false
    } else {
      $('input[name=email]').addClass('valid:border-green-500')
      check.email = $('input[name=email]').val()
    }
  } else {
    $('input[name=email]').attr('required', 'required')
    Swal.fire({
      icon: 'warning',
      title: '이메일을 입력해주세요',
    })
    return false
  }

  if ($('input[name=password]').val()) {
    if (!passwordCheck($('input[name=password]').val())) {
      Swal.fire({
        icon: 'warning',
        title: '양식에 맞지 않는 비밀번호 입니다',
      })
      $('input[name=password]').attr('required', 'required')
      return false
    } else {
      $('input[name=password]').addClass('valid:border-green-500')
      check.password = $('input[name=password]').val()
    }
  } else {
    $('input[name=password]').attr('required', 'required')
    Swal.fire({
      icon: 'warning',
      title: '비밀번호를 입력해주세요',
    })
    return false
  }

  if (check.name && check.belong && check.email && check.password) {
    register(check)
  }
})

function register(DATA) {
  console.log(DATA)
  $.ajax({
    url: '/register',
    dataType: 'JSON',
    method: 'POST',
    data: DATA,
    success: (res) => {
      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          text: '이미 등록되었습니다',
        })
      } else if (res.ok) {
        Swal.fire({
          icon: 'success',
          text: '사전등록에 성공했습니다',
        })
      }
    },
    error: (err) => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        text: '사전등록에 실패했습니다',
      })
    },
  })
}
