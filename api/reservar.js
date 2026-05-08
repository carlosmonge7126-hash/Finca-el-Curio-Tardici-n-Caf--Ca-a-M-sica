import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Solo permitimos peticiones POST (envío de datos desde el formulario)
  if (request.method === 'POST') {
    
    // Extraemos los datos que vienen de tu formulario HTML
    const { nombre, telefono, fecha } = request.body;

    try {
      // 1. Insertar los datos en la tabla que ya tienes en Neon
      // Usamos los nombres exactos: nombre, telefono, fecha_reserva
      await sql`INSERT INTO reservas (nombre, telefono, fecha_reserva)
                VALUES (${nombre}, ${telefono}, ${fecha});`;

      // Mensaje de éxito para la web
      return response.status(200).json({ mensaje: "¡Reserva guardada con éxito!" });

    } catch (error) {
      // Si hay un error, lo enviamos para diagnosticarlo
      return response.status(500).json({ error: error.message });
    }

  } else {
    // Si alguien intenta acceder directamente a la URL
    response.status(405).send('Método no permitido');
  }
}
