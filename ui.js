// ui.js

import { calcularTotalEmisiones } from './calculator.js';

export function PintarDatos(dataModelo) {
    const contenedorTab = document.querySelector('#tab-content');
    contenedorTab.innerHTML = ''; 

    const card = document.createElement('div');
    card.className = 'card-container';

    // Función auxiliar que ya tenías (la mantenemos igual)
    const crearGrupoInfo = (label, valor) => {
        const div = document.createElement('div');
        div.className = 'info-group';
        const spanLabel = document.createElement('span');
        spanLabel.className = 'label-text';
        spanLabel.textContent = label;
        const spanValue = document.createElement('span');
        spanValue.className = 'value-text';
        spanValue.textContent = valor;
        div.appendChild(spanLabel);
        div.appendChild(spanValue);
        return div;
    };

    // --- FORMATEO DE DATOS ---

    // 1. Fecha: Convertir "2024-12-30T..." a algo legible (30/12/2024)
    const fechaISO = dataModelo.modelo.studyPeriodFinish;
    const fechaLegible = new Date(fechaISO).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // 2. Peso: Usamos totalWeightPair y aseguramos decimales
    const peso = `${dataModelo.modelo.totalWeightPair} g`;

    // 3. Emisiones: Usando tu función del calculator.js
    const totalCO2 = calcularTotalEmisiones(dataModelo.finVida.impactResults);

    // --- CREACIÓN DE ELEMENTOS ---

    const grupoCompany = crearGrupoInfo('COMPAÑÍA:', dataModelo.modelo.company);
    const grupoModelo = crearGrupoInfo('MODELO:', dataModelo.modelo.name);
    
    // Imagen
    const img = document.createElement('img');
    img.src = dataModelo.modelo.image;
    img.alt = dataModelo.modelo.name;
    img.className = 'card-image';

    // Nuevos campos solicitados
    const grupoAnalisis = crearGrupoInfo('TIPO DE ANÁLISIS:', dataModelo.modelo.limitType);
    const grupoCalzado = crearGrupoInfo('TIPO DE CALZADO:', dataModelo.modelo.productType);
    const grupoPeso = crearGrupoInfo('PESO TOTAL:', peso);
    const grupoEmisiones = crearGrupoInfo('EMISIONES TOTALES:', `${totalCO2} kg CO₂ eq`);
    const grupoFecha = crearGrupoInfo('FECHA DE REGISTRO:', fechaLegible);

    // --- ENSAMBLAR ---
    // El orden aquí define cómo se ve en la tarjeta de arriba a abajo
    card.appendChild(grupoCompany);
    card.appendChild(grupoModelo);
    card.appendChild(img);
    card.appendChild(grupoAnalisis);
    card.appendChild(grupoCalzado);
    card.appendChild(grupoPeso);
    card.appendChild(grupoEmisiones);
    card.appendChild(grupoFecha);

    contenedorTab.appendChild(card);
}