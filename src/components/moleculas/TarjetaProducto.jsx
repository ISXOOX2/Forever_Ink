import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Boton from '../atomos/Boton.jsx';
import { estaEnOferta, esStockCritico, precioFinal } from '../../services/productosService.js';
import { formatoCLP } from '../../utils/formato.js';
import images from '../../assets/images.js';

// Tarjeta de un diseño. Todo llega por props (producto y onAgregar).
export default function TarjetaProducto({ producto, nombreCategoria = '', onAgregar }) {
  const sinCupos = producto.stock <= 0;
  const oferta = estaEnOferta(producto);

  return (
    <Card className="tarjeta-producto h-100">
      <div className="marco-imagen position-relative">
        <Link to={`/productos/${producto.id}`}>
          <Card.Img variant="top" src={images[producto.imagen]} alt={`Diseño ${producto.nombre}`} />
        </Link>
        {oferta && <span className="badge insignia-oferta">Oferta</span>}
      </div>
      <Card.Body className="d-flex flex-column">
        {nombreCategoria && <small className="text-muted text-uppercase">{nombreCategoria}</small>}
        <Card.Title as="h3" className="h6 mb-1">
          <Link to={`/productos/${producto.id}`} className="text-dark text-decoration-none">
            {producto.nombre}
          </Link>
        </Card.Title>
        <small className="text-muted mb-2">{producto.tamano} · {producto.duracionHoras} h</small>

        <div className="mb-2">
          <span className="precio">{formatoCLP(precioFinal(producto))}</span>
          {oferta && <span className="precio-tachado ms-2">{formatoCLP(producto.precio)}</span>}
        </div>

        {/* aviso según los cupos */}
        {sinCupos && <small className="text-danger mb-2">Sin cupos disponibles</small>}
        {!sinCupos && esStockCritico(producto) && (
          <small className="text-warning-emphasis mb-2">
            {producto.stock === 1 ? '¡Último cupo!' : `¡Últimos ${producto.stock} cupos!`}
          </small>
        )}

        <Boton
          etiqueta="Añadir a mi reserva"
          className="mt-auto"
          deshabilitado={sinCupos}
          onClick={() => onAgregar && onAgregar(producto)}
        />
      </Card.Body>
    </Card>
  );
}
