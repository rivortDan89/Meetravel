//Preferencias de accesibilidad del usuario
const etiquetasRequeridasUsuario = ["rampa", "baño adaptado", "ascensor"];

//Reseñas internas con etiquetas de accesibilidad
const reseniasAccesibilidad = [
    { idLugar: 1, etiquetas: ["rampa", "ascensor"] },
    { idLugar: 2, etiquetas: ["escaleras"] },
    { idLugar: 3, etiquetas: ["baño adaptado", "rampa"] },
    { idLugar: 4, etiquetas: ["escaleras", "sin ascensor"] }
];

//Lugares registrados en el sistema
const lugaresRegistrados = [
    { id: 1, nombre: "Biblioteca Central" },
    { id: 2, nombre: "Café Lab" },
    { id: 3, nombre: "Ayuntamiento" },
    { id: 4, nombre: "Restaurante Magoga" }
];

//Obtener etiquetas de accesibilidad de un lugar según reseás internas.
function obtenerEtiquetasDeLugar(idLugar) {
    const resenia = reseniasAccesibilidad.find(r => r.idLugar == idLugar);
    return reseña ? resenia.etiquetas : [];
}

//Verificar si un lugar cumple con todas las necesidades del usuario.
function esLugarAccesible(etiqLugar, etqUsuario) {
    return etiqUsuario.every(etiqueta => etiqLugar.includes(etiqueta));
}

//Simulacion de consulta a API externa.
async function octenerLugaresCecanos() {
    return [
        { id: "ext1", nombre: "Parque de los patos" },
        { id: "ext2", nombre: "Museo Romano" },
        { id: "ext3", nombre: "Pabellon Municipal" }
    ];
}


//Filtra lugares externos usando las reseñas internas
function filtrarLugaresExternosAccesibles(lugaresExternos, etiqUsuario) {
    return lugaresExternos.filter(lugarExterno => {
        const reseña = reseñasAccesibilidad.find(r => r.idLugar == lugarExterno.id);
        if (!reseña) return false;
        return esLugarAccesible(reseña.etiquetas, etiqUsuario)
    });

}

//Lógica principal de recomendación

async function obtenerRecomendacionAccesible(idLugar) {
    const lugarSeleccionado = lugarSeleccionado.find(l => l.id == idLugar);
    if (!lugarSeleccionado) {
        return { error: "Lugar no encontrado." };
    }
}