#pragma once

#ifdef _WIN32
    #ifdef BUILD_DLL
        #define EXPORT __declspec(dllexport)
    #else
        #define EXPORT __declspec(dllimport)
    #endif
#else
    #define EXPORT
#endif

extern "C"
{
    EXPORT void* crear_servidor();

    EXPORT void set_mount_point(
        void* server,
        const char* ruta,
        const char* carpeta);

    EXPORT void escuchar_servidor(
        void* server,
        const char* host,
        int puerto);
}