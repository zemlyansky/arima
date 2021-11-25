const ARIMAPromise = require('../../async') // Change '../../async' to 'arima/async'

ARIMAPromise.then(ARIMA => {
  const ts = Array(10).fill(0).map((_, i) => i + Math.random() / 5)
  const arima = new ARIMA({ p: 2, d: 1, q: 2, P: 0, D: 0, Q: 0, S: 0, verbose: false }).train(ts)
  const [pred, errors] = arima.predict(10)

  document.getElementById('output').innerText = `
Async compilation

Data:
${ts.join('\n')}

Predictions:
${pred.join('\n')}

Errors:
${errors.join('\n')}
`
})
