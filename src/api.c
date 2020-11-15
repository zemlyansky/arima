#include <stdio.h>
#include <stdlib.h>
#include "api.h"
#include "../ctsa/header/ctsa.h"

sarimax_object* fit_sarimax (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, _Bool verbose) {
  sarimax_object* obj;
  obj = (sarimax_object*)malloc(sizeof(sarimax_object));

  if (nexog == 0) {
    exog = NULL;
  }

  // TODO: Do we really need the following?

  // double *phi, *theta;
  // double *PHI, *THETA;

  // phi = (double*)malloc(sizeof(double)* p);
  // theta = (double*)malloc(sizeof(double)* q);
  // PHI = (double*)malloc(sizeof(double)* P);
  // THETA = (double*)malloc(sizeof(double)* Q);

  *obj = sarimax_init(p, d, q, P, D, Q, s, nexog, 1, lin);

  sarimax_setMethod(*obj, method);
  sarimax_setOptMethod(*obj, opt);
  sarimax_exec(*obj, ts, exog);

  if (verbose) {
    printf("\n SARIMAX summary: \n");
    sarimax_summary(*obj);
  }

  return obj;
}

double* predict_sarimax (sarimax_object* obj, double* ts, double* exog, double* newexog, int lout) {
  double *res, *amse;

  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  sarimax_predict(*obj, ts, exog, lout, newexog, res, amse);

  return res;
}

auto_arima_object* fit_autoarima (double* ts, double* exog, int p, int d, int q, int P, int D, int Q, int s, int nexog, int lin, int method, int opt, int approximation, int search, _Bool verbose) {
  auto_arima_object* obj;
  obj = (auto_arima_object*)malloc(sizeof(auto_arima_object));

  if (nexog == 0) {
    exog = NULL;
  }

  int order[3] = {p,d,q};
  int seasonal[3] = {P,D,Q};

  *obj = auto_arima_init(order, seasonal, s, nexog, lin);

  auto_arima_setApproximation(*obj, approximation);
  auto_arima_setStepwise(*obj, search);
  auto_arima_setVerbose(*obj, verbose ? 1 : 0);
  auto_arima_setMethod(*obj, method);
  auto_arima_setOptMethod(*obj, opt);

  auto_arima_exec(*obj, ts, exog);

  if (verbose) {
    printf("\n AutoARIMA summary: \n");
    auto_arima_summary(*obj);
  }

  return obj;
}

double* predict_autoarima (auto_arima_object* obj, double* ts, double* exog, double* newexog, int lout) {
  double *res, *amse;

  res = (double*)malloc(sizeof(double) * lout * 2);
  amse = res + lout;
  auto_arima_predict(*obj, ts, exog, lout, newexog, res, amse);

  return res;
}


