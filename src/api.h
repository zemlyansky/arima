#ifndef API_H_
#define API_H_

#ifdef __cplusplus
extern "C" {
#endif

double* arima (double* ts, int p, int d, int q, int lin, int lout, int method, int opt, _Bool verbose);

#ifdef __cplusplus
}
#endif

#endif
