import { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import Boton from '../atomos/Boton.jsx';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioLogin } from '../../utils/validaciones.js';

// onEnviar devuelve '' si todo salió bien o el mensaje de error.
export default function FormularioLogin({ onEnviar }) {
  const f = useFormulario({ correo: '', password: '' }, validarFormularioLogin);
  const [errorGeneral, setErrorGeneral] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    setErrorGeneral(onEnviar(f.valores) || '');
  };

  return (
    <Form onSubmit={enviar} noValidate aria-label="Iniciar sesión">
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}
      <CampoFormulario
        id="login-correo"
        etiqueta="Correo electrónico"
        tipo="email"
        name="correo"
        autoComplete="email"
        placeholder="tucorreo@gmail.com"
        value={f.valores.correo}
        onChange={f.manejarCambio}
        onBlur={f.manejarBlur}
        error={f.visibles.correo}
      />
      <CampoFormulario
        id="login-password"
        etiqueta="Contraseña"
        tipo="password"
        name="password"
        autoComplete="current-password"
        value={f.valores.password}
        onChange={f.manejarCambio}
        onBlur={f.manejarBlur}
        error={f.visibles.password}
      />
      <Boton tipo="submit" etiqueta="Iniciar sesión" className="w-100" />
    </Form>
  );
}
