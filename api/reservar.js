import { createClient } from '@supabase/supabase-js';

// Inicialización usando las variables de entorno nativas de Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Configurar cabeceras para asegurar respuestas en formato JSON limpio
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ exito: false, error: 'Método no permitido' });
  }

  const { nombre, email, telefono, fecha, tour } = req.body;

  // Validación en el servidor para evitar registros vacíos
  if (!nombre || !email || !fecha || !tour) {
    return res.status(400).json({ exito: false, error: 'Faltan campos obligatorios en la petición.' });
  }

  try {
    // IMPORTANTE: Mapeo directo usando las columnas en español de tu tabla original
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
      console.error("❌ Error devuelto por Supabase:", error.message);
      return res.status(400).json({ exito: false, error: error.message });
    }
    
    return res.status(200).json({ exito: true, mensaje: '¡Reserva confirmada con éxito!', reserva: data });
  } catch (error) {
    console.error("❌ Fallo crítico en el bloque Try-Catch:", error.message);
    return res.status(500).json({ exito: false, error: error.message || 'Error interno del servidor backend' });
  }
}
