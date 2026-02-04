const API = import.meta.env.VITE_API_URL; 

export async function getHealth() {
  const res = await fetch(`${API}/health`);
  if (!res.ok) throw new Error("API no responde");
  return res.json();
}

export async function getPlaces() {
  const res = await fetch(`${API}/api/places`);
  if (!res.ok) throw new Error("Error al obtener lugares");
  return res.json();
}
