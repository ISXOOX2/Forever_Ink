// Las 10 pruebas de la defensa: renderizado, renderizado condicional, props, estado,
// eventos, hook propio, mocks, validación del RUN y rutas protegidas.
// Cada una sigue el orden Arrange / Act / Assert.
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import Boton from '../src/components/atomos/Boton.jsx';
import CampoFormulario from '../src/components/moleculas/CampoFormulario.jsx';
import Galeria from '../src/components/moleculas/Galeria.jsx';
import ListaProductos from '../src/components/organismos/ListaProductos.jsx';
import FormularioContacto from '../src/components/organismos/FormularioContacto.jsx';
import FormularioLogin from '../src/components/organismos/FormularioLogin.jsx';
import RutaProtegida from '../src/components/utilidades/RutaProtegida.jsx';
import useFormulario from '../src/utils/useFormulario.js';
import images from '../src/assets/images.js';
import { validarFormularioLogin, validarRun } from '../src/utils/validaciones.js';
import { listarProductos, obtenerProducto } from '../src/services/productosService.js';
import { pagosService } from '../src/services/pagosService.js';
import { CLAVE_CARRITO, agregarItem, leerCarrito } from '../src/services/carritoService.js';
import { listarOrdenes } from '../src/services/ordenesService.js';
import { productoDePrueba, proximoMiercoles, reiniciarTodo, renderApp, renderConRouter } from './ayudas.jsx';

