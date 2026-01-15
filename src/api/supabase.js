import { createClient } from '@supabase/supabase-js'

// Obtener las credenciales de las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validar que las variables estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
  console.error('Por favor, configura estas variables en Vercel:')
  console.error('- VITE_SUPABASE_URL')
  console.error('- VITE_SUPABASE_ANON_KEY')
} else {
  console.log('✅ Variables de entorno cargadas correctamente')
  console.log('URL:', supabaseUrl.substring(0, 30) + '...')
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
}

// Validar que las variables no estén vacías antes de crear el cliente
let supabaseClient = null

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '' || supabaseAnonKey === '') {
  console.error('❌ ERROR CRÍTICO: Variables de entorno de Supabase no configuradas')
  console.error('Por favor, configura en Vercel:')
  console.error('- VITE_SUPABASE_URL')
  console.error('- VITE_SUPABASE_ANON_KEY')
  
  // Crear un cliente "dummy" para evitar errores, pero mostrará errores en las llamadas
  supabaseClient = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
  
  // Mostrar error en la UI después de que la app se monte
  setTimeout(() => {
    const errorDiv = document.getElementById('loading-error')
    if (errorDiv) {
      errorDiv.classList.add('show')
      const errorBox = errorDiv.querySelector('.error-box p')
      if (errorBox) {
        errorBox.innerHTML = `
          <strong>Configuración de Supabase incompleta</strong><br><br>
          Por favor, verifica las variables de entorno en Vercel:<br>
          <code>VITE_SUPABASE_URL</code><br>
          <code>VITE_SUPABASE_ANON_KEY</code>
        `
      }
    }
  }, 1000)
} else {
  // Crear cliente de Supabase con las credenciales correctas
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'supabase-js-v2',
      },
    },
  })
}

export const supabase = supabaseClient
