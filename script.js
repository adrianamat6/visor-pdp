async function init() {
    // 1. Obtenemos el ID de la URL (ej: index.html?id=7dc449df...)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '7dc449df-00aa-4d47-b978-0858cccdd914';

    const app = document.getElementById('app');

    try {
        // 2. Llamada a la API del ITI
        const response = await fetch(`https://passport-traca.iti.es/inescop/modelo/${id}`);
        
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const data = await response.json();

        // 3. Procesamos los datos (Huella CO2 y Durabilidad)
        const emisiones = data.finVida?.impactResults?.emissionsByPhase?.values || [];
        const totalCo2 = emisiones.reduce((acc, curr) => acc + curr.value, 0);
        const unidad = data.finVida?.impactResults?.emissionsByPhase?.unit || "Kg CO2 eq";
        const durabilidad = data.durabilidad?.durability || 0;

        // 4. Renderizamos el HTML
        app.innerHTML = `
            <div class="header">
                <h1>PIKOLINOS</h1>
                <small>PASAPORTE DIGITAL DE PRODUCTO</small>
            </div>
            <div class="content">
                <img src="${data.modelo.image}" class="product-img" alt="Calzado Pikolinos">
                <span class="badge">✓ Autenticidad Verificada</span>
                <h2>${data.modelo.name}</h2>
                <p style="color: #666;">Fabricado por: <b>${data.modelo.company}</b></p>
                
                <div class="data-card">
                    <strong>🌱 Huella Ambiental Total</strong>
                    <p style="font-size: 26px; margin: 5px 0; color: var(--color-eco); font-weight: bold;">
                        ${totalCo2.toFixed(2)} <span style="font-size: 14px;">${unidad}</span>
                    </p>
                </div>

                <div class="data-card">
                    <strong>👞 Índice de Durabilidad</strong>
                    <p style="font-size: 26px; margin: 5px 0; color: #d35400; font-weight: bold;">
                        ${durabilidad.toFixed(1)}%
                    </p>
                </div>

                <div class="footer-info">
                    <p><b>DID:</b> did:ethr:0x3d47f3a03fea74b605e9b37d529384cbc7955254</p>
                    <p>Este pasaporte digital cumple con el Reglamento Europeo (UE) 2024/1781 (ESPR).</p>
                    <p style="text-align: center; color: var(--color-pikolinos); font-weight: bold; margin-top: 15px;">
                        TRAZABILIDAD GARANTIZADA POR TRACA BLOCKCHAIN
                    </p>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        app.innerHTML = `
            <div class="content" style="text-align:center; margin-top: 50px;">
                <h2>❌ Error de Conexión</h2>
                <p>No se ha podido recuperar la información del Pasaporte Digital.</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

// Arrancamos la aplicación
init();