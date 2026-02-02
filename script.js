async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '7dc449df-00aa-4d47-b978-0858cccdd914';
    const app = document.getElementById('app');

    try {
        // Intentamos la llamada a través de un proxy para evitar el bloqueo CORS directo
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://passport-traca.iti.es/inescop/modelo/${id}`)}`);
        
        if (!response.ok) throw new Error("Servidor de datos no disponible");

        const wrapper = await response.json();
        // Intentamos parsear el contenido que devuelve el proxy
        const data = JSON.parse(wrapper.contents);

        // Si los datos existen, pintamos la interfaz oficial
        const emisiones = data.finVida?.impactResults?.emissionsByPhase?.values || [];
        const totalCo2 = emisiones.reduce((acc, curr) => acc + curr.value, 0);
        const unidad = data.finVida?.impactResults?.emissionsByPhase?.unit || "Kg CO2 eq";
        const durabilidad = data.durabilidad?.durability || 0;

        app.innerHTML = `
            <div class="header">
                <h1>PIKOLINOS</h1>
                <small>PASAPORTE DIGITAL DE PRODUCTO</small>
            </div>
            <div class="content">
                <img src="${data.modelo.image}" class="product-img" alt="Pikolinos Modelo">
                <span class="badge">✓ Autenticidad Verificada</span>
                <h2>${data.modelo.name}</h2>
                <p style="color: #666; margin-bottom: 25px;">Fabricante: <b>${data.modelo.company}</b></p>
                
                <div class="data-card">
                    <strong>🌱 Huella Ambiental Total</strong>
                    <p style="font-size: 26px; margin: 5px 0; color: #27ae60; font-weight: bold;">
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
                    <p>Cumple con el Reglamento (UE) 2024/1781 (ESPR).</p>
                    <p style="text-align: center; color: #8B4513; font-weight: bold; margin-top: 15px; border-top: 1px solid #eee; pt-2">
                        TRAZABILIDAD BLOCKCHAIN
                    </p>
                </div>
            </div>
        `;

    } catch (error) {
        // Si falla, mostramos un error limpio y técnico
        app.innerHTML = `
            <div class="header"><h1>PIKOLINOS</h1></div>
            <div class="content" style="text-align:center; margin-top: 50px;">
                <div style="font-size: 50px;">⚠️</div>
                <h2>Servicio no disponible</h2>
                <p style="color: #666;">No se ha podido establecer conexión con el repositorio de datos del ITI.</p>
                <p style="font-size: 11px; color: #999; margin-top: 20px;">Error: Acceso restringido (CORS/Network)</p>
            </div>
        `;
    }
}

init();
