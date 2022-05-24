'use strict'

// IE -> EDGE 우회
var url = 'nstream.kr'
if (navigator.userAgent.indexOf('Trident') > 0) {
  alert(
    '이 웹페이지는 Microsoft Edge, Chrome, Whale, FireFox 브라우저에 최적화 되어있습니다. ' +
      '원활한 사용을 원하시면 Microsoft Edge, Chrome 브라우저를 권장합니다. 확인버튼을 누르면 Edge브라우저로 자동으로 이동됩니다.'
  )
  window.location = 'microsoft-edge:' + url
} else if (/MSIE \d |Trident.*rv:/.test(navigator.userAgent)) {
  alert(
    '이 웹페이지는 Microsoft Edge, Chrome, Whale, FireFox 브라우저에 최적화 되어있습니다. ' +
      '원활한 사용을 원하시면 Microsoft Edge, Chrome 브라우저를 권장합니다.  확인버튼을 누르면 Edge브라우저로 자동으로 이동됩니다.'
  )
  window.location = 'microsoft-edge:http:' + url
}

$(window).on('load', function () {
  console.log('home')
  removeMask()
})
function getAccount() {
  const account = new URL(window.location.href).searchParams.get('acc')
  return account
}
function removeMask() {
  document.getElementById('mask').classList.add('off')
}

/* $('#question-submit-button').on('click', function () {
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
}) */

setInterval(function () {
  $.ajax({
    url: '/home',
    type: 'POST',
    data: {
      acc: getAccount(),
      name: $('#mask > input').val(),
    },
    dataType: 'JSON',
    success: function () {
      console.log('ping success')
    },
  }).fail(function () {
    console.log('ping fail')
  })
}, 1000 * 60)

class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el
    // Store the <summary> element
    this.summary = el.querySelector(
      '.container > .frame > .reference > .details > .title'
    )
    // Store the <div class="content"> element
    this.content = el.querySelector(
      '.container > .frame > .reference > .details > .group'
    )

    // Store the animation object (so we can cancel it if needed)
    this.animation = null
    // Store if the element is closing
    this.isClosing = false
    // Store if the element is expanding
    this.isExpanding = false
    // Detect user clicks on the summary element
    this.summary.addEventListener('click', (e) => this.onClick(e))
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault()
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = 'hidden'
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open()
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink()
    }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel()
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'ease-out',
      }
    )

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false)
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => (this.isClosing = false)
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`
    // Force the [open] attribute on the details element
    this.el.open = true
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand())
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel()
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'ease-out',
      }
    )
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true)
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => (this.isExpanding = false)
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open
    // Clear the stored animation
    this.animation = null
    // Reset isClosing & isExpanding
    this.isClosing = false
    this.isExpanding = false
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = ''
  }
}

document.querySelectorAll('details').forEach((el) => {
  new Accordion(el)
})
