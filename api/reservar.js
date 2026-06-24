import { sql } from '@vercel/postgres';

export default async function handler(req, res) {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {

    // =========================
    // OBTENER RESERVAS
    // =========================
    if (req.method === 'GET') {

      const { rows } = await sql`
        SELECT
          id,
          nombre,
          email,
          telefono,
          tour,
          fecha_reserva,
          fecha_creacion
        FROM reservas
        ORDER BY fecha_creacion DESC;
      `;

      return res.status(200).json(rows);
    }

    // =========================
    // GUARDAR RESERVA
    // =========================
    if (req.method === 'POST') {

      const body =
        typeof req.body === 'string'
          ? JSON.parse(req.body)
          : req.body;

      const {
        nombre,
        email,
        telefono,
        fecha,
        tour
      } = body;

      if (!nombre || !email || !fecha) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Faltan datos obligatorios'
        });
      }

      const resultado = await sql`
        INSERT INTO reservas (
          nombre,
          email,
          telefono,
          tour,
          fecha_reserva,
          fecha_creacion
        )
        VALUES (
          ${nombre},
          ${email},
          ${telefono || ''},
          ${tour || ''},
          ${fecha},
          NOW()
        )
        RETURNING *;
      `;

      return res.status(200).json({
        ok: true,
        mensaje: 'Reserva guardada correctamente',
        reserva: resultado.rows[0]
      });
    }

    return res.status(405).json({
      ok: false,
      mensaje: 'Método no permitido'
    });

  } catch (error) {

    console.error('ERROR API RESERVAS:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    });
  }
}
