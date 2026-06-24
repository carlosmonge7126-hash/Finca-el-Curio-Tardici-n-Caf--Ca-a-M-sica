import { sql } from '@vercel/postgres';

export default async function handler(request, response) {

  if (request.method !== 'POST') {
    return response.status(405).send('Método no permitido');
  }

  try {
    // 🔥 asegurar parseo del body
    const body = typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body;

    const { nombre, telefono, fecha } = body;

    if (!nombre || !fecha) {
      return response.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    await sql`
      INSERT INTO reservas (nombre, telefono, fecha_reserva)
      VALUES (${nombre}, ${telefono}, ${fecha});
    `;

    return response.status(200).json({
      mensaje: "¡Reserva guardada con éxito!"
    });

  } catch (error) {
    console.error("Error API reservas:", error);

    return response.status(500).json({
      mensaje: "Error al guardar la reserva",
      error: error.message
    });
  }
}
