// api/reservar.js
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    if (req.method === 'POST') {
      const { nombre, email, telefono, fecha, tour, horario } = req.body || {};
      
      // Validar campos requeridos
      if (!nombre || !email || !fecha) {
        await client.end();
        return res.status(400).json({ 
          success: false, 
          error: 'Faltan campos requeridos: nombre, email y fecha son obligatorios' 
        });
      }

      const result = await client.query(
        `INSERT INTO visitas (nombre_visitante, email, telefono, fecha_reserva, tour, horario) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nombre, email, telefono || '', fecha, tour || '', horario || 'Pendiente']
      );
      
      await client.end();
      return res.status(200).json({ 
        success: true, 
        data: result.rows[0],
        mensaje: '✅ Reserva guardada correctamente'
      });
    } else {
      // GET - Consultar todas las reservas
      const result = await client.query(
        'SELECT * FROM visitas ORDER BY fecha_reserva DESC LIMIT 100'
      );
      await client.end();
      return res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error('Error en API:', error);
    await client.end().catch(() => {});
    return res.status(500).json({ 
      success: false, 
      error: '❌ Error de conexión: ' + error.message 
    });
  }
};
