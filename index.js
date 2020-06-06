const Module = require('./wasm/native.js')
const bin = require('./wrapper/native.bin.js')
const m = Module({ wasmBinary: bin.data })

const _arima = m.cwrap('arima', 'number', ['array', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'boolean'])

function uintify (arr) {
  return new Uint8Array(Float64Array.from(arr).buffer)
}

function flat (arr) {
  return [].concat.apply([], arr)
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
  p: 1,
  d: 0,
  q: 1,
  verbose: true
}

module.exports = function predict (input, length, opts) {
  const options = Object.assign({}, defaults, opts)
  const ts = uintify(prepare(input))
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
  const res = [[], []]
  for (let i = 0; i < length * 2; i++) {
    res[i < length ? 0 : 1].push(m.HEAPF64[addr / Float64Array.BYTES_PER_ELEMENT + i])
  }
  return res
}
