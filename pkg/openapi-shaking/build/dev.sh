#!/bin/bash
NODE_ENV=development

cpx "./src/**/*.{hbs,json}" "dist/umd/src" --watch &
cpx "./src/**/*.{hbs,json}" "dist/esm/src" --watch &
tsc -p build/tsconfig.dev.umd.json -w &
tsc -p build/tsconfig.dev.es.json -w
