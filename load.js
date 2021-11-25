function uintify (arr) {
  return new Uint8Array(Float64Array.from(arr).buffer)
}

function flat (arr) {
  return [].concat.apply([], arr)
}

function transpose (arr) {
  return arr[0].map((x, i) => arr.map(x => x[i]))
}

function prepare (arr) {
  const farr = flat(arr)
  for (let i = 0; i < farr.length - 2; i++) {
    if (isNaN(farr[i + 1])) {
      farr[i + 1] = farr[i]
    }
  }
  return farr
}

const defaults = {
  method: 0,
  optimizer: 6,
  s: 0,
  verbose: true,
  transpose: false,
  auto: false,
  approximation: 1,
  search: 1
}

const params = {
  p: 1,
  d: 0,
  q: 1,
  P: 0,
  D: 0,
  Q: 0
}

const paramsAuto = {
  p: 5,
  d: 2,
  q: 5,
  P: 2,
  D: 1,
  Q: 2
}

module.exports = function (m) {
  const _fit_sarimax = m.cwrap('fit_sarimax', 'number', ['array', 'array', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'boolean'])
  const _predict_sarimax = m.cwrap('predict_sarimax', 'number', ['number', 'array', 'array', 'array', 'number'])
  const _fit_autoarima = m.cwrap('fit_autoarima', 'number', ['array', 'array', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'boolean'])
  const _predict_autoarima = m.cwrap('predict_autoarima', 'number', ['number', 'array', 'array', 'array', 'number'])

  function getResults (addr, l) {
    const res = [[], []]
    for (let i = 0; i < l * 2; i++) {
      res[i < l ? 0 : 1].push(m.HEAPF64[addr / Float64Array.BYTES_PER_ELEMENT + i])
    }
    return res
  }

  function ARIMA () {
    // Preserve the old functional API: ARIMA(ts, len, opts)
    if (!(this instanceof ARIMA)) {
      console.warn('Calling ARIMA as a function will be deprecated in the future')
      return (new ARIMA(arguments[2])).train(arguments[0]).predict(arguments[1])
    }
    // A new, class API has opts as the only argument here: new ARIMA (opts)
    const opts = arguments[0]
    const o = Object.assign({}, defaults, opts.auto ? paramsAuto : params, opts)
    if (Math.min(o.method, o.optimizer, o.p, o.d, o.q, o.P, o.D, o.Q, o.s) < 0) {
      throw new Error('Model parameter can\'t be negative')
    }
    if ((o.P + o.D + o.Q) === 0) {
      o.s = 0
    } else if (o.s === 0) {
      o.P = o.D = o.Q = 0
    }
    this.options = o
  }

  ARIMA.prototype.train = function (ts, exog = []) {
    const o = this.options
    if (o.transpose && Array.isArray(exog[0])) {
      exog = transpose(exog)
    }
    this.ts = uintify(prepare(ts))
    this.exog = uintify(prepare(exog))
    this.lin = ts.length
    this.nexog = exog.length > 0 ? (Array.isArray(exog[0]) ? exog.length : 1) : 0
    this.model = o.auto
      ? _fit_autoarima(
        this.ts, this.exog,
        o.p, o.d, o.q,
        o.P, o.D, o.Q, o.s,
        this.nexog,
        this.lin,
        o.method,
        o.optimizer,
        o.approximation,
        o.search,
        o.verbose
      )
      : _fit_sarimax(
        this.ts, this.exog,
        o.p, o.d, o.q,
        o.P, o.D, o.Q, o.s,
        this.nexog,
        this.lin,
        o.method,
        o.optimizer,
        o.verbose
      )
    return this
  }

  ARIMA.prototype.fit = function (...a) {
    return this.train(...a)
  }

  ARIMA.prototype.predict = function (l, exog = []) {
    const o = this.options
    if (o.transpose && Array.isArray(exog[0])) {
      exog = transpose(exog)
    }
    const addr = o.auto
      ? _predict_autoarima(
        this.model,
        this.ts,
        this.exog, // old
        uintify(prepare(exog)), // new
        l
      )
      : _predict_sarimax(
        this.model,
        this.ts,
        this.exog, // old
        uintify(prepare(exog)), // new
        l
      )
    return getResults(addr, l)
  }

  return ARIMA
}
