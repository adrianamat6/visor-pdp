// event.js

export function initEventosPestañas() {
    const contenedorPestañas = document.querySelectorAll('.tab-item');

    for (let nodoPestaña of contenedorPestañas) {
        nodoPestaña.addEventListener('click', function() {
            
            // 1. Quitamos la clase 'active' a todas las pestañas primero
            contenedorPestañas.forEach(tab => tab.classList.remove('active'));

            // 2. Se la añadimos a la pestaña que acabamos de pulsar
            this.classList.add('active'); 
        });
    }

    return contenedorPestañas; 
}