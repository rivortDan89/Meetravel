
import dotenv from "dotenv";
import { pool } from "../config/db.js";
import fetch from "node-fetch";

dotenv.config({ path: new URL("../../.env", import.meta.url) });

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function getPhotoUrl(photoReference) {
  if (!photoReference || !API_KEY) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
}

async function main() {
  if (!API_KEY) {
    console.error("Falta GOOGLE_PLACES_API_KEY en el .env");
    process.exit(1);
  }

  const [lugares] = await pool.query(
    "SELECT id_lugar, google_place_id FROM lugar WHERE google_place_id IS NOT NULL AND foto_url IS NULL"
  );

  console.log(`Lugares sin foto: ${lugares.length}`);

  for (const lugar of lugares) {
    const { id_lugar, google_place_id } = lugar;
    try {
      // 1) Pedir detalles del lugar (incluyendo photos)
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${google_place_id}&fields=photos&key=${API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.status !== "OK" || !data.result?.photos?.length) {
        console.log(
          `Sin fotos para id_lugar=${id_lugar}, status=${data.status}`
        );
        continue;
      }

      const photoRef = data.result.photos[0].photo_reference;
      const fotoUrl = getPhotoUrl(photoRef);

      if (!fotoUrl) {
        console.log(`No se pudo construir fotoUrl para id_lugar=${id_lugar}`);
        continue;
      }

      // 2) Guardar la URL en la BD
      await pool.query(
        "UPDATE lugar SET foto_url = ? WHERE id_lugar = ?",
        [fotoUrl, id_lugar]
      );

      console.log(`Actualizado id_lugar=${id_lugar} con foto_url`);
    } catch (err) {
      console.error(`Error con id_lugar=${id_lugar}:`, err.message);
    }
  }

  console.log("Terminado.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Error general:", e);
  process.exit(1);
});
