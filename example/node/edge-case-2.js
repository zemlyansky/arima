const ARIMA = require('../../')
const ts = [41, 71, 0, 40, 40, 40, 0, 40, 20, 1, 10, 1, 90, 0, 0, 0, 0, 0]

for (let i = 0; i < 100; i++) {
  const [pred, errors] = new ARIMA({
    method: 0, // ARIMA method (Default: 0)
    optimizer: 6, // Optimization method (Default: 6)
    p: 1, // Number of Autoregressive coefficients
    d: 1, // Number of times the series needs to be differenced
    q: 2, // Number of Moving Average Coefficients
    s: 11, // Seasonal lag
    P: 1, // Number of seasonal Autoregressive coefficients
    D: 1, // Number of seasonal times the series needs to be differenced
    Q: 1, // Number of seasonal Moving Average Coefficients
    verbose: false // Output model analysis to console
  }).fit(ts).predict(4)
  console.log(pred, errors)
}
