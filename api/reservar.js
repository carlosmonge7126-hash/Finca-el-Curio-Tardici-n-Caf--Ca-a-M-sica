import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Solo permitimos peticiones POST (envío de datos)
  if (request.method === 'POST') {
    const { nombre, email, telefono, fecha, tour } = request.body;

    try {
      // 1. Crear la tabla si no existe (con nombres de columna que Neon entiende)
      await sql`CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        email TEXT,
        telefono TEXT,
        fecha TEXT,
        tour TEXT,
        creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`;

      // 2. Insertar los datos de la reserva
      await sql`INSERT INTO reservas (nombre, email, telefono, fecha, tour) 
                VALUES (${nombre}, ${email}, ${telefono}, ${fecha}, ${tour});`;

      return response.status(200).json({ mensaje: "¡Reserva guardada con éxito!" });

    } catch (error) {
      // Si hay un error de conexión o de base de datos
      return response.status(500).json({ error: error.message });
    }
  } else {
    // Si alguien intenta entrar a la URL directamente desde el navegador
    response.status(405).send('Método no permitido');
  }
}
