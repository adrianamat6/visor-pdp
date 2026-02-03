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
    const fragment = document.createDocumentFragment();
    
    // REVISIÓN DE RUTA: 
    // Intentamos buscar en 'lote.embalaje.components' o directamente en 'components'
    const componentes = data.lote?.embalaje?.components || data.components || [];

    if (componentes.length === 0) {
        const errorCard = document.createElement('div');
        errorCard.className = 'card-container';
        errorCard.innerHTML = `<p>No se han encontrado componentes en este modelo.</p>`;
        return errorCard;
    }

    componentes.forEach((comp, index) => {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.style.marginBottom = '20px';

        card.innerHTML = `<h2>${index + 1}. ${comp.name}</h2>`;
        
        card.appendChild(crearGrupoInfo('TIPO:', comp.componentType));
        card.appendChild(crearGrupoInfo('PESO:', `${comp.componentWeight} g`));
        card.appendChild(crearGrupoInfo('PROVEEDOR:', comp.providerName));

        // Materiales
        if (comp.materials && comp.materials.length > 0) {
            const matDiv = document.createElement('div');
            matDiv.style.background = '#f9f9f9';
            matDiv.style.padding = '10px';
            matDiv.style.marginTop = '10px';
            matDiv.innerHTML = `<span class="label-text">COMPOSICIÓN:</span>`;
            
            comp.materials.forEach(m => {
                matDiv.innerHTML += `
                    <p style="font-size:14px; margin-top:5px;">
                        • ${m.materialType} - ${m.materialSubtype} (${m.materialPercentage}%)
                    </p>`;
            });
            card.appendChild(matDiv);
        }

        fragment.appendChild(card);
    });

    return fragment;
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