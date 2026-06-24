import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Configurar cabeceras CORS por si tu frontend está en otro dominio
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // ─── CASO GET: LEER RESERVAS DE LA BASE DE DATOS ───
  if (request.method === 'GET') {
    try {
      // Modifica el SELECT según las columnas reales de tu tabla
      const { rows } = await sql`
        SELECT nombre, telefono, fecha_reserva 
        FROM reservas 
        ORDER BY fecha_reserva DESC;
      `;
      return response.status(200).json(rows);
    } catch (error) {
      console.error("Error al leer reservas:", error);
      return response.status(500).json({ mensaje: "Error al obtener reservas", error: error.message });
    }
  }

  // ─── CASO POST: GUARDAR RESERVA (Tu código corregido) ───
  if (request.method === 'POST') {
    try {
      const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
      const { nombre, telefono, fecha } = body;

      if (!nombre || !fecha) {
        return response.status(400).json({ mensaje: "Faltan datos obligatorios" });
      }

      await sql`
        INSERT INTO reservas (nombre, telefono, fecha_reserva)
        VALUES (${nombre}, ${telefono}, ${fecha});
      `;

      return response.status(200).json({ mensaje: "¡Reserva guardada con éxito!" });
    } catch (error) {
      console.error("Error API reservas:", error);
      return response.status(500).json({ mensaje: "Error al guardar la reserva", error: error.message });
    }
  }

  return response.status(405).send('Método no permitido');
}
