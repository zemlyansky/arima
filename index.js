const Module = require('./wasm/native.js')
const bin = require('./wrapper/native.bin.js')
const m = Module({ wasmBinary: bin.data })

const _arima = m.cwrap('arima', 'number', ['array', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'boolean'])

function uintify (arr) {
  return new Uint8Array(Float64Array.from(arr).buffer)
}

const defaults = {
  method: 0,
  optimizer: 6,
  p: 1,
  d: 0,
  q: 1,
  verbose: true
}

module.exports = function predict (input, length, opts) {
  const options = Object.assign({}, defaults, opts)
  const ts = uintify(input.flat())
  const addr = _arima(
    ts,
    options.p,
    options.d,
    options.q,
    input.length,
    length,
    options.method,
    options.optimizer,
    options.verbose
  )
  const data = []
  for (let i = 0; i < length; i++) {
    data.push(m.HEAPF64[addr / Float64Array.BYTES_PER_ELEMENT + i])
  }
  return data
}
