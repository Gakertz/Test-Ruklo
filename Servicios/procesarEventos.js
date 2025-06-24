// procesarEventos detecta qué clientes califican para el beneficio al visitar 5 veces seguidas la misma tienda sin hacer recargas entre medio.

// Primero ordenamos los eventos por cliente y por fecha
function detectarBeneficiosPorVisitas(eventos) {
  eventos.sort((a, b) => {
    if (a.client_id !== b.client_id) return a.client_id.localeCompare(b.client_id);
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  // Creamos tres estructuras auxiliares:
  const rachas = new Map();      // Map para llevar la cuenta de visitas consecutivas por cliente y tienda
  const ultimoTipo = new Map();  // Map para guardar el tipo del último evento por cliente y tienda
  const beneficios = [];         // Lista de resultados: clientes que califican

  // Recorremos cada evento ya ordenado
  for (const evento of eventos) {
    const { client_id: cliente, store_id: tienda, type: tipo } = evento;

    // Inicializamos las estructuras si es la primera vez que vemos a este cliente
    if (!rachas.has(cliente)) rachas.set(cliente, new Map());
    if (!ultimoTipo.has(cliente)) ultimoTipo.set(cliente, new Map());

    const rachaCliente = rachas.get(cliente);
    const ultimoEvento = ultimoTipo.get(cliente);

    // Caso evento visita
    if (tipo === 'visit') {
      // Verifica evento anterior y recuenta visitas
      const anterior = ultimoEvento.get(tienda);             
      const cantidad = rachaCliente.get(tienda) || 0;

      // Si el evento anterior también fue una visita, o es la primera, se suma a la racha
      if (anterior === 'visit' || cantidad === 0) {
        rachaCliente.set(tienda, cantidad + 1);
      } else {
        // Si hubo una recarga antes, se reinicia la racha con 1
        rachaCliente.set(tienda, 1);
      }

      // Si alcanzó 5 visitas consecutivas, guarda el beneficio
      if (rachaCliente.get(tienda) === 5) {
        beneficios.push({ cliente, tienda });
      }
    }

    // Si es un evento de recarga, se reinicia la racha para esa tienda
    else if (tipo === 'recharge') {
      rachaCliente.set(tienda, 0);
    }

    // Guardamos el tipo de evento actual como el último tipo visto
    ultimoEvento.set(tienda, tipo);
  }

  // Devolvemos la lista
  return beneficios;
}

// Exportamos la función para poder usarla en otros archivos
module.exports = { detectarBeneficiosPorVisitas };
