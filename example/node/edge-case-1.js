const arima = require('../../')

const ts = [0, 0, 0, 0, 11, 9.99, 14]

const [pred, errors] = arima(ts, 2, {
  method: 0,
  optimizer: 6,
  p: 3,
  q: 0,
  d: 1,
  verbose: true
})

console.log(pred, errors)
