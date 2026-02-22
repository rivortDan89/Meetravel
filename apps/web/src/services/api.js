const API = import.meta.env.VITE_API_URL;

// Punto único de acceso a la API desde el frontend.
// Centralizamos aquí los fetch para no repartir URLs y mensajes de error por componentes.
export async function getHealth() {
  const res = await fetch(`${API}/health`);
  if (!res.ok) throw new Error("API no responde");
  return res.json();
}

export async function getPlaces() {
  // Endpoint principal del mapa/listado.
  // En el desarrollo lo usamos mucho para validar integración React ↔ Express ↔ MySQL.
  const res = await fetch(`${API}/api/places`);
  if (!res.ok) throw new Error("Error al obtener lugares");
  return res.json();
}