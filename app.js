// app.js
import { fetchModelo } from './data.js';
import { initEventosPestañas } from './events.js';
import { PintarDatos } from './ui.js';

async function iniciarApp() {
    // 1. Obtenemos datos
    const dataModelo = await fetchModelo();

    if (dataModelo) {
        // 2. Pintamos la primera vez (General)
        PintarDatos(dataModelo, "GENERAL");

        // 3. Inicializamos los eventos pasándole el JSON cargado
        initEventosPestañas(dataModelo);
    }


    console.log(dataModelo.lote)
    console.log(dataModelo.lote.embalaje.components)

    console.log(dataModelo.durabilidad)
    console.log(dataModelo.finVida)

}

iniciarApp();