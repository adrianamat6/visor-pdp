// ui.js

import { fetchModelo } from './data.js';

export function PintarDatos(dataModelo){

    const contenedorTab = document.querySelector('#tab-content');
    contenedorTab.innerHTML = ''; // Limpia antes de pintar

    // 1. Contenedor de Texto
    const contenedorModelo = document.createElement('div');
    contenedorModelo.className = 'card-datos'; 
    contenedorModelo.textContent = `MODELO: ${dataModelo.modelo.name}`; 
    contenedorTab.appendChild(contenedorModelo); 

    // 2. Contenedor para la Imagen (con su clase para el fondo blanco)
    const contenedorImagen = document.createElement('div');
    contenedorImagen.className = 'card-img'; 

    const img = document.createElement('img');
    img.src = dataModelo.modelo.image;
    img.alt = dataModelo.modelo.name;
    img.style.width = '100%'; // Se adapta al contenedor con padding

    // 3. Meter la imagen en su div, y el div al main
    contenedorImagen.appendChild(img);
    contenedorTab.appendChild(contenedorImagen);





}