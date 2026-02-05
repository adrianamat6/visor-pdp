// app.js
import { fetchModelo } from './data.js';
import { initEventosPestañas } from './events.js';
import { PintarDatos } from './ui.js';

async function iniciarApp() {
    // 1. Obtenemos datos
    const dataModelo = await fetchModelo();

    if (dataModelo) {
        // 1. Pintamos GENERAL por primera vez
        PintarDatos(dataModelo, "GENERAL");

        // 2. Inicializamos eventos PASÁNDOLE los datos
        initEventosPestañas(dataModelo); 
    }


    //console.log(dataModelo.finVida.impactResults.emissionsByPhase.values[3])

    // console.log(dataModelo.lote.embalaje.components)

    // console.log(dataModelo.durabilidad)
    // console.log(dataModelo.finVida)
    console.log(dataModelo)
}

iniciarApp();