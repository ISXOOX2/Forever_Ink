// Reglas del carrito: máximo 5 por diseño, no más que los cupos y mínimo 1.
// Las funciones devuelven un arreglo nuevo en vez de modificar el que reciben.
import { precioFinal } from './productosService.js';

export const CLAVE_CARRITO = 'foreverInk_carrito_v2';
export const MAXIMO_POR_ITEM = 5;

// Cantidad máxima que se puede reservar de un producto.
export function limiteDeCantidad(stock) {
  return Math.min(Number(stock), MAXIMO_POR_ITEM);
}

// agrega un diseño (o suma uno). Devuelve { items, mensaje }; si hay mensaje, no se pudo
export function agregarItem(items, producto, cantidad = 1) {
  if (producto.stock <= 0) {
    return { items, mensaje: 'Este diseño no tiene cupos disponibles.' };
  }
  const existente = items.find((i) => i.productoId === producto.id);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  const limite = limiteDeCantidad(producto.stock);

  if (nuevaCantidad > limite) {
    return { items, mensaje: `Solo puedes reservar hasta ${limite} unidad(es) de este diseño.` };
  }
  if (existente) {
    return {
      items: items.map((i) => (i.productoId === producto.id ? { ...i, cantidad: nuevaCantidad } : i)),
      mensaje: '',
    };
  }
  const nuevo = {
    productoId: producto.id,
    nombre: producto.nombre,
    imagen: producto.imagen,
    categoriaId: producto.categoriaId,
    precio: precioFinal(producto),
    stock: producto.stock,
    cantidad,
  };
  return { items: [...items, nuevo], mensaje: '' };
}

// Cambia la cantidad de un ítem respetando el mínimo (1) y el límite por cupos.
export function cambiarCantidad(items, productoId, cantidad) {
  return items.map((item) => {
    if (item.productoId !== productoId) return item;
    const limite = limiteDeCantidad(item.stock);
    const valida = Math.min(Math.max(1, Number(cantidad) || 1), limite);
    return { ...item, cantidad: valida };
  });
}

export function quitarItem(items, productoId) {
  return items.filter((item) => item.productoId !== productoId);
}

export function vaciarCarrito() {
  return [];
}

export function totalCarrito(items) {
  return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

export function cantidadTotal(items) {
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

// Persistencia en localStorage
export function leerCarrito() {
  try {
    const texto = localStorage.getItem(CLAVE_CARRITO);
    const datos = texto ? JSON.parse(texto) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  } catch {
    /* sin almacenamiento disponible */
  }
}
