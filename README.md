# arima

**Univariate ARIMA (Autoregressive Integrated Moving Average)**

Emscripten port of the native C package [ctsa](https://github.com/rafat/ctsa) for univariate time series analysis and prediction.

### API
Interface of `arima` consists of only one function that takes a 1D vector with observations over time, number of time steps to predict and ARIMA parameters p, d, q. Returns a vector with predictions.

```javascript
const arima = require('arima')
const pred = arima(ts, 20, {
  method: 0, // ARIMA method (Default: 0)
  optimizer: 6, // Optimization method (Default: 6)
  p: 1, // Number of Autoregressive coefficients
  d: 0, // Number of times the series needs to be differenced
  q: 1, // Number of Moving Average Coefficients
  verbose: true // Output model analysis to console
})
```

### ARIMA Method (method)
```
0 - Exact Maximum Likelihood Method (Default)
1 - Conditional Method - Sum Of Squares
2 - Box-Jenkins Method
```

### Optimization Method (optimizer)
```
Method 0 - Nelder-Mead
Method 1 - Newton Line Search
Method 2 - Newton Trust Region - Hook Step
Method 3 - Newton Trust Region - Double Dog-Leg
Method 4 - Conjugate Gradient
Method 5 - BFGS
Method 6 - Limited Memory BFGS (Default)
Method 7 - BFGS Using More Thuente Method
```
