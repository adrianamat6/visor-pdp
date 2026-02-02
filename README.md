# Visualizador de Pasaporte Digital de Producto (DPP) - Proyecto TRACA

Este repositorio contiene el visualizador frontend desarrollado para el proyecto enfocado en la implementación del Pasaporte Digital de Producto en el sector calzado.

## 🚀 Propósito
El objetivo de este visualizador es actuar como capa intermedia (middleware) entre la API técnica gestionada por el ITI/INESCOP y el consumidor final. Transforma los datos crudos (JSON) en una interfaz amigable, cumpliendo con los requisitos de transparencia y diseño de marcas como **Pikolinos**.

## 🛠️ Funcionamiento Técnico
1. **Identificación**: El sistema recibe un identificador único (vía `modelId` o `DID`) a través de la URL.
2. **Consumo de API**: Se realiza una petición asíncrona a `https://passport-traca.iti.es/` para recuperar los datos de impacto ambiental (huella de carbono), durabilidad y trazabilidad.
3. **Visualización**: Los datos se procesan y se muestran dinámicamente utilizando HTML5, CSS3 y JavaScript puro.

## 📊 Datos mostrados
- **Huella de Carbono**: Cálculo total de emisiones por fase de ciclo de vida (LCS1-LCS5).
- **Durabilidad**: Índice de resistencia testado por INESCOP.
- **Trazabilidad**: Información de origen (China) y destino (Madrid) verificada.
- **Blockchain**: Identificador descentralizado (DID) para garantizar la inmutabilidad de los datos.


