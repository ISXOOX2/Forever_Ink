import { Form } from 'react-bootstrap';

// Etiqueta + campo + mensaje de error. El error solo se muestra si viene en la prop.
export default function CampoFormulario({
  id,
  etiqueta,
  error = '',
  tipo = 'text',
  opcional = false,
  ayuda = '',
  children,
  ...resto
}) {
  const Control = tipo === 'select' ? Form.Select : Form.Control;
  const propsControl = tipo === 'select' ? {} : { type: tipo === 'textarea' ? undefined : tipo };
  if (tipo === 'textarea') propsControl.as = 'textarea';

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label className="etiqueta-campo">
        {etiqueta}
        {opcional && <span className="text-muted fw-normal"> (opcional)</span>}
      </Form.Label>
      <Control isInvalid={Boolean(error)} {...propsControl} {...resto}>
        {children}
      </Control>
      {ayuda && !error && <Form.Text muted>{ayuda}</Form.Text>}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
