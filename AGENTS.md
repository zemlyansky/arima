# arima

ARIMA, SARIMA, SARIMAX, and AutoARIMA for JavaScript. C (ctsa) compiled to WebAssembly via Emscripten. Runs in Node.js and browsers.

Part of the StatSim ecosystem — but published as an unscoped general-purpose package (`arima` on npm). High download count, used by many projects. Every change must be backward-compatible.

## Architecture

```
src/api.c + ctsa/    →  Emscripten  →  wasm/native.wasm (207 KB)
                                    →  wasm/native-sync.js (Emscripten runtime, sync)
                                    →  wasm/native-async.js (Emscripten runtime, async)

wrapper/native.bin.js  ←  jsmaker  ←  wasm/native.wasm (base64 uint8, 276 KB)

index.js (sync)   = Module({ wasmBinary: bin }) → load.js → ARIMA class
async.js (async)   = Module({ wasmBinary: bin }).then(load.js) → Promise<ARIMA>
load.js            = factory: cwrap C functions → ARIMA prototype
```

### Key files

- `src/api.c`, `src/api.h` — C wrapper around ctsa: `fit_sarimax`, `predict_sarimax`, `fit_autoarima`, `predict_autoarima`
- `load.js` — Factory that takes an Emscripten module, wraps C functions via `cwrap()`, returns ARIMA constructor
- `index.js` — Sync entry: `require('arima')` → ARIMA class (immediate)
- `async.js` — Async entry: `require('arima/async')` → Promise\<ARIMA\>
- `wasm/native-sync.js` — Emscripten runtime, synchronous instantiation
- `wasm/native-async.js` — Emscripten runtime, async instantiation (`WebAssembly.instantiateStreaming`)
- `wrapper/native.bin.js` — WASM binary embedded as base64 uint8 (avoids Chrome's 4KB sync compilation limit)
- `test.js` — 4 tape tests (old API, SARIMA, AutoARIMA, SARIMAX)
- `Makefile` — Emscripten build: `emcc` compiles ctsa + api.c → WASM + JS loaders

### API contract (never break these)

```js
// Sync (Node, Firefox, Web Workers)
const ARIMA = require('arima')

// Async (all browsers)
const arimaPromise = require('arima/async')

// Old functional API (deprecated, still supported)
const [preds, errors] = ARIMA(ts, horizon, { p: 1, d: 0, q: 1 })

// Current class API
const model = new ARIMA({ p: 1, d: 1, q: 1, P: 0, D: 1, Q: 1, s: 12 })
model.train(ts)               // or model.fit(ts)
const [preds, errors] = model.predict(horizon)
// preds: Float64Array, errors: Float64Array (error variances, non-negative)

// AutoARIMA
const model = new ARIMA({ auto: true })

// SARIMAX
model.train(ts, exog)
model.predict(horizon, newExog)
```

### WASM loading: sync vs async

| | Sync (`index.js`) | Async (`async.js`) |
|---|---|---|
| Returns | ARIMA class (immediate) | Promise\<ARIMA\> |
| WASM instantiation | `new WebAssembly.Module()` (blocking) | `WebAssembly.instantiateStreaming()` |
| Browser support | Firefox, Web Workers | All browsers |
| Chrome | Blocked (>4KB sync limit) | Works |
| Use case | Node.js, quick scripts | Production browser apps |

## Current State (v0.2.6)

- Pure CJS, no `"exports"` field, no ESM support
- 4 tape tests (old API, SARIMA, AutoARIMA, SARIMAX)
- Works in Node and browsers but ESM users need `createRequire` workarounds
- No bundler-friendly entry points

## Development Plan

### Phase 1: Expand Test Coverage

Before any modernization. Every test here is a regression gate.

**API contract tests:**
- `require('arima')` returns a constructor function
- `require('arima/async')` returns a Promise resolving to a constructor function
- `new ARIMA()` with no args uses defaults (p=1, d=0, q=1)
- `.train()` and `.fit()` are aliases
- `.predict(n)` returns `[Array, Array]` with correct lengths
- Error variances are non-negative and generally increase with horizon
- Old functional API `ARIMA(ts, len, opts)` still works
- Sync and async paths produce identical predictions for same input

**Edge cases:**
- Very short series (n=5, n=10)
- Constant series (all same value)
- Series with NaN values (filled by `prepare()` in load.js)
- Zero-length predict: `predict(0)`
- Large horizon: `predict(1000)`
- Multiple train/predict cycles on same instance
- Multiple ARIMA instances simultaneously

**Exogenous variables:**
- SARIMAX with 1, 2, 3 exog variables
- Mismatched exog length
- Empty exog array (same as no exog)

Commit, tag as pre-modernization baseline.

### Phase 2: Add `exports` Map

Smallest change, biggest impact. Tells Node.js and bundlers how to resolve.

```json
{
  "main": "index.js",
  "exports": {
    ".": {
      "require": "./index.js",
      "default": "./index.js"
    },
    "./async": {
      "require": "./async.js",
      "default": "./async.js"
    }
  }
}
```

`"default"` (not `"import"`): Node's ESM interop wraps CJS `module.exports` as a default export. `import ARIMA from 'arima'` already works via this interop. The `"default"` condition ensures all module systems can resolve.

**Verify:**
```bash
node -e "const ARIMA = require('arima'); console.log(typeof ARIMA)"
node --input-type=module -e "import ARIMA from 'arima'; console.log(typeof ARIMA)"
```

Publish as 0.2.7.

### Phase 3: Native ESM Entry Points (if needed)

Only if Phase 2 proves insufficient for some bundlers.

Create `esm/index.mjs` and `esm/async.mjs` as thin wrappers:

```js
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const ARIMA = require('../index.js')
export default ARIMA
```

Update exports:
```json
"exports": {
  ".": {
    "import": "./esm/index.mjs",
    "require": "./index.js"
  },
  "./async": {
    "import": "./esm/async.mjs",
    "require": "./async.js"
  }
}
```

### Phase 4: Browser Improvements (optional)

- Streaming WASM option: serve `.wasm` as separate file, use `instantiateStreaming()` — 33% smaller than base64 embedding, better caching. Keep embedded as default.
- UMD browser bundle in `dist/arima.min.js` for `<script>` tag usage.

### What NOT To Do

- Do NOT add `"type": "module"` — breaks all `require('arima')` calls
- Do NOT rename/move `index.js` or `async.js` — breaks deep imports
- Do NOT change `.predict()` return format — `[preds, errors]` is the contract
- Do NOT remove old functional API — deprecated but depended on
- Do NOT remove `wrapper/native.bin.js` — sync path depends on it
- Do NOT bump to 1.0.0 yet — save for native ESM (Emscripten ES6 output)

## Code Style

- 2-space indentation
- Semicolon-free
- Single quotes for strings
- Preserve existing style — don't reformat working code
- Plain JavaScript, no TypeScript

## Build

```bash
npm run build    # clean + emscripten compile + jsmaker (needs emsdk)
npm test         # tape test.js
```

Build requires Emscripten (emcc/em++) installed. The `Makefile` compiles `src/api.c` + `ctsa/` to WASM with both sync and async loaders.

## Testing

- Framework: tape
- Run: `npm test`
- Add tests for new features
- Run full suite before publishing
- Compare sync and async paths for consistency

## Commits

Single-line messages. Format: `type: short description`

Types: `feature:`, `fix:`, `test:`, `docs:`, `chore:`, `package:`

Examples:
- `feature: add exports map for ESM support`
- `test: add edge case tests for short series`
- `fix: handle NaN in exogenous variables`

## Publishing

1. Update version in package.json
2. Run `npm test`
3. `npm pack --dry-run` — verify contents
4. Never publish AGENTS.md, CLAUDE.md, .claude/, test files
5. Update .npmignore if adding new non-dist files
