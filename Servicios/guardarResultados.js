// Importamos el módulo 'fs' para trabajar con archivos
const fs = require('fs');

// Guarda la lista de clientes que calificaron al beneficio en un archivo JSON
function guardarResultados(beneficios, rutaArchivo) {
  const json = JSON.stringify(beneficios, null, 2);
  fs.writeFileSync(rutaArchivo, json, 'utf-8');
}

// Guarda el historial completo por cliente en un archivo JSON
function guardarHistorialClientes(historial, rutaArchivo) {
  const json = JSON.stringify(historial, null, 2);
  fs.writeFileSync(rutaArchivo, json, 'utf-8');
}

// Exportamos ambas funciones
module.exports = {
  guardarResultados,
  guardarHistorialClientes
};
