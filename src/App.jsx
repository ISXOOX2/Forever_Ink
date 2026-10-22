// App guarda el estado que comparten varias páginas (sesión, carrito y avisos)
// y se lo pasa a cada una por props. Aquí también están todas las rutas.
import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutTienda from './components/plantillas/LayoutTienda.jsx';
import LayoutAdmin from './components/plantillas/LayoutAdmin.jsx';
import Avisos from './components/organismos/Avisos.jsx';
import RutaProtegida from './components/utilidades/RutaProtegida.jsx';
import ScrollArriba from './components/utilidades/ScrollArriba.jsx';
import LimiteDeErrores from './components/utilidades/LimiteDeErrores.jsx';
import { autenticar } from './services/usuariosService.js';
import { borrarSesion, guardarSesion, leerSesion } from './services/sesionService.js';
import {
  agregarItem, cambiarCantidad as cambiarCantidadItem, cantidadTotal, guardarCarrito, leerCarrito,
  quitarItem, totalCarrito, vaciarCarrito,
} from './services/carritoService.js';

import Home from './pages/tienda/Home.jsx';
import Productos from './pages/tienda/Productos.jsx';
import DetalleProducto from './pages/tienda/DetalleProducto.jsx';
import Categorias from './pages/tienda/Categorias.jsx';
import DetalleCategoria from './pages/tienda/DetalleCategoria.jsx';
import Ofertas from './pages/tienda/Ofertas.jsx';
import Carrito from './pages/tienda/Carrito.jsx';
import Checkout from './pages/tienda/Checkout.jsx';
import CompraExitosa from './pages/tienda/CompraExitosa.jsx';
import PagoFallido from './pages/tienda/PagoFallido.jsx';
import Login from './pages/tienda/Login.jsx';
import Registro from './pages/tienda/Registro.jsx';
import Nosotros from './pages/tienda/Nosotros.jsx';
import Blogs from './pages/tienda/Blogs.jsx';
import DetalleBlog from './pages/tienda/DetalleBlog.jsx';
import Contacto from './pages/tienda/Contacto.jsx';
import Perfil from './pages/tienda/Perfil.jsx';
import NoEncontrado from './pages/tienda/NoEncontrado.jsx';

// Las páginas del panel se cargan con lazy, solo cuando se visitan
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Ordenes = lazy(() => import('./pages/admin/Ordenes.jsx'));
const DetalleOrden = lazy(() => import('./pages/admin/DetalleOrden.jsx'));
const ProductosAdmin = lazy(() => import('./pages/admin/Productos.jsx'));
const DetalleProductoAdmin = lazy(() => import('./pages/admin/DetalleProductoAdmin.jsx'));
const FormularioProductoPagina = lazy(() => import('./pages/admin/FormularioProductoPagina.jsx'));
const CategoriasAdmin = lazy(() => import('./pages/admin/Categorias.jsx'));
const Usuarios = lazy(() => import('./pages/admin/Usuarios.jsx'));
const FormularioUsuarioPagina = lazy(() => import('./pages/admin/FormularioUsuarioPagina.jsx'));
const HistorialUsuario = lazy(() => import('./pages/admin/HistorialUsuario.jsx'));
const Reportes = lazy(() => import('./pages/admin/Reportes.jsx'));

const SOLO_ADMIN = ['Administrador'];
const PERSONAL = ['Administrador', 'Vendedor'];

