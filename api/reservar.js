import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { nombre, email, telefono, fecha, tour } = req.body;

  if (!tour || tour.trim() === "") {
    return res.status(400).json({ exito: false, error: 'Por favor, selecciona un tour válido.' });
  }

  try {
    const { data, error } = await supabase
      .from('reservas')
      .insert([{ nombre_completo: nombre, correo: email, telefono, fecha_deseada: fecha, tour_seleccionado: tour }])
      .select();

    if (error) throw error;
    return res.status(200).json({ exito: true, mensaje: '¡Reserva confirmada con éxito!', reserva: data });
  } catch (error) {
    return res.status(500).json({ exito: false, error: error.message });
  }
}
