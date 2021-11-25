// Async compilation ('arima/async')

const Module = require('./wasm/native-async.js')
const bin = require('./wrapper/native.bin.js')
const loadARIMA = require('./load.js')

const modulePromise = Module({ wasmBinary: bin })

module.exports = modulePromise.then(loadARIMA)
