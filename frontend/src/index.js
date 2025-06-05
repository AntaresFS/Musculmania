import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './app';
import reportWebVitals from './reportWebVitals';

// Obtén el elemento donde se montará la aplicación
const rootElement = document.querySelector("#app");

// Usa createRoot para inicializar el renderizado
const root = createRoot(rootElement);

// Renderiza la aplicación
root.render(
  <React.StrictMode>
    <App />  
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
