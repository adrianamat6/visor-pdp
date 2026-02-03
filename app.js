// app.js
import { fetchModelo } from './data.js';
import { initEventosPestañas } from './events.js';
import { PintarDatos } from './ui.js';
import { calcularTotalEmisiones } from './calculator.js';


// 1. Inicializamos los eventos de las pestañas
const contenedorPestañas = initEventosPestañas(); 

// 2. Llamamos a la función (con paréntesis) y esperamos los datos
// Nota: 'await' fuera de una función solo funciona en archivos type="module"
const dataModelo = await fetchModelo();

console.log(dataModelo);





const totalEmisiones = calcularTotalEmisiones(dataModelo.finVida.impactResults)
console.log(totalEmisiones); 

const contenedorTab = document.querySelector('#tab-content');


PintarDatos(dataModelo)
console.log('nodoElemento',contenedorTab)





