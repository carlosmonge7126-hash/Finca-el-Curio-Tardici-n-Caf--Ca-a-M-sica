// archivo: API/test.js
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as hora_actual');
    await client.end();
    
    res.status(200).json({ 
      mensaje: '✅ Conexión exitosa a Neon', 
      hora: result.rows[0].hora_actual 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '❌ Error de conexión: ' + error.message });
  }
};
