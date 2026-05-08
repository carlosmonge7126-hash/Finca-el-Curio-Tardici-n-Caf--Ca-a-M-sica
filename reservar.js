import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Solo permitimos el método POST (envío de datos)
  if (request.method === 'POST') {
    const { nombre, email, telefono, fecha, tour } = request.body;

    try {
      // 1. Crear la tabla con el formato correcto que entiende Neon
      await sql`CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        nombre TEXT,
        email TEXT,
        telefono TEXT,
        fecha TEXT,
        tour TEXT,
        creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`;

      // 2. Insertar los datos en la tabla
      await sql`INSERT INTO reservas (nombre, email, telefono, fecha, tour) 
                VALUES (${nombre}, ${email}, ${telefono}, ${fecha}, ${tour});`;

      return response.status(200).json({ mensaje: "¡Reserva guardada con éxito en la base de datos!" });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  } else {
    // Si alguien intenta entrar por la URL sin enviar datos
    response.status(405).send('Método no permitido');
  }
}