export default function App() {
  // sesión (se lee de sessionStorage para no perderla al recargar)
  const [usuario, setUsuario] = useState(() => leerSesion());

  // devuelve { ok, usuario } o { ok: false, error }
  const iniciarSesion = (correo, password) => {
    const encontrado = autenticar(correo, password);
    if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    guardarSesion(encontrado);
    setUsuario(encontrado);
    return { ok: true, usuario: encontrado };
  };

  const cerrarSesion = () => {
    borrarSesion();
    setUsuario(null);
  };

  // al editar el perfil, para que la cabecera muestre los datos nuevos
  const actualizarSesion = (usuarioActualizado) => {
    guardarSesion(usuarioActualizado);
    setUsuario(usuarioActualizado);
  };

  // carrito
  const [items, setItems] = useState(() => leerCarrito());

  // se guarda en localStorage cada vez que cambia
  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  // avisos (toasts)
  const [avisos, setAvisos] = useState([]);

  const mostrarAviso = (mensaje, variante = 'dark') => {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, mensaje, variante }]);
  };

  const cerrarAviso = (id) => {
    setAvisos((actuales) => actuales.filter((a) => a.id !== id));
  };

  // agrega al carrito y muestra un aviso (máximo 5 por diseño y según cupos)
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const resultado = agregarItem(items, producto, cantidad);
    if (resultado.mensaje) {
      mostrarAviso(resultado.mensaje, 'danger');
      return false;
    }
    setItems(resultado.items);
    mostrarAviso(`«${producto.nombre}» se añadió a tu reserva.`);
    return true;
  };

  // lo que las páginas necesitan del carrito
  const carrito = {
    items,
    total: totalCarrito(items),
    cantidad: cantidadTotal(items),
    cambiarCantidad: (productoId, cantidad) => setItems((actuales) => cambiarCantidadItem(actuales, productoId, cantidad)),
    quitar: (productoId) => setItems((actuales) => quitarItem(actuales, productoId)),
    vaciar: () => setItems(vaciarCarrito()),
  };

  // protege una página del panel según el rol
  const soloAdmin = (pagina) => <RutaProtegida usuario={usuario} roles={SOLO_ADMIN}>{pagina}</RutaProtegida>;

  return (
    <LimiteDeErrores>
      <ScrollArriba />
      <Routes>
        <Route
          element={(
            <LayoutTienda
              usuario={usuario}
              onCerrarSesion={cerrarSesion}
              total={carrito.total}
              cantidad={carrito.cantidad}
              mostrarAviso={mostrarAviso}
            />
          )}
        >
          <Route path="/" element={<Home onAgregar={agregarAlCarrito} />} />
          <Route path="/productos" element={<Productos onAgregar={agregarAlCarrito} />} />
          <Route path="/productos/:id" element={<DetalleProducto onAgregar={agregarAlCarrito} />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<DetalleCategoria onAgregar={agregarAlCarrito} />} />
          <Route path="/ofertas" element={<Ofertas onAgregar={agregarAlCarrito} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} mostrarAviso={mostrarAviso} />} />
          <Route path="/checkout" element={<Checkout carrito={carrito} usuario={usuario} />} />
          <Route path="/compra-exitosa/:id" element={<CompraExitosa />} />
          <Route path="/pago-fallido/:id" element={<PagoFallido />} />
          <Route path="/login" element={<Login iniciarSesion={iniciarSesion} mostrarAviso={mostrarAviso} />} />
          <Route path="/registro" element={<Registro iniciarSesion={iniciarSesion} mostrarAviso={mostrarAviso} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto mostrarAviso={mostrarAviso} />} />
          <Route
            path="/perfil"
            element={(
              <RutaProtegida usuario={usuario}>
                <Perfil usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />
              </RutaProtegida>
            )}
          />
          <Route path="*" element={<NoEncontrado />} />
        </Route>

        <Route
          path="/admin"
          element={(
            <RutaProtegida usuario={usuario} roles={PERSONAL}>
              <LayoutAdmin usuario={usuario} onCerrarSesion={cerrarSesion} />
            </RutaProtegida>
          )}
        >
          <Route index element={<Dashboard usuario={usuario} />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:id" element={<DetalleOrden />} />
          <Route path="productos" element={<ProductosAdmin usuario={usuario} mostrarAviso={mostrarAviso} />} />
          <Route path="productos/:id" element={<DetalleProductoAdmin usuario={usuario} />} />
          {/* solo administrador */}
          <Route path="productos/nuevo" element={soloAdmin(<FormularioProductoPagina mostrarAviso={mostrarAviso} />)} />
          <Route path="productos/:id/editar" element={soloAdmin(<FormularioProductoPagina mostrarAviso={mostrarAviso} />)} />
          <Route path="categorias" element={soloAdmin(<CategoriasAdmin mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios" element={soloAdmin(<Usuarios usuario={usuario} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/nuevo" element={soloAdmin(<FormularioUsuarioPagina usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/:id/editar" element={soloAdmin(<FormularioUsuarioPagina usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/:id/historial" element={soloAdmin(<HistorialUsuario />)} />
          <Route path="reportes" element={soloAdmin(<Reportes />)} />
        </Route>
      </Routes>
      <Avisos avisos={avisos} onCerrar={cerrarAviso} />
    </LimiteDeErrores>
  );
}
