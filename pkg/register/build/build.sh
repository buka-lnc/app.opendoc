#!/bin/bash

cpx "./src/**/*.{hbs,json}" "dist/umd/src" &
cpx "./src/**/*.{hbs,json}" "dist/esm/src" &
tsc -p ./build/tsconfig.umd.json &
tsc -p ./build/tsconfig.es.json
