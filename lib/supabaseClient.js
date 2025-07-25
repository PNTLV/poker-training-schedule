import { createClient } from '@supabase/supabase-js'

// Проверяем наличие переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ОШИБКА: Переменные окружения Supabase не установлены!')
  console.error('URL:', supabaseUrl ? '✅ установлен' : '❌ НЕ УСТАНОВЛЕН')
  console.error('Key:', supabaseAnonKey ? '✅ установлен' : '❌ НЕ УСТАНОВЛЕН')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
