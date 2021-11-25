// Sync compilation (default)

const Module = require('./wasm/native-sync.js')
const bin = require('./wrapper/native.bin.js')
const loadARIMA = require('./load.js')

const moduleObject = Module({ wasmBinary: bin })

module.exports = loadARIMA(moduleObject)
