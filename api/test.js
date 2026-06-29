import { createClient } from '@supabase/supabase-js';

// Vercel tomará automáticamente estas variables desde tu configuración de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Realiza la consulta a Supabase
  const { data, error } = await supabase.from('nombre_de_tu_tabla').select('*').limit(1);

  // Si hay un error en la conexión o en las credenciales
  if (error) {
    return res.status(500).json({ 
      conectado: false, 
      mensaje: '❌ Error al conectar con Supabase', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Si la conexión fue exitosa
  return res.status(200).json({ 
    conectado: true, 
    mensaje: '✅ ¡Conexión exitosa a Supabase y API funcionando!', 
    version: "1.0.0",
    datos: data,
    timestamp: new Date().toISOString()
  });
}
