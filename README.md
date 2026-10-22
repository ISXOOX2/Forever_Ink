# Forever Ink

Tienda y agenda de citas para un estudio de tatuajes. El cliente elige diseños, agenda su hora y paga
(pago simulado). El personal administra el catálogo, las órdenes y los usuarios desde un panel.

Desarrollo Fullstack II (DSY1104) · DuocUC · Evaluación Parcial 2

**Equipo:** Isabel Cántaro, Eduardo Caro y Yeremi Vásquez

**Tecnologías:** React + Vite, React Router, React Bootstrap, Jasmine + Karma

## Cómo ejecutarlo

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
npm test         # 15 pruebas + informe de cobertura en coverage/
npm run build    # versión final en dist/
```

Para abrirlo con Live Server primero hay que correr `npm run build` y luego abrir `index.html` con
*Open with Live Server* (ya está configurado para usar `dist/`).

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin.foreverink@gmail.com | Admin#123 |
| Vendedor | vendedor.foreverink@gmail.com | Venta#123 |
| Cliente | cliente.demo@gmail.com | Cliente#1 |

## Carpetas

```
src/
  components/   atomos, moleculas, organismos, plantillas y utilidades (Atomic Design)
  pages/        tienda/ y admin/
  services/     reglas de negocio (carrito, órdenes, productos, usuarios, pagos)
  data/         db.js (CRUD sobre localStorage) y datos iniciales
  utils/        validaciones, formato y el hook useFormulario
  assets/       imágenes y tema.css
test/           pruebas con Jasmine
docs/           ERS y documento de cobertura
```

## Notas

- No hay backend: los datos se guardan en el `localStorage` del navegador.
- El pago es simulado.
- Los 25 diseños del catálogo (5 estilos) son dibujos originales.
