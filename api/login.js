import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Solo permitir peticiones POST para proteger el envío de contraseñas
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const { email, password } = req.body;

  // Validación básica de campos vacíos
  if (!email || !password) {
    return res.status(400).json({ 
      exito: false, 
      error: 'Por favor, ingresa el correo electrónico y la contraseña.' 
    });
  }

  try {
    // Intentar iniciar sesión usando el sistema de autenticación nativo de Supabase (GoTrue)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    // Si las credenciales son correctas, Supabase devuelve un objeto 'session' con un token JWT
    return res.status(200).json({ 
      exito: true, 
      mensaje: '¡Inicio de sesión exitoso!', 
      usuario: data.user,
      sesion: data.session 
    });

  } catch (error) {
    // Si la contraseña es incorrecta o el usuario no existe
    return res.status(401).json({ 
      exito: false, 
      mensaje: 'Credenciales inválidas. Verifica tu correo y contraseña.', 
      error: error.message 
    });
  }
}
