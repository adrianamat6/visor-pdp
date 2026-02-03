// ui.js
import { calcularTotalEmisiones } from './calculator.js';

const contenedorTab = document.querySelector('#tab-content');

// --- TUS COMPONENTES DE UI ---

const crearGrupoInfo = (label, valor) => {
    const div = document.createElement('div');
    div.className = 'info-group';
    div.innerHTML = `
        <span class="label-text">${label}</span>
        <span class="value-text">${valor}</span>
    `;
    return div;
};
// ------------------------------------------------------------------------------------

// VISTA: GENERAL
function vistaGeneral(data) {
    const card = document.createElement('div');
    card.className = 'card-container';

    const fechaLegible = new Date(data.modelo.studyPeriodFinish).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const totalCO2 = calcularTotalEmisiones(data.finVida.impactResults);

    card.appendChild(crearGrupoInfo('COMPAÑÍA:', data.modelo.company));
    card.appendChild(crearGrupoInfo('MODELO:', data.modelo.name));
    
    const img = document.createElement('img');
    img.src = data.modelo.image;
    img.className = 'card-image';
    card.appendChild(img);


    card.appendChild(crearGrupoInfo('PESO TOTAL:', `${data.modelo.totalWeightPair} g`));
    card.appendChild(crearGrupoInfo('TIPO CALZADO:', `${data.modelo.productType}`));
    card.appendChild(crearGrupoInfo('EMISIONES TOTALES:', `${totalCO2} kg CO₂ eq`));
    card.appendChild(crearGrupoInfo('FECHA:', fechaLegible));



    return card;
}
// ------------------------------------------------------------------------------------
// VISTA: COMPONENTES (Ejemplo de cómo listar cosas)
function vistaComponentes(data) {
    const contenedorFragment = document.createDocumentFragment();

    // Accedemos a la ruta que indicaste
    const componentes = data.lote?.embalaje?.components || [];

    if (componentes.length === 0) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'card-container';
        emptyCard.innerHTML = `<p>No hay componentes registrados en el embalaje.</p>`;
        return emptyCard;
    }

    // Recorremos cada componente del array
    componentes.forEach((comp, index) => {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.style.marginBottom = '10px'; // Un poco de aire entre componentes

        // Título del componente (Número y Nombre)
        const titulo = document.createElement('h2');
        titulo.style.fontSize = '16px';
        titulo.style.marginBottom = '15px';
        titulo.style.color = '#000';
        titulo.textContent = `${index + 1}. ${comp.name}`;
        card.appendChild(titulo);

        // Información detallada usando tu función auxiliar crearGrupoInfo
        card.appendChild(crearGrupoInfo('TIPO:', comp.componentType || 'N/A'));
        card.appendChild(crearGrupoInfo('PESO:', `${comp.componentWeight} g`));
        card.appendChild(crearGrupoInfo('PROVEEDOR:', comp.providerName || 'Desconocido'));
        card.appendChild(crearGrupoInfo('DISTANCIA TRANSPORTE:', `${comp.transportDistanceProvider} km`));

        // Opcional: Si hay material, podrías añadirlo aquí si existe en el JSON
        if (comp.materialName) {
            card.appendChild(crearGrupoInfo('MATERIAL:', comp.materialName));
        }

        contenedorFragment.appendChild(card);
    });

    return contenedorFragment;
}


// ------------------------------------------------------------------------------------

// VISTA: GENÉRICA PARA LAS DEMÁS (Fabricación, Uso, etc.)
function vistaSimple(titulo, info) {
    const card = document.createElement('div');
    card.className = 'card-container';
    card.innerHTML = `<h3>${titulo}</h3><p style="margin-top:10px">${info}</p>`;
    return card;
}

// ------------------------------------------------------------------------------------

// --- EL DISTRIBUIDOR (La función que exportamos) ---
export function PintarDatos(dataModelo, pestaña = "GENERAL") {
    contenedorTab.innerHTML = ''; 
    let contenido;

    switch (pestaña) {
        case "GENERAL":
            contenido = vistaGeneral(dataModelo);
            break;
        case "COMPONENTES":
            contenido = vistaComponentes(dataModelo);
            break;
        case "FABRICACIÓN":
            contenido = vistaSimple("Proceso de Fabricación", "Aquí irán los datos de energía y procesos de montaje.");
            break;
        case "DISTRIBUCIÓN":
            contenido = vistaSimple("Distribución", "Datos logísticos y de transporte.");
            break;
        default:
            contenido = vistaSimple(pestaña, "Sección en desarrollo...");
    }

    contenedorTab.appendChild(contenido);
}