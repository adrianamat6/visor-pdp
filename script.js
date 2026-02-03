async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '7dc449df-00aa-4d47-b978-0858cccdd914';
    const app = document.getElementById('app');

    // Intentamos la llamada a través de un proxy para evitar el bloqueo CORS directo

    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://passport-traca.iti.es/inescop/modelo/${id}`)}`);
    console.log('response:',response);


    if (!response.ok) throw new Error("Servidor de datos no disponible");

    const wrapper = await response.json();
    
    // Intentamos parsear el contenido que devuelve el proxy
    const data = JSON.parse(wrapper.contents);

    console.log('data:',data); 
    console.log(data.modelo)
    const nombreModelo = data.modelo.name; 
    const imageModelo = data.modelo.image; 

    console.log(imageModelo); 
}


init();
