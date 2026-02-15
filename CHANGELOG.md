# Changelog

## 0.2.7 (unreleased)

### Bug Fixes

- **Fix `new ARIMA()` with no arguments** — previously threw `TypeError: Cannot read properties of undefined`. Now uses defaults (`p=1, d=0, q=1`)
- **Fix memory leak / model reuse** ([#11](https://github.com/zemlyansky/arima/issues/11)) — added `free_sarimax`, `free_autoarima`, `free_result` C functions. WASM heap is now properly freed on re-training and via `.destroy()`. Previously, creating multiple instances corrupted the heap and produced NaN after 3+ uses
- **Fix old functional API memory leak** — the deprecated `ARIMA(ts, len, opts)` path now auto-destroys the temporary model instance
- **Guard against short series crash** ([#4](https://github.com/zemlyansky/arima/issues/4)) — `.train()` now throws a descriptive `Error` if the series is too short for the model parameters, instead of letting ctsa `exit(-1)` kill the process
- **Disable method/optimizer override in AutoARIMA** ([#12](https://github.com/zemlyansky/arima/issues/12)) — workaround for wildly inaccurate AutoARIMA predictions caused by L-BFGS optimizer override

### Changes

- **`verbose` default changed from `true` to `false`** ([#5](https://github.com/zemlyansky/arima/issues/5)) — AutoARIMA no longer prints "0.05" and model summaries to console by default. Pass `verbose: true` to restore previous behavior

### New Features

- **`.destroy()` method** — frees WASM memory for a model instance. Call when done with a model, especially in loops
- **TypeScript declarations** ([#6](https://github.com/zemlyansky/arima/issues/6)) — added `index.d.ts` and `async.d.ts` with full type definitions for `ARIMAOptions`, the ARIMA class, and the async entry point

### Infrastructure

- **Pack hygiene** — switched from `.npmignore` to `"files"` whitelist in package.json. Package now ships only runtime files (11 files, ~213 KB packed vs 25 files previously)
- **Makefile updated** for Emscripten 3.1.64 — removed deprecated `--memory-init-file`, `EXTRA_EXPORTED_RUNTIME_METHODS`, `BINARYEN_ASYNC_COMPILATION` flags
- **Expanded test suite** — added 20 regression tests covering constructor defaults, memory management, short series guard, destroy lifecycle, verbose flag, sync/async parity, multiple instances, and exogenous variable edge cases

## 0.2.6

- Add edge case examples
- Add module loader

## 0.2.4

- Fix reported vulnerabilities (remove faucet, upgrade tape)

## 0.2.3

- Add async compilation (#10)
- Fix #8

## 0.2.0

- Add SARIMA, SARIMAX, AutoARIMA
- Return amse vector (#2)
