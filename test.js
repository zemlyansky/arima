const ARIMA = require('.')
var test = require('tape')

function mse (yt, yp) {
  return yt.reduce((a, v, i) => a + Math.pow(v - yp[i], 2) / yt.length, 0)
}

function rmse (yt, yp) {
  return Math.sqrt(mse(yt, yp))
}

function uniq (arr) {
  const uniq = []
  arr.forEach(v => {
    if (!uniq.includes(v)) {
      uniq.push(v)
    }
  })
  return uniq
}

// Shared test data
var airPassengers = [112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140,145,150,178,163,172,178,199,199,184,162,146,166,171,180,193,181,183,218,230,242,209,191,172,194,196,196,236,235,229,243,264,272,237,211,180,201,204,188,235,227,234,264,302,293,259,229,203,229,242,233,267,269,270,315,364,347,312,274,237,278,284,277,317,313,318,374,413,405,355,306,271,306,315,301,356,348,355,422,465,467,404,347,305,336,340,318,362,348,363,435,491,505,404,359,310,337,360,342,406,396,420,472,548,559,463,407,362,405]

test('Old API', (_) => {
  const ts = [112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140,145,150,178,163,172,178,199,199,184,162,146,166,171,180,193,181,183,218,230,242,209,191,172,194,196,196,236,235,229,243,264,272,237,211,180,201,204,188,235,227,234,264,302,293,259,229,203,229,242,233,267,269,270,315,364,347,312,274,237,278,284,277,317,313,318,374,413,405,355,306,271,306,315,301,356,348,355,422,465,467,404,347,305,336,340,318,362,348,363,435,491,505,404,359,310,337,360,342,406,396,420,472,548,559,463,407,362,405]
  const tstest = [417,391,419,461,472,535,622,606,508,461,390,432]
  const N = 50
  const [pred, errors] = ARIMA(ts, tstest.length, {
    p: 0,
    d: 1,
    q: 1,
    P: 0,
    D: 1,
    Q: 1,
    s: 12,
    verbose: false
  })
  const loss = rmse(pred, tstest)
  _.true(loss < 22)
  _.end()
})

test('SARIMA', (_) => {
  const ts = [112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140,145,150,178,163,172,178,199,199,184,162,146,166,171,180,193,181,183,218,230,242,209,191,172,194,196,196,236,235,229,243,264,272,237,211,180,201,204,188,235,227,234,264,302,293,259,229,203,229,242,233,267,269,270,315,364,347,312,274,237,278,284,277,317,313,318,374,413,405,355,306,271,306,315,301,356,348,355,422,465,467,404,347,305,336,340,318,362,348,363,435,491,505,404,359,310,337,360,342,406,396,420,472,548,559,463,407,362,405]
  const tstest = [417,391,419,461,472,535,622,606,508,461,390,432]
  const N = 50
  const losses = []
  for (let i = 0; i < N; i++) {
    const arima = new ARIMA({
      p: 0,
      d: 1,
      q: 1,
      P: 0,
      D: 1,
      Q: 1,
      s: 12,
      verbose: false
    })
    arima.fit(ts)
    const res = arima.predict(12)
    losses.push(rmse(res[0], tstest))
  }

  const ul = uniq(losses)
  _.equal(ul.length, 1)
  _.true(Math.max(...ul) < 22)
  _.end()
})

test('AutoARIMA', (_) => {
  const ts = [16.9969, 16.5969, 16.3012, 16.1018, 17.0998, 16.8997, 16.8002, 17.4001, 17.0998, 16.9996, 16.6991, 17.3993, 17.2002, 17.4013, 17.4029, 17.0015, 17.2965, 17.1966, 17.4013, 16.802, 17.1, 17.3995, 17.3995, 17.5008, 17.3998, 17.6, 17.4, 17.3, 17, 17.8, 17.5, 18.1, 17.5, 17.4, 17.4, 17.1, 17.6, 17.7, 17.4, 17.8, 17.6, 17.5, 16.5, 17.8, 17.3, 17.3, 17.1, 17.4, 16.9, 17.3, 17.6, 16.9, 16.7, 16.8, 16.8, 17.2, 16.8, 17.6, 17.2, 16.6, 17.1, 16.9, 16.6, 18, 17.2, 17.3, 17, 16.9, 17.3, 16.8, 17.3, 17.4, 17.7, 16.8, 16.9, 17, 16.9, 17, 16.6, 16.7, 16.8, 16.7, 16.4, 16.5, 16.4, 16.6, 16.5, 16.7, 16.4, 16.4, 16.2, 16.4, 16.3, 16.4, 17, 16.9, 17.1, 17.1, 16.7, 16.9, 16.5, 17.2, 16.4, 17, 17, 16.7, 16.2, 16.6, 16.9, 16.5, 16.6, 16.6, 17, 17.1, 17.1, 16.7, 16.8, 16.3, 16.6, 16.8, 16.9, 17.1, 16.8, 17, 17.2, 17.3, 17.2, 17.3, 17.2, 17.2, 17.5, 16.9, 16.9, 16.9, 17.0001, 16.4999, 16.6996, 16.8001, 16.7013, 16.6985, 16.6005, 16.5, 17, 16.7, 16.7, 16.9, 17.4, 17.1, 17, 16.8, 17.2, 17.2, 17.4, 17.2, 16.9, 16.8, 17, 17.4, 17.2, 17.2, 17.1, 17.1, 17.1, 17.4, 17.2, 16.9, 16.9, 17, 16.7, 16.9, 17.3, 17.8, 17.8, 17.6, 17.5, 17, 16.8999, 17.1, 17.2002, 17.3998, 17.5001, 17.9, 17, 17, 17, 17.2, 17.3, 17.4]
  const tstest = [17.4, 17.4, 17.0001, 18.0001, 18.2001, 17.5999, 17.7996, 17.6992, 17.2002, 17.4027]
  const N = 10
  const losses = []
  for (let i = 0; i < N; i++) {
    const arima = new ARIMA({
      auto: true,
      verbose: false,
      search: 0,
      aproximation: 0
    })
    arima.fit(ts)
    const res = arima.predict(10)
    losses.push(rmse(res[0], tstest))
  }

  const ul = uniq(losses)
  _.equal(ul.length, 1)
  _.true(Math.max(...ul) < 1)
  _.end()
})

test('SARIMAX with 2 exogenous variables', (_) => {
  const N = 30
  const f = (a, b) => a * 2 + b * 5
  const losses = []
  for (let i = 0; i < N; i++) {
    const exog = Array(30).fill(0).map(x => [Math.random(), Math.random()])
    const exognew = Array(10).fill(0).map(x => [Math.random(), Math.random()])
    const ts = exog.map(x => f(x[0], x[1]) + Math.random() / 5)
    for (let j = 0; j < 10; j++) {
      const arima = new ARIMA({
        p: 1,
        d: 0,
        q: 1,
        transpose: true,
        verbose: false
      })
      arima.fit(ts, exog)
      const res = arima.predict(10, exognew)
      const ytrue = exognew.map(x => f(x[0], x[1]))
      const ypred = res[0]
      losses.push(rmse(ytrue, ypred))
    }
  }

  const ul = uniq(losses)
  _.equal(ul.length, N)
  _.true(Math.max(...ul) < 2)
  _.end()
})

// --- Phase 0 regression tests ---

test('Constructor: new ARIMA() with no args uses defaults', (_) => {
  var m = new ARIMA()
  _.equal(m.options.p, 1, 'default p=1')
  _.equal(m.options.d, 0, 'default d=0')
  _.equal(m.options.q, 1, 'default q=1')
  _.equal(m.options.auto, false, 'default auto=false')
  _.equal(m.options.verbose, false, 'default verbose=false')
  _.end()
})

test('Constructor: new ARIMA({auto: true}) uses auto defaults', (_) => {
  var m = new ARIMA({ auto: true })
  _.equal(m.options.p, 5, 'auto default p=5')
  _.equal(m.options.d, 2, 'auto default d=2')
  _.equal(m.options.q, 5, 'auto default q=5')
  _.equal(m.options.auto, true)
  _.end()
})

test('Constructor: custom options override defaults', (_) => {
  var m = new ARIMA({ p: 3, d: 2, q: 0 })
  _.equal(m.options.p, 3)
  _.equal(m.options.d, 2)
  _.equal(m.options.q, 0)
  _.end()
})

test('.train() and .fit() are aliases', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m1 = new ARIMA({ p: 1, d: 0, q: 1 })
  var m2 = new ARIMA({ p: 1, d: 0, q: 1 })
  m1.train(ts)
  m2.fit(ts)
  var r1 = m1.predict(5)
  var r2 = m2.predict(5)
  _.deepEqual(r1[0], r2[0], 'predictions match')
  _.deepEqual(r1[1], r2[1], 'errors match')
  m1.destroy()
  m2.destroy()
  _.end()
})

test('.predict() returns [Array, Array] with correct lengths', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1 })
  m.train(ts)
  var res = m.predict(7)
  _.true(Array.isArray(res), 'result is array')
  _.equal(res.length, 2, 'result has 2 elements')
  _.true(Array.isArray(res[0]), 'predictions is array')
  _.true(Array.isArray(res[1]), 'errors is array')
  _.equal(res[0].length, 7, 'predictions length matches horizon')
  _.equal(res[1].length, 7, 'errors length matches horizon')
  m.destroy()
  _.end()
})

test('Error variances are non-negative', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 1, q: 1 })
  m.train(ts)
  var res = m.predict(10)
  var allNonNeg = res[1].every(v => v >= 0)
  _.true(allNonNeg, 'all error variances >= 0')
  m.destroy()
  _.end()
})

test('Short series: throws for too-short input', (_) => {
  var m = new ARIMA({ p: 3, d: 1, q: 3 })
  _.throws(function () {
    m.train([1, 2, 3])
  }, /Series too short/, 'throws descriptive error for 3-element series')
  _.end()
})

test('Short series: succeeds at minimum viable length', (_) => {
  var ts = Array(15).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1 })
  m.train(ts)
  var res = m.predict(3)
  _.equal(res[0].length, 3, 'predictions returned')
  _.false(res[0].some(isNaN), 'no NaN in predictions')
  m.destroy()
  _.end()
})

test('Short series: AutoARIMA throws for tiny input', (_) => {
  var m = new ARIMA({ auto: true })
  _.throws(function () {
    m.train([1, 2, 3, 4, 5])
  }, /Series too short/, 'auto arima rejects 5-element series')
  _.end()
})

test('.destroy() nulls model', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1 })
  m.train(ts)
  _.true(m.model !== null, 'model exists after train')
  m.destroy()
  _.equal(m.model, null, 'model is null after destroy')
  _.end()
})

test('.destroy() is safe to call multiple times', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1 })
  m.train(ts)
  m.destroy()
  m.destroy()
  _.equal(m.model, null, 'double destroy is safe')
  _.end()
})

test('Re-training frees previous model', (_) => {
  var ts1 = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var ts2 = Array(50).fill(0).map((_, i) => i * 2 + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1 })
  m.train(ts1)
  var r1 = m.predict(3)
  m.train(ts2)
  var r2 = m.predict(3)
  _.false(r1[0].some(isNaN), 'first train no NaN')
  _.false(r2[0].some(isNaN), 'second train no NaN')
  _.notDeepEqual(r1[0], r2[0], 'different data produces different predictions')
  m.destroy()
  _.end()
})

test('Memory: 100 instances produce no NaN', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var nanCount = 0
  for (var i = 0; i < 100; i++) {
    var m = new ARIMA({ p: 1, d: 1, q: 1 })
    m.train(ts)
    var res = m.predict(5)
    if (res[0].some(isNaN) || res[1].some(isNaN)) nanCount++
    m.destroy()
  }
  _.equal(nanCount, 0, '0 NaN across 100 instances')
  _.end()
})

test('Memory: old functional API repeated calls produce no NaN', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var nanCount = 0
  for (var i = 0; i < 50; i++) {
    var res = ARIMA(ts, 5, { p: 1, d: 1, q: 1 })
    if (res[0].some(isNaN) || res[1].some(isNaN)) nanCount++
  }
  _.equal(nanCount, 0, '0 NaN across 50 old API calls')
  _.end()
})

test('Verbose: default produces no stdout', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1 })
  // If verbose were true, ctsa would print SARIMAX summary via printf
  // We can't easily capture WASM stdout in tape, but we verify the option is false
  _.equal(m.options.verbose, false, 'verbose defaults to false')
  m.train(ts)
  m.predict(3)
  m.destroy()
  _.pass('no crash with verbose=false')
  _.end()
})

test('Verbose: explicit true still works', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var m = new ARIMA({ p: 1, d: 0, q: 1, verbose: true })
  _.equal(m.options.verbose, true)
  m.train(ts)
  var res = m.predict(3)
  _.false(res[0].some(isNaN), 'verbose=true still produces valid output')
  m.destroy()
  _.end()
})

test('Sync and async paths produce identical predictions', (_) => {
  var asyncARIMA = require('./async')
  asyncARIMA.then(function (ARIMA_ASYNC) {
    var ts = airPassengers
    var syncModel = new ARIMA({ p: 0, d: 1, q: 1, P: 0, D: 1, Q: 1, s: 12 })
    syncModel.train(ts)
    var syncRes = syncModel.predict(12)

    var asyncModel = new ARIMA_ASYNC({ p: 0, d: 1, q: 1, P: 0, D: 1, Q: 1, s: 12 })
    asyncModel.train(ts)
    var asyncRes = asyncModel.predict(12)

    _.deepEqual(syncRes[0], asyncRes[0], 'predictions match')
    _.deepEqual(syncRes[1], asyncRes[1], 'errors match')
    syncModel.destroy()
    asyncModel.destroy()
    _.end()
  })
})

test('Multiple ARIMA instances simultaneously', (_) => {
  var ts = Array(50).fill(0).map((_, i) => i + Math.random() / 5)
  var models = []
  for (var i = 0; i < 5; i++) {
    var m = new ARIMA({ p: 1, d: 0, q: 1 })
    m.train(ts)
    models.push(m)
  }
  var results = models.map(function (m) { return m.predict(3) })
  // All should produce identical results (same data, same params)
  for (var j = 1; j < results.length; j++) {
    _.deepEqual(results[j][0], results[0][0], 'instance ' + j + ' matches')
  }
  models.forEach(function (m) { m.destroy() })
  _.end()
})

test('Negative parameter throws', (_) => {
  _.throws(function () {
    new ARIMA({ p: -1, d: 0, q: 1 })
  }, /can't be negative/, 'negative p throws')
  _.end()
})

test('SARIMAX with 1 exogenous variable', (_) => {
  var exog = Array(30).fill(0).map(function () { return [Math.random()] })
  var exognew = Array(5).fill(0).map(function () { return [Math.random()] })
  var ts = exog.map(function (x) { return x[0] * 3 + Math.random() / 5 })
  var m = new ARIMA({ p: 1, d: 0, q: 1, transpose: true })
  m.fit(ts, exog)
  var res = m.predict(5, exognew)
  _.equal(res[0].length, 5)
  _.false(res[0].some(isNaN), 'no NaN with 1 exog var')
  m.destroy()
  _.end()
})

test('SARIMAX with 3 exogenous variables', (_) => {
  var exog = Array(30).fill(0).map(function () { return [Math.random(), Math.random(), Math.random()] })
  var exognew = Array(5).fill(0).map(function () { return [Math.random(), Math.random(), Math.random()] })
  var ts = exog.map(function (x) { return x[0] * 2 + x[1] * 3 + x[2] * 4 + Math.random() / 5 })
  var m = new ARIMA({ p: 1, d: 0, q: 1, transpose: true })
  m.fit(ts, exog)
  var res = m.predict(5, exognew)
  _.equal(res[0].length, 5)
  _.false(res[0].some(isNaN), 'no NaN with 3 exog vars')
  m.destroy()
  _.end()
})
