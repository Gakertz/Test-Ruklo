const fs = require('fs');
const path = require('path');

// Importar servicios
const { detectarBeneficiosPorVisitas } = require('./Servicios/procesarEventos');
const { guardarResultados, guardarHistorialClientes } = require('./Servicios/guardarResultados');
const { agruparEventosPorCliente } = require('./Servicios/calcularHistorial');

// Carga el archivo JSON
function cargarJSON(ruta) {
  try {
    const data = fs.readFileSync(ruta, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error.message);
    process.exit(1);
  }
}

function main() {
  const rutaArchivo = path.join(__dirname, 'ruklo_events_1000.json');
  const eventos = cargarJSON(rutaArchivo);

  const beneficios = detectarBeneficiosPorVisitas(eventos);

  if (beneficios.length === 0) {
    console.log('Ninguno califica aún.');
  } 

  guardarResultados(beneficios, path.join(__dirname, '5_visitas_0_recargas.json'));

  const historialPorCliente = agruparEventosPorCliente(eventos);
  guardarHistorialClientes(historialPorCliente, path.join(__dirname, 'historial_clientes.json'));
}

main();
