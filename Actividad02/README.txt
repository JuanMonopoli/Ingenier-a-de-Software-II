PROYECTO: PROCESADOR DE IMAGENES CON WEBASSEMBLY

REQUISITOS
- Windows
- Emscripten SDK
- Python 3 (para el servidor local)
- Navegador actualizado

1. COMPILAR EL CODIGO C
Abrí Emscripten Command Prompt, entrá en esta carpeta y ejecutá:

emcc grayscale.c -O2 -s WASM=1 -s EXPORTED_FUNCTIONS="['_apply_grayscale','_malloc','_free']" -s EXPORTED_RUNTIME_METHODS="[]" -o grayscale.js

La compilación genera grayscale.js y grayscale.wasm.

2. INICIAR EL SERVIDOR
Abrí una terminal en la carpeta del proyecto y ejecutá:

python -m http.server 8000

3. ABRIR EN EL NAVEGADOR
Ingresá a http://localhost:8000

4. USAR
- Seleccioná una imagen.
- Esperá el mensaje "WebAssembly está listo".
- Presioná "Convertir a escala de grises".

COMO FUNCIONA
1. JavaScript carga la imagen en un canvas.
2. getImageData obtiene los bytes RGBA.
3. JavaScript reserva memoria en WASM con _malloc y copia los bytes.
4. Se llama a _apply_grayscale con la dirección de memoria y la cantidad de píxeles.
5. C calcula el gris y modifica los canales RGB; el canal alpha queda igual.
6. JavaScript copia el resultado al canvas y libera la memoria con _free.
