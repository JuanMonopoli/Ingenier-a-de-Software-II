const imageInput = document.getElementById("imageInput");
const processButton = document.getElementById("processButton");
const statusText = document.getElementById("status");

const originalCanvas = document.getElementById("originalCanvas");
const resultCanvas = document.getElementById("resultCanvas");

const originalContext = originalCanvas.getContext("2d", { willReadFrequently: true });
const resultContext = resultCanvas.getContext("2d", { willReadFrequently: true });

let selectedImage = null;
let wasmReady = window.wasmReady === true;

function updateButton() {
    processButton.disabled = !wasmReady || !selectedImage;
}

window.addEventListener("wasm-ready", () => {
    wasmReady = true;
    statusText.textContent = "WebAssembly está listo. Seleccioná una imagen.";
    updateButton();
});

function showError(message) {
    statusText.textContent = message;
}

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        selectedImage = null;
        updateButton();
        return;
    }

    if (!file.type.startsWith("image/")) {
        showError("Seleccioná un archivo de imagen válido.");
        selectedImage = null;
        updateButton();
        return;
    }

    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
        selectedImage = image;
        originalCanvas.width = image.naturalWidth;
        originalCanvas.height = image.naturalHeight;
        resultCanvas.width = image.naturalWidth;
        resultCanvas.height = image.naturalHeight;

        originalContext.drawImage(image, 0, 0);
        resultContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

        URL.revokeObjectURL(imageUrl);
        statusText.textContent = wasmReady
            ? "Imagen cargada. Ya podés aplicar el filtro."
            : "Imagen cargada. Esperando WebAssembly...";
        updateButton();
    };

    image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        showError("No se pudo abrir la imagen.");
    };

    image.src = imageUrl;
});

processButton.addEventListener("click", () => {
    if (!wasmReady || !selectedImage) return;

    const imageData = originalContext.getImageData(
        0, 0, originalCanvas.width, originalCanvas.height
    );
    const pixels = imageData.data;
    const byteLength = pixels.length;
    const pointer = Module._malloc(byteLength);

    if (!pointer) {
        showError("No se pudo reservar memoria para procesar la imagen.");
        return;
    }

    try {
        Module.HEAPU8.set(pixels, pointer);
        const numberOfPixels = originalCanvas.width * originalCanvas.height;
        Module._apply_grayscale(pointer, numberOfPixels);

        const processedPixels = Module.HEAPU8.slice(pointer, pointer + byteLength);
        imageData.data.set(processedPixels);
        resultContext.putImageData(imageData, 0, 0);
        showError("Imagen convertida correctamente con WebAssembly.");
    } catch (error) {
        console.error(error);
        showError("Ocurrió un error al procesar la imagen. Revisá la consola.");
    } finally {
        Module._free(pointer);
    }
});

updateButton();
