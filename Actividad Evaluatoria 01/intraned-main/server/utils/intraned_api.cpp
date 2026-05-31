#include "../include/json.hpp"

#include <string>

using json = nlohmann::json;

#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

static std::string resultado;

extern "C"
{

EXPORT const char* formatear_json(const char* texto)
{
    json j = json::parse(texto);

    resultado = j.dump(4);

    return resultado.c_str();
}

EXPORT int validar_json(const char* texto)
{
    try
    {
        auto j = json::parse(texto);
        return 1;
    }
    catch (...)
    {
        return 0;
    }
}

}