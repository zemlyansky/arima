const arima = require('.')

const n = 1000
const l = 30

const ts = Array(n).fill(0).map((v, i) => Math.sin(i / 3) + Math.random() / 1.5)
ts[100] = '--'
ts[500] = undefined

const [pred, errors] = arima(ts.slice(0, n - l), l, {
  method: 0,
  optimizer: 6,
  p: 10,
  q: 0,
  d: 1,
  verbose: false
})

console.log('Ytrue,Ypred,Err')
pred.forEach((v, i) => {
  console.log(ts[n - l + i] + ',' + v + ',' + errors[i])
})
