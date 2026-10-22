import { Navigate, useLocation } from 'react-router-dom';

// Sin sesión manda al login; si el rol no tiene permiso, al inicio.
export default function RutaProtegida({ usuario, roles = [], children }) {
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles.length > 0 && !roles.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
