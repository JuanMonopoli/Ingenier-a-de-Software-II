#!/bin/bash

mkdir -p build
mkdir -p libs
mkdir -p uploads

echo "Compilando DLL JSON..."

g++ -std=c++17 \
    -shared \
    server/utils/intraned_api.cpp \
    -o libs/intraned_json.dll \
    -I server/include

if [ $? -ne 0 ]; then
    echo "Error compilando DLL."
    exit 1
fi

echo "Compilando aplicación..."

g++ -std=c++17 \
    -O3 \
    server/main.cpp \
    server/utils/fileHelper.cpp \
    -I server/include \
    -o build/intraned.exe \
    -lws2_32

if [ $? -eq 0 ]; then
    echo "Compilación exitosa."
else
    echo "Error compilando aplicación."
fi