// data.js
const PROXY = "https://api.allorigins.win/get?url=";
const BASE_URL = "https://passport-traca.iti.es/inescop/modelo/";

export const fetchModelo = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Intentamos coger el ID de la URL (?id=...)
    let id = urlParams.get('id');

    // 2. Si no hay ?id=, probamos a ver si el ID está directamente al final de la URL
    // Esto es por si el QR es: tuweb.com/4182ab45...
    if (!id) {
        const pathSegments = window.location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        // Si el último segmento parece un UUID (tiene guiones), lo usamos
        if (lastSegment.includes('-')) {
            id = lastSegment;
        }
    }

    // 3. Si sigue sin haber ID, usamos el de prueba  // 4182ab45-11c2-4de0-b78c-767cbcdea357
    if (!id) {
        id = "4182ab45-11c2-4de0-b78c-767cbcdea357";
        console.log("⚠️ No se detectó ID en el QR. Usando ID de prueba.");
    }

    const url_ITI_final = `${BASE_URL}${id}`;
    console.log("🚀 URL FINAL CONSTRUIDA:", url_ITI_final);

    try {
        const respuesta = await fetch(`${PROXY}${encodeURIComponent(url_ITI_final)}`);
        
        if (!respuesta.ok) throw new Error("Error en la respuesta del Proxy");

        const jsonProxy = await respuesta.json();
        
        // Verificamos si AllOrigins ha devuelto contenido
        if (!jsonProxy.contents) {
            throw new Error("El servidor de destino no devolvió datos.");
        }

        const datosReales = JSON.parse(jsonProxy.contents);
        return datosReales;

    } catch (error) {
        console.error("❌ Error cargando el modelo:", error);
        // Si hay un error, devolvemos null para que app.js sepa que debe mostrar un error
        return null;
    }
};