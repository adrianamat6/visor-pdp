// data.js
const PROXY = "https://api.allorigins.win/get?url=";
const BASE_URL = "https://passport-traca.iti.es/inescop/modelo/";

export const fetchModelo = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // AQUÍ ESTÁ EL TRUCO:
    // Si la URL no tiene ?id=, usaremos por defecto el código largo que me has pasado    "7dc449df-00aa-4d47-b978-0858cccdd914"
    // http://127.0.0.1:5500/index.html?id=AQUI_PEGAS_EL_OTRO_ID   // "4182ab45-11c2-4de0-b78c-767cbcdea357"
    const id = urlParams.get('id') || "4182ab45-11c2-4de0-b78c-767cbcdea357"; 
        
    const url_ITI_final = `${BASE_URL}${id}`; // "https://passport-traca.iti.es/inescop/modelo/7dc449df-00aa-4d47-b978-0858cccdd914"
    
    console.log("🚀 URL FINAL CONSTRUIDA:", url_ITI_final);

    try {
        const respuesta = await fetch(`${PROXY}${encodeURIComponent(url_ITI_final)}`);
        const jsonProxy = await respuesta.json();
        const datosReales = JSON.parse(jsonProxy.contents);
        return datosReales;

    } catch (error) {
        console.error("Error cargando el modelo:", error);
        return null;
    }
};

