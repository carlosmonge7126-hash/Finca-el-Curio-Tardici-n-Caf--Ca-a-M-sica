import { createClient } from '@supabase/supabase-js';

// Usamos las variables directas del sistema de Vercel y la clave Service Role para el backend
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ exito: false, error: 'Método no permitido' });
  }

  const { nombre, email, telefono, fecha, tour } = req.body;

  // Validación básica en el servidor
  if (!nombre || !email || !fecha || !tour || tour.trim() === "") {
    return res.status(400).json({ exito: false, error: 'Por favor, rellene todos los campos obligatorios.' });
  }

  try {
    // Insertamos los datos haciendo coincidir exactamente las columnas que creamos en tu SQL de Supabase
    const { data, error } = await supabase
      .from('reservas')
      .insert([
        { 
          nombre_completo: nombre, 
          correo: email, 
          telefono: telefono, 
          fecha_deseada: fecha, 
          tour_seleccionado: tour 
        }
      ])
      .select();

    if (error) throw error;
    
    return res.status(200).json({ exito: true, mensaje: '¡Reserva confirmada con éxito!', reserva: data });
  } catch (error) {
    console.error("❌ Error interno del servidor en Supabase:", error.message);
    return res.status(500).json({ exito: false, error: error.message });
  }
}
