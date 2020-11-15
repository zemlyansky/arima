const ARIMA = require('.')

// const ts = [100,0,0,0,0,0,0,150,0,0,204,0,0,0]

for (let i = 1; i < 10; i++) {
  const ts = Array(24).fill(0).map((_, i) => i + Math.random() / 5)
  const arima = new ARIMA({ p: 2, d: 1, q: 2, P: 1, D: 0, Q: 1, S: 12, verbose: false }).train(ts)
  const [pred, errors] = arima.predict(12)
  console.log(pred, errors)
}
