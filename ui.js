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
    
    // 1. Obtener componentes
    const componentes = data.lote?.embalaje?.components || data.components || [];

    // 2. Pintar cada componente
    componentes.forEach((comp, index) => {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.style.marginBottom = '15px';

        card.innerHTML = `<h2>${index + 1}. ${comp.name}</h2>`;
        card.appendChild(crearGrupoInfo('TIPO:', comp.componentType));
        card.appendChild(crearGrupoInfo('PESO:', `${comp.componentWeight} g`));
        card.appendChild(crearGrupoInfo('PROVEEDOR:', comp.providerName));

        // Sub-lista de materiales
        if (comp.materials && comp.materials.length > 0) {
            const matDiv = document.createElement('div');
            matDiv.style.background = '#f4f4f4';
            matDiv.style.padding = '10px';
            matDiv.style.marginTop = '10px';
            matDiv.style.borderRadius = '6px';
            matDiv.innerHTML = `<span class="label-text">COMPOSICIÓN:</span>`;
            
            comp.materials.forEach(m => {
                matDiv.innerHTML += `
                    <p style="font-size:13px; margin-top:4px; color:#555">
                        • ${m.materialType} (${m.materialPercentage}%)
                    </p>`;
            });
            card.appendChild(matDiv);
        }
        fragment.appendChild(card);
    });

    // 3. Añadir Packaging si existe
    if (data.packaging && data.packaging.length > 0) {
        data.packaging.forEach(p => {
            const pCard = document.createElement('div');
            pCard.className = 'card-container';
            pCard.style.border = '1px dashed #aaa';
            pCard.innerHTML = `<h2>EMBALAJE: ${p.packaningName}</h2>`;
            pCard.appendChild(crearGrupoInfo('TIPO:', p.type));
            pCard.appendChild(crearGrupoInfo('PESO:', `${p.packagingWeight} g`));
            fragment.appendChild(pCard);
        });
    }

    // --- 4. RESUMEN DE EMISIONES DE ESTA ETAPA ---
    // Usamos la ruta exacta que me has pasado
    const valorCO2 = data.finVida?.impactResults?.emissionsByPhase?.values[0]?.value;

    if (valorCO2 !== undefined) {
        const cardResumen = document.createElement('div');
        cardResumen.className = 'card-container';
        
        // Estilo destacado: fondo oscuro o un color suave para indicar "resultado"
        cardResumen.style.backgroundColor = '#e8f5e9'; // Verde muy clarito (eco)
        cardResumen.style.border = '1px solid #c8e6c9';
        cardResumen.style.marginTop = '30px';

        const infoEmisiones = crearGrupoInfo(
            'TOTAL EMISIONES DE ESTA ETAPA:', 
            `${valorCO2.toFixed(2)} kg CO₂ eq`
        );
        
        // Personalizamos un poco el valor para que sea más grande
        infoEmisiones.querySelector('.value-text').style.fontSize = '22px';
        infoEmisiones.querySelector('.value-text').style.color = '#2e7d32'; // Verde oscuro

        cardResumen.appendChild(infoEmisiones);
        fragment.appendChild(cardResumen);
    }

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