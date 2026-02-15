interface ARIMAOptions {
  p?: number
  d?: number
  q?: number
  P?: number
  D?: number
  Q?: number
  s?: number
  method?: number
  optimizer?: number
  verbose?: boolean
  transpose?: boolean
  auto?: boolean
  approximation?: number
  search?: number
}

interface ARIMAInstance {
  train(ts: number[], exog?: number[] | number[][]): this
  fit(ts: number[], exog?: number[] | number[][]): this
  predict(length: number, exog?: number[] | number[][]): [number[], number[]]
  destroy(): void
}

interface ARIMAConstructor {
  new (options?: ARIMAOptions): ARIMAInstance
  /** @deprecated Use `new ARIMA(opts)` instead */
  (ts: number[], length: number, options?: ARIMAOptions): [number[], number[]]
}

declare const ARIMA: ARIMAConstructor
export = ARIMA
