// Loads bundled base forest module and wraps its content into module.exports

// var file = fs.readFileSync('./wasm/native.wasm').toString('hex')
// fs.writeFileSync('./wrapper/native.hex.js', 'module.exports = "' + file + '"')

var fs = require('fs')
var file = fs.readFileSync('./wasm/native.wasm')
fs.writeFileSync('./wrapper/native.bin.js', 'module.exports = ' + JSON.stringify(file))
