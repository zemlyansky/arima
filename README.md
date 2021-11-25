# ARIMA. Time-series forecasting in browsers and Node.js

### Emscripten port of the native C package [ctsa](https://github.com/rafat/ctsa) for time series analysis and forecasting

This CommonJS module includes:
- **ARIMA** (Autoregressive Integrated Moving Average)
- **SARIMA** (Seasonal ARIMA)
- **SARIMAX** (Seasonal ARIMA with exogenous variables)
- **AutoARIMA** (ARIMA with automatic parameters)

### Installation of the ARIMA module
```bash
npm install arima
```

### Initialization
```javascript
const ARIMA = require('arima')
const arima = new ARIMA(options)
```

Where the `options` object can include:
- `auto` - automatic ARIMA (default: `false`)
- `p`, `d`, `q` params for ARIMA (default: `p: 1, d: 0, q: 1`)
- `P`, `D`, `Q`, `s` seasonal params (default: `0`s). Setting them to non-zero values makes the ARIMA model seasonal
- `method` - ARIMA method (default: 0, described below)
- `optimizer` - optimization method (default: 6, described below)
- `transpose` - transpose exogenous array when fitting SARIMAX (default: `false`)
- `verbose` - verbose output (default: `true`)

Also for `AutoARIMA` only:
- `approximation` - approximation method (default: `1`),
- `search` - search method (default: `1`)
- `p`, `d`, `q`, `P`, `D`, `Q` params define max values for a search algorithm

### Train/Predict
ARIMA, SARIMA, AutoARIMA:
```javascript
arima.train(ts) // Or arima.fit(ts)
arima.predict(10) // Predict 10 steps forward
```

SARIMAX:
```javascript
arima.train(ts, exog) // or arima.fit(ts, exog)
arima.predict(10, exognew) // Predict 10 steps forwars using new exogenous variables
```

### Running in browsers
As described in the issue [#10](https://github.com/zemlyansky/arima/issues/10) Chrome prevents compilation of wasm modules >4kB.
There are two ways to overcome this:
  - Load `arima` in a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
  - Use the `arima/async` module 

Example of async loading:
```javascript
const ARIMAPromise = require('arima/async')

ARIMAPromise.then(ARIMA => {
  const ts = Array(10).fill(0).map((_, i) => i + Math.random() / 5)
  const arima = new ARIMA({ p: 2, d: 1, q: 2, P: 0, D: 0, Q: 0, S: 0, verbose: false }).train(ts)
  const [pred, errors] = arima.predict(10)
})
```
All following examples use **synchronous** compilation (Node.js, Firefox). They will not work in Chrome.


### Example: ARIMA
```javascript
// Load package
const ARIMA = require('arima')

// Synthesize timeseries
const ts = Array(24).fill(0).map((_, i) => i + Math.random() / 5)

// Init arima and start training
const arima = new ARIMA({
  p: 2,
  d: 1,
  q: 2,
  verbose: false
}).train(ts)

// Predict next 12 values
const [pred, errors] = arima.predict(12)
```

### Example: SARIMA
```javascript
// Init sarima and start training
const sarima = new ARIMA({
  p: 2,
  d: 1,
  q: 2,
  P: 1,
  D: 0,
  Q: 1,
  s: 12,
  verbose: false
}).train(ts)

// Predict next 12 values
const [pred, errors] = sarima.predict(12)
```

### Example: SARIMAX
```javascript
// Generate timeseries using exogenous variables
const f = (a, b) => a * 2 + b * 5
const exog = Array(30).fill(0).map(x => [Math.random(), Math.random()])
const exognew = Array(10).fill(0).map(x => [Math.random(), Math.random()])
const ts = exog.map(x => f(x[0], x[1]) + Math.random() / 5)

// Init and fit sarimax
const sarimax = new ARIMA({
  p: 1,
  d: 0,
  q: 1,
  transpose: true,
  verbose: false
}).fit(ts, exog)

// Predict next 12 values using exognew
const [pred, errors] = sarimax.predict(12, exognew)
```

### Example: AutoARIMA
```javascript
const autoarima = new ARIMA({ auto: true }).fit(ts)
const [pred, errors] = autoarima.predict(12)
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

### Old functional API (still works)
The old interface of the `arima` package was only one function that took 3 arguments:
- a 1D array with observations over time
- a number of time steps to predict
- a javascript object with ARIMA parameters `p`, `d`, `q` and other options

It returned two vectors - predictions and mean square errors.

```javascript
const arima = require('arima')
const [pred, errors] = arima(ts, 20, {
  method: 0, // ARIMA method (Default: 0)
  optimizer: 6, // Optimization method (Default: 6)
  p: 1, // Number of Autoregressive coefficients
  d: 0, // Number of times the series needs to be differenced
  q: 1, // Number of Moving Average Coefficients
  verbose: true // Output model analysis to console
})
```

### Web demo
You can try ARIMA online in the **StatSim Forecast** app:  [https://statsim.com/forecast/](https://statsim.com/forecast/).
It uses the `arima` package under the hood and applies random search to find the best values of `p`, `d` and `q`.
