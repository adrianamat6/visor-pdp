/**
 * Suma los valores de las fases de emisiones.
 */
export const calcularTotalEmisiones = (impactResults) => {
    // 1. Accedemos al array que se ve en tu captura (emissionsByPhase.values)
    const listaFases = impactResults?.emissionsByPhase?.values;

    if (!listaFases || !Array.isArray(listaFases)) {
        return "0.00";
    }

    // 2. Sumamos los 'value' de ese array
    const suma = listaFases.reduce((acc, item) => acc + item.value, 0);
    
    return suma.toFixed(2);
};