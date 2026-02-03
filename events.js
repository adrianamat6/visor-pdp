// events.js
import { PintarDatos } from './ui.js';

export function initEventosPestañas(dataModelo) {
    const contenedorPestañas = document.querySelectorAll('.tab-item');

    contenedorPestañas.forEach(nodoPestaña => {
        nodoPestaña.addEventListener('click', function() {
            // 1. UI Visual (pestañas)
            contenedorPestañas.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active'); 

            // 2. DISPARAR EL RENDER: Obtenemos el texto de la pestaña
            const nombrePestaña = this.textContent.trim();
            PintarDatos(dataModelo, nombrePestaña);
        });
    });
}