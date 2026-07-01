// ✅ CAMBIO CRÍTICO: Usamos require en lugar de import para que Vercel no falle
const { createClient } = require('@supabase/supabase-js');

// Inicialización limpia usando las variables de entorno nativas de Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar cabeceras de respuesta JSON obligatorias
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ exito: false, error: 'Método no permitido' });
  }

  const { nombre, email, telefono, fecha, tour } = req.body;

  // Validación básica del servidor
  if (!nombre || !email || !fecha || !tour) {
    return res.status(400).json({ exito: false, error: 'Faltan campos obligatorios en el formulario.' });
  }

  try {
    // Sincronización directa con los nombres de las columnas que creamos en tu Supabase
    const { data, error } = await supabase
      .from('reservas')
      .insert([
        { 
          nombre: nombre, 
          email: email, 
          telefono: telefono, 
          fecha: fecha, 
          tour: tour 
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ exito: false, error: error.message });
    }
    
    return res.status(200).json({ exito: true, mensaje: '¡Reserva confirmada con éxito!', reserva: data });
  } catch (error) {
    return res.status(500).json({ exito: false, error: error.message || 'Error interno del servidor backend' });
  }
}
