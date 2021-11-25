# vim: set noet:
CC = emcc
CXX = em++

# FILES =  libmvar/mvardie.c libmvar/mvarfit.c libmvar/mvarmat.c libmvar/mvarsim.c libmvar/mvartest.c
FILES = ctsa/src/*.c

EXPORTED_FUNCTIONS="['_fit_sarimax', '_predict_sarimax', '_fit_autoarima', '_predict_autoarima']"

CFLAGS = -O3 -Wall -fPIC --memory-init-file 0
EMCFLAGS = -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -s MODULARIZE=1

build:
	${CC} ${CFLAGS} ${EMCFLAGS} ${FILES} src/api.c -o wasm/native.js -s BINARYEN_ASYNC_COMPILATION=0;
	mv wasm/native.js wasm/native-sync.js
	${CC} ${CFLAGS} ${EMCFLAGS} ${FILES} src/api.c -o wasm/native.js -s BINARYEN_ASYNC_COMPILATION=1;
	mv wasm/native.js wasm/native-async.js

