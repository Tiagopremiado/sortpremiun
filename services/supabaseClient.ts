
import { createClient } from '@supabase/supabase-js';

// No Vite, variáveis de ambiente são acessadas via import.meta.env
// Em produção (Vercel), certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (process.env as any).VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (process.env as any).VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("AVISO: Variáveis de ambiente do Supabase não encontradas. O sistema funcionará em modo demonstração com dados locais.");
}

// Inicializa com strings vazias se necessário para evitar erro de construtor URL, mas o App tratará a falta de dados.
export const supabase = createClient(supabaseUrl || 'https://placeholder-url.supabase.co', supabaseAnonKey || 'placeholder-key');