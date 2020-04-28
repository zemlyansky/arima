const arima = require('.')
const ts = Array(1000).fill(0).map((v, i) => Math.sin(i + 1))

const pred = arima(ts.slice(0, 980), 20, {
  method: 0,
  optimizer: 6,
  p: 2,
  q: 0,
  d: 1,
  verbose: false
})

console.log(pred, ts.slice(980))
