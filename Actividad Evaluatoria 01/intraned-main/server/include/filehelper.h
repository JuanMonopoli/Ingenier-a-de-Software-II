#pragma once

#include "json.hpp"

using json = nlohmann::json;

namespace FileHelper
{
    bool registrarArchivo(const json& nuevoRecurso);
}