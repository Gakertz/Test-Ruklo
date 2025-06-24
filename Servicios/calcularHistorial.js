// Agrupa los eventos por cliente separando los eventos por tipo
function agruparEventosPorCliente(eventos) {
  const historial = {};
  for (const evento of eventos) {
    const cliente = evento.client_id;

    // Si es la primera vez que encontramos al cliente, inicializamos su estructura
    if (!historial[cliente]) {
      historial[cliente] = { visit: [], recharge: [] };
    }

    // Agregamos el evento a la lista correspondiente según su tipo
    historial[cliente][evento.type].push(evento);
  }
  return historial;
}

// Obtiene la semana a partir de una fecha
function obtenerSemanaISO(fecha) {
  const d = new Date(fecha);
  const dia = d.getUTCDay() || 7; // El domingo (0) se considera día 7
  d.setUTCDate(d.getUTCDate() + 1 - dia); // Ajuste al lunes de la misma semana

  // Obtenemos el primer día del año
  const añoInicio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // Calculamos el número de la semana
  const semana = Math.ceil((((d - añoInicio) / 86400000) + 1) / 7);

  // Retornamos el año y número de semana
  return `${d.getUTCFullYear()}-W${String(semana).padStart(2, '0')}`;
}

// Calcula el promedio semanal de montos recargados, incluyendo semanas con promedio 0
function calcularPromedioRecargasPorSemana(eventosRecharge) {
  // Si no hay recargas, devolvemos objeto vacío
  if (eventosRecharge.length === 0) return {};

  // Extraemos todas las fechas de recargas
  const fechas = eventosRecharge.map(e => new Date(e.timestamp));

  // Determinamos el rango de fechas (inicio y fin)
  const primeraFecha = new Date(Math.min(...fechas));
  const ultimaFecha = new Date(Math.max(...fechas));

  // Ajustamos el inicio a la semana completa (lunes)
  const inicio = new Date(primeraFecha);
  inicio.setUTCDate(inicio.getUTCDate() - inicio.getUTCDay());

  // Ajustamos el fin al domingo de la última semana
  const fin = new Date(ultimaFecha);
  fin.setUTCDate(fin.getUTCDate() - fin.getUTCDay() + 6);

  // Creamos todas las semanas entre la fecha inicial y final
  const semanasTotales = {};
  let cursor = new Date(inicio);
  while (cursor <= fin) {
    const clave = obtenerSemanaISO(cursor.toISOString());
    semanasTotales[clave] = []; // Inicializamos la semana con lista vacía
    cursor.setUTCDate(cursor.getUTCDate() + 7); // Avanzamos una semana
  }

  // Llenamos las semanas con los montos recargados
  for (const recarga of eventosRecharge) {
    const semana = obtenerSemanaISO(recarga.timestamp);
    if (!semanasTotales[semana]) semanasTotales[semana] = [];
    semanasTotales[semana].push(recarga.amount || 0);
  }

  // Calculamos el promedio de montos por semana
  const promedios = {};
  for (const [semana, montos] of Object.entries(semanasTotales)) {
    if (montos.length === 0) {
      promedios[semana] = 0; // Semana sin recargas
    } else {
      const suma = montos.reduce((a, b) => a + b, 0);
      promedios[semana] = suma / montos.length; // Promedio simple
    }
  }

  return promedios;
}

// Exportamos las funciones para usarlas en otros módulos
module.exports = {
  agruparEventosPorCliente,
  calcularPromedioRecargasPorSemana
};
