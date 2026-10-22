// La sesión va en sessionStorage, sin la contraseña.
export const CLAVE_SESION = 'foreverInk_sesion';

export function leerSesion() {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

export function guardarSesion(usuario) {
  try {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  } catch {
    /* sin almacenamiento disponible */
  }
}

export function borrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE_SESION);
  } catch {
    /* nada que hacer */
  }
}
