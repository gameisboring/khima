$(window).load(function () {
  setUptime(), getUsersListWithAjax(), getInfoWithAjax(), renderChart()
  setInterval(() => {
    setUptime()
  }, 1e3),
    setInterval(() => {
      renderChart()
    }, 1000 * 60)
})

$('#download-users-button').on('click', function () {
  $.ajax({
    url: '/admin/book/download',
    type: 'get',
    dataType: 'JSON',
    error: (t) => {
      console.log(t)
    },
    success: (t) => {
      console.log(t)
    },
  })
})

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
    firstAcc = getFullYmdStr(new Date(t.최초접속시간).getTime()),
    lastAcc = getFullYmdStr(new Date(t.최종접속시간).getTime()),
    reserveDate = new Date(t.신청일자)
  ;(s = `\n
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center">
        <div class="text-sm font-medium text-gray-900">
        ${t.이름}
        </div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
      ${t.면허번호}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
      ${reserveDate.getMonth() + 1}월 ${reserveDate.getDate()}일
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
      ${firstAcc}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
      ${lastAcc}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
      ${Math.floor(t.총시청시간 / 60)}시간 ${t.총시청시간 % 60}분
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      ${'A' === t.권한 ? '관리자' : '시청자'}
    </td>`),
    (n = document.createElement('tr'))
  ;(n.innerHTML = s), e.append(n)
}

function infoRender(t) {
  $('#hit-count').text(t.HITS),
    $('#user-count').text(t.USERS),
    $('#question-count').text(t.QUESTIONS)
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
  console.log(Math.abs(Math.floor(t / 864e5)))
}

function getFullYmdStr(t) {
  if (!t) {
    return '로그인 기록없음'
  }
  var d = new Date(t)
  return (
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '-' +
    (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
    ' ' +
    (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
    ':' +
    (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
    ':' +
    (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
  )
}

function getUsersList() {
  $('#questions').css('display', 'none'),
    getUsersListWithAjax(),
    $('#users').css('display', 'flex')
}

function renderChart() {
  var config = {
    type: 'line',
    data: dataset,
    options: {
      maintainAspectRatio: false,
      responsive: true,
      tooltips: {
        enabled: false,
      },
      hover: {
        animationDuration: 0,
      },
      animation: {
        duration: 0,
        onComplete: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx
          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          )
          ctx.fillStyle = 'purple'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'bottom'

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i)
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index]
              ctx.fillText(data, bar._model.x, bar._model.y - 5)
            })
          })
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        subtitle: {
          display: true,
          text: 'Custom Chart Subtitle',
        },
      },
      title: {
        display: true,
        text: '시간당 평균 시청자 수 그래프',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  }
  const ctx = $('#myChart')
  var dataset = {
    labels: [],
    datasets: [
      {
        label: '시청자 수',
        data: [],
        borderColor: '#020202',
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }
  var chart = new Chart(ctx, config)
  $.ajax({
    url: '/admin/chart',
    type: 'get',
    dataType: 'json',
    success: function (res) {
      time = []
      res.forEach((element) => {
        dataset.datasets[0].data.push(
          Math.round((element.COUNT / element.MIN) * 100) / 100
        )
        dataset.labels.push(element.HOUR)
      })

      chart.destroy() // 기존에 생성한 차트 오브젝트를 없앤다.
      config.data = dataset
      // 수신한 json 타입 데이터를 이용하여 차트를 새로 그린다.
      chart = new Chart(ctx, config)
    },
    error: function (xhr, status, error) {
      console.log(error)
    },
  })
}
