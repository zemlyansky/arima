#include "../ctsa/header/ctsa.h"

#ifndef API_H_
#define API_H_

#ifdef __cplusplus
extern "C" {
#endif

sarimax_object* fit_sarimax (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, _Bool verbose);
double* predict_sarimax (sarimax_object* obj, double* ts, double* exog, double* newexog, int lout);
auto_arima_object* fit_autoarima (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, _Bool verbose);
double* predict_autoarima (auto_arima_object* obj, double* ts, double* exog, double* newexog, int lout);

#ifdef __cplusplus
}
#endif

#endif
