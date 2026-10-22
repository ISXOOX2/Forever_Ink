// Primero va Bootstrap y después tema.css, para que nuestros estilos puedan sobrescribirlo.
// No se importa el JS de Bootstrap porque react-bootstrap ya trae esos componentes.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/tema.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