describe('Las 10 pruebas de la defensa', () => {
  // se reinician los datos antes de cada prueba y se guarda la pasarela real
  // para devolverla después del mock de la prueba 8
  let procesarReal;
  beforeEach(() => {
    reiniciarTodo();
    procesarReal = pagosService.procesar;
  });
  afterEach(() => {
    pagosService.procesar = procesarReal;
  });

  // 1. renderizado de una lista
  it('1. ListaProductos dibuja una tarjeta por cada diseño del catálogo', () => {
    // Arrange: todos los diseños del catálogo
    const productos = listarProductos();

    // Act
    renderConRouter(<ListaProductos productos={productos} onAgregar={() => {}} />);

    // Assert: una tarjeta por diseño y cada nombre en pantalla
    expect(screen.getAllByRole('button', { name: 'Añadir a mi reserva' }).length).toBe(productos.length);
    productos.forEach((p) => {
      expect(screen.getAllByRole('link', { name: p.nombre }).length).toBeGreaterThan(0);
    });
  });

  // 2. el error solo aparece cuando existe
  it('2. CampoFormulario muestra el mensaje de error solo cuando recibe un error', () => {
    // sin la prop error no hay mensaje
    const sinError = render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} />);
    expect(screen.queryByText('El nombre es obligatorio')).toBeNull();
    sinError.unmount();

    // ahora con un error
    render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} error="El nombre es obligatorio" />);

    // Assert: se ve el mensaje y el campo queda como inválido
    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy();
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBe(true);
  });

  // 3. props del botón
  it('3. El átomo Boton muestra la etiqueta recibida y llama a onClick al hacer clic', () => {
    // Arrange: el spy registra las llamadas
    const alHacerClic = jasmine.createSpy('alHacerClic');
    render(<Boton etiqueta="Agendar cita" onClick={alHacerClic} />);
    const boton = screen.getByText('Agendar cita');
    expect(boton).toBeTruthy();

    // Act
    fireEvent.click(boton);

    // Assert: onClick se llamó una vez
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  // 4. el estado cambia al escribir
  it('4. FormularioContacto actualiza su estado (valor y contador) cuando el usuario escribe', () => {
    // Arrange
    render(<FormularioContacto onEnviar={() => {}} />);
    const comentario = screen.getByLabelText('Comentario');
    expect(screen.getByText('0/500 caracteres')).toBeTruthy();

    // Act
    fireEvent.change(comentario, { target: { name: 'comentario', value: 'Hola Forever Ink' } });

    // Assert: se ve el texto y el contador cambia
    expect(comentario.value).toBe('Hola Forever Ink');
    expect(screen.getByText('16/500 caracteres')).toBeTruthy();
  });

  // 5. clic en una miniatura
  it('5. Galeria cambia la imagen principal al hacer clic en una miniatura', () => {
    // Arrange: parte en la primera imagen
    render(<Galeria imagenes={['neko-chibi', 'neko-chibi-cuerpo']} nombre="Neko chibi" />);
    expect(screen.getByAltText(/vista 1 de 2/).getAttribute('src')).toBe(images['neko-chibi']);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 2' }));

    // Assert: cambió la imagen grande
    expect(screen.getByAltText(/vista 2 de 2/).getAttribute('src')).toBe(images['neko-chibi-cuerpo']);
  });

  // 6. hook useFormulario
  it('6. useFormulario valida en tiempo real y no deja enviar un formulario con errores', () => {
    // Arrange: el hook se prueba solo, sin formulario
    const { result } = renderHook(() => useFormulario({ correo: '', password: '' }, validarFormularioLogin));
    expect(result.current.visibles.correo).toBeUndefined();

    // Act: correo inválido
    act(() => result.current.cambiar('correo', 'sin-arroba'));
    // Assert
    expect(result.current.visibles.correo).toContain('correo válido');

    // Act: corrige el correo e intenta enviar sin contraseña
    act(() => result.current.cambiar('correo', 'ana@gmail.com'));
    let sePuedeEnviar;
    act(() => { sePuedeEnviar = result.current.intentarEnviar(); });

    // Assert
    expect(result.current.visibles.correo).toBeUndefined();
    expect(result.current.visibles.password).toBeTruthy();
    expect(sePuedeEnviar).toBe(false);
  });

  // 7. mock del servicio de sesión
  it('7. FormularioLogin envía los datos al servicio (mock) y muestra el error que este responde', () => {
    // Arrange: el servicio falso responde que la contraseña es incorrecta
    const servicioSesion = jasmine.createSpyObj('ServicioSesion', ['iniciar']);
    servicioSesion.iniciar.and.returnValue('Correo o contraseña incorrectos.');
    render(<FormularioLogin onEnviar={servicioSesion.iniciar} />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'correo', value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'Clave#12' } });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    // Assert: recibió los datos y se muestra su respuesta
    expect(servicioSesion.iniciar).toHaveBeenCalledWith({ correo: 'ana@gmail.com', password: 'Clave#12' });
    expect(screen.getByRole('alert').textContent).toContain('Correo o contraseña incorrectos.');
  });

  // 8. pago rechazado (mock de la pasarela)
  it('8. Checkout con pago RECHAZADO: la orden queda rechazada, el stock no cambia y el carrito se conserva', async () => {
    // Arrange: el mock rechaza el pago; el carrito tiene 1 diseño (stock 8)
    pagosService.procesar = jasmine.createSpy('procesar')
      .and.returnValue(Promise.resolve({ aprobado: false, motivo: 'Rechazada' }));
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(agregarItem([], productoDePrueba(1)).items));
    renderApp('/checkout');
    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
    escribir('Nombre', 'Ana');
    escribir('Apellidos', 'Pérez');
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Teléfono', '+56912345678');
    escribir('Tatuador/a', '1');
    escribir('Fecha', proximoMiercoles());
    escribir('Horario', '14:00');
    escribir('Zona del cuerpo', 'Antebrazo');
    escribir('Resultado de la pasarela de pago', 'rechazado');

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    // Assert: orden rechazada, el stock no cambia y el carrito se mantiene
    await waitFor(() => expect(screen.getByText(/No pudimos procesar tu pago/)).toBeTruthy());
    expect(pagosService.procesar).toHaveBeenCalledTimes(1);
    expect(listarOrdenes()[0].estado).toBe('Pago rechazado');
    expect(obtenerProducto(1).stock).toBe(8);
    expect(leerCarrito().length).toBe(1);
  });

  // 9. validación del RUN
  it('9. validarRun acepta un RUN correcto y rechaza dígito verificador, largo y vacío', () => {
    expect(validarRun('190110222')).toBe('');                        // válido
    expect(validarRun('190110221')).toContain('dígito verificador');  // dígito incorrecto
    expect(validarRun('12345')).not.toBe('');                         // muy corto (mín. 7)
    expect(validarRun('')).not.toBe('');                              // requerido
  });

  // 10. ruta protegida
  it('10. RutaProtegida manda al login sin sesión y al inicio si el rol no tiene permiso', () => {
    // /admin es solo para administradores
    const rutas = (usuario) => (
      <Routes>
        <Route path="/" element={<p>Inicio de la tienda</p>} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/admin" element={<RutaProtegida usuario={usuario} roles={['Administrador']}><p>Zona privada</p></RutaProtegida>} />
      </Routes>
    );

    // sin sesión -> login
    const primero = renderConRouter(rutas(null), { ruta: '/admin' });
    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.queryByText('Zona privada')).toBeNull();
    primero.unmount();

    // cliente -> inicio
    renderConRouter(rutas({ nombre: 'Ana', tipo: 'Cliente' }), { ruta: '/admin' });
    expect(screen.getByText('Inicio de la tienda')).toBeTruthy();
    expect(screen.queryByText('Zona privada')).toBeNull();
  });
});
