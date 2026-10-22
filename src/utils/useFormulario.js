import { useState } from 'react';

// Hook para los formularios: guarda los valores y muestra los errores de los campos que ya
// se tocaron (o de todos si se intentó enviar).
export default function useFormulario(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const errores = validar(valores);

  const visibles = {};
  Object.keys(errores).forEach((campo) => {
    if (intentoEnvio || tocados[campo]) visibles[campo] = errores[campo];
  });

  const cambiar = (campo, valor) => {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setTocados((actuales) => ({ ...actuales, [campo]: true }));
  };

  const manejarCambio = (evento) => {
    const { name, type, checked, value } = evento.target;
    cambiar(name, type === 'checkbox' ? checked : value);
  };

  const manejarBlur = (evento) => {
    const { name } = evento.target;
    setTocados((actuales) => ({ ...actuales, [name]: true }));
  };

  // Marca el intento de envío (muestra todos los errores). Devuelve true si no hay errores.
  const intentarEnviar = () => {
    setIntentoEnvio(true);
    return Object.keys(errores).length === 0;
  };

  const reiniciar = (nuevosValores = valoresIniciales) => {
    setValores(nuevosValores);
    setTocados({});
    setIntentoEnvio(false);
  };

  return { valores, errores, visibles, cambiar, manejarCambio, manejarBlur, intentarEnviar, reiniciar, setValores };
}
