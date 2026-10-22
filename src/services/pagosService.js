// Pasarela de pago simulada: espera un momento y responde aprobado o rechazado.
// Es un objeto para poder reemplazar procesar() por un mock en las pruebas.
export const pagosService = {
  procesar({ resultado = 'aprobado' }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (resultado === 'rechazado') {
          resolve({ aprobado: false, motivo: 'La tarjeta fue rechazada por el emisor (simulación).' });
        } else {
          resolve({ aprobado: true, referencia: 'PAY-' + Date.now() });
        }
      }, 700);
    });
  },
};