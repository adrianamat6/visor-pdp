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

// -----------------------------------------------------------------------------------

function vistaFabricacion(data) {
    const fragment = document.createDocumentFragment();
    
    // Referencia rápida a la ruta de fabricación que has confirmado
    const fab = data.lote?.fabricacion || {};

    // --- 1. ENERGÍA (kWh) ---
    if (fab.consumoEnergia && fab.consumoEnergia.length > 0) {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.innerHTML = `<h2>ENERGÍA CONSUMIDA</h2>`;
        
        fab.consumoEnergia.forEach(e => {
            card.appendChild(crearGrupoInfo('TIPO DE RED:', e.energyType));
            card.appendChild(crearGrupoInfo('SUBTIPO:', e.energySubtype));
            card.appendChild(crearGrupoInfo('CANTIDAD:', `${e.amount} kWh`)); // <--- Dato de tu log
        });
        fragment.appendChild(card);
    }

    // --- 2. QUÍMICOS ---
    if (fab.consumoQuimicos && fab.consumoQuimicos.length > 0) {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.innerHTML = `<h2>PRODUCTOS QUÍMICOS</h2>`;
        
        fab.consumoQuimicos.forEach(q => {
            card.appendChild(crearGrupoInfo('SUSTANCIA:', q.chemicalType));
            card.appendChild(crearGrupoInfo('DETALLE:', q.chemicalSubtype));
            card.appendChild(crearGrupoInfo('CANTIDAD:', `${q.amount} kg`)); 
        });
        fragment.appendChild(card);
    }

    // --- 3. AGUA (m³) ---
    // Según tu log: dataModelo.finVida.waterConsumption.totalConsumed
    const water = data.finVida?.waterConsumption;
    if (water) {
        const cardAgua = document.createElement('div');
        cardAgua.className = 'card-container';
        cardAgua.innerHTML = `<h2>CONSUMO DE AGUA</h2>`;
        
        cardAgua.appendChild(crearGrupoInfo('TOTAL CONSUMIDO:', `${water.totalConsumed} m³`));
        cardAgua.appendChild(crearGrupoInfo('ORIGEN DEL DATO:', water.dataSourceTotalConsumed));
        
        fragment.appendChild(cardAgua);
    }

    // --- 4. RESIDUOS ---
    if (fab.wasteGenerated && fab.wasteGenerated.length > 0) {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.innerHTML = `<h2>RESIDUOS GENERADOS</h2>`;
        
        fab.wasteGenerated.forEach(w => {
            card.appendChild(crearGrupoInfo('TIPO:', w.wasteType));
            card.appendChild(crearGrupoInfo('DESTINO:', w.destinationSubtype));
            card.appendChild(crearGrupoInfo('CANTIDAD:', `${w.amount} g`));
        });
        fragment.appendChild(card);
    }

    // --- 5. RESUMEN DE EMISIONES ETAPA 2 (Fabricación) ---
    const valorCO2 = data.finVida?.impactResults?.emissionsByPhase?.values[1]?.value;

    if (valorCO2 !== undefined) {
        const cardTotal = document.createElement('div');
        cardTotal.className = 'card-container';
        cardTotal.style.backgroundColor = '#e8f5e9'; // Verde muy clarito (eco)
        cardTotal.style.border = '1px solid #c8e6c9';
        cardTotal.style.marginTop = '20px';

        const infoEmisiones = crearGrupoInfo(
            'TOTAL EMISIONES FABRICACIÓN:', 
            `${valorCO2.toFixed(2)} kg CO₂ eq`
        );
        
        infoEmisiones.querySelector('.value-text').style.fontSize = '22px';
        infoEmisiones.querySelector('.value-text').style.color = '#2e7d32'; 

        cardTotal.appendChild(infoEmisiones);
        fragment.appendChild(cardTotal);
    }

    return fragment;
}
// ------------------------------------------------------------------------------------
function vistaDistribucion(data) {
    const fragment = document.createDocumentFragment();
    
    // Accedemos a la ruta que indicaste (asumimos que puede ser un array de varias ventas)
    const ventas = data.lote?.distribucion?.ventas || [];

    if (ventas.length === 0) {
        const cardEmpty = document.createElement('div');
        cardEmpty.className = 'card-container';
        cardEmpty.innerHTML = `<p>No hay datos de distribución registrados.</p>`;
        return cardEmpty;
    }

    ventas.forEach((v, index) => {
        const card = document.createElement('div');
        card.className = 'card-container';
        card.style.marginBottom = '20px';

        // Título: Si hay más de una venta, las enumeramos
        card.innerHTML = `<h2>LOGÍSTICA DE ENTREGA ${ventas.length > 1 ? index + 1 : ''}</h2>`;

        // Información de destino
        card.appendChild(crearGrupoInfo('DESTINO:', v.destination));
        card.appendChild(crearGrupoInfo('CLIENTE:', v.client));
        card.appendChild(crearGrupoInfo('DISTANCIA RECORRIDA:', `${v.distance} km`));

        // Detalle del Vehículo de Transporte
        if (v.transport) {
            const transContainer = document.createElement('div');
            transContainer.style.marginTop = '15px';
            transContainer.style.padding = '12px';
            transContainer.style.backgroundColor = '#fff7ed'; // Naranja muy suave
            transContainer.style.border = '1px solid #ffedd5';


            transContainer.style.borderRadius = '8px';

            const transLabel = document.createElement('span');
            transLabel.className = 'label-text';
            transLabel.textContent = 'ESPECIFICACIONES DEL TRANSPORTE:';
            transContainer.appendChild(transLabel);

            const transDesc = document.createElement('p');
            transDesc.style.fontSize = '14px';
            transDesc.style.color = '#9a3412'; // Marrón/Naranja oscuro
            
            transDesc.style.marginTop = '5px';
            transDesc.innerHTML = `
                <strong>${v.transport.materialType}</strong><br>
                ${v.transport.specification} (${v.transport.materialSubType})
            `;
            
            transContainer.appendChild(transDesc);
            card.appendChild(transContainer);
        }

        fragment.appendChild(card);
    });

    // --- RESUMEN DE EMISIONES ETAPA 3 (Distribución) ---
    // En el estándar ACV, la posición [2] suele ser Distribución/Transporte
    const valorCO2 = data.finVida?.impactResults?.emissionsByPhase?.values[2]?.value;

    if (valorCO2 !== undefined) {
        const cardTotal = document.createElement('div');
        cardTotal.className = 'card-container';
        // cardTotal.style.backgroundColor = '#fffbeb'; // Ámbar claro
        // cardTotal.style.border = '1px solid #fef3c7';
        cardTotal.style.backgroundColor = '#e8f5e9'; // Verde muy clarito (eco)
        cardTotal.style.border = '1px solid #c8e6c9';
        
        cardTotal.style.marginTop = '20px';

        const infoEmisiones = crearGrupoInfo(
            'HUELA DE CARBONO DEL TRANSPORTE:', 
            `${valorCO2.toFixed(2)} kg CO₂ eq`
        );
        
        infoEmisiones.querySelector('.value-text').style.fontSize = '22px';
        infoEmisiones.querySelector('.value-text').style.color = '#2e7d32'; // Ámbar oscuro

        cardTotal.appendChild(infoEmisiones);
        fragment.appendChild(cardTotal);
    }

    return fragment;
}


// ------------------------------------------------------------------------------------
function vistaUso(data) {
    const fragment = document.createDocumentFragment();

    const card = document.createElement('div');
    card.className = 'card-container';
    card.innerHTML = `<h2>VIDA ÚTIL Y DURABILIDAD</h2>`;

    // Acceso directo a las rutas que confirmaste en consola
    card.appendChild(crearGrupoInfo('Nº DE USOS ESTIMADOS:', `${(data.durabilidad.durability).toFixed(2)} usos`));
    card.appendChild(crearGrupoInfo('DURABILIDAD DE REFERENCIA:', `${(data.durabilidad.durationService).toFixed(2)} usos`));

    fragment.appendChild(card);
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
            contenido = vistaFabricacion(dataModelo);
            break;
        case "DISTRIBUCIÓN":
            contenido = vistaDistribucion(dataModelo);
            break;
        case "USO":
            contenido =vistaUso(dataModelo); 
            break    
        default:
            contenido = vistaSimple(pestaña, "Sección en desarrollo...");
    }

    contenedorTab.appendChild(contenido);
}