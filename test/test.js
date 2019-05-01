'use strict'

const {get: getOriginal} = require('http')

const get = async (...args) => {
  let resolve
  const result = new Promise(res => resolve = res)
  getOriginal(...args, res => {
    res.on('data', () => {})
    res.on('end', () => resolve(res.statusCode))
  })
  return result
}

requestLoop(1000, true)

function requestLoop (ms, now) {
  setTimeout(async () => {
    await request()
    requestLoop(ms)
  }, now ? 0 : ms)
}

async function request () {
  const startTime = Date.now()
  const statusCode = await get(process.env.VICTIM)
  console.log(`code ${statusCode} - ${Date.now() - startTime} ms`)
}