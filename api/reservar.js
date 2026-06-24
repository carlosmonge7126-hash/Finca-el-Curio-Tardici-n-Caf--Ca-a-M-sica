// archivo: api/reservar.js
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  // Permitir CORS (para que tu HTML pueda llamar a la API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
  
  
  // Si es una solicitud OPTIONS (preflight), responder exitosamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Si es POST, insertamos datos; si es GET, consultamos
    if (req.method === 'POST') {
      const { nombre, mensaje } = req.body || {};
      const result = await client.query(
        'INSERT INTO visitas (nombre_visitante, mensaje) VALUES ($1, $2) RETURNING *',
        [nombre || 'Anónimo', mensaje || 'Sin mensaje']
      );
      await client.end();
      return res.status(200).json({ 
        success: true, 
        data: result.rows[0],
        mensaje: '✅ Datos guardados correctamente'
      });
    } else {
      // GET - Consultar datos
      const result = await client.query('SELECT * FROM visitas ORDER BY fecha DESC LIMIT 10');
      await client.end();
      return res.status(200).json({ 
        success: true, 
        data: result.rows,
        mensaje: '✅ Conexión exitosa a Neon'
      });
    }
  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({ 
      success: false, 
      error: '❌ Error de conexión: ' + error.message 
    });
  }
};
