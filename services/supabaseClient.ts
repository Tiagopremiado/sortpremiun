
import { createClient } from '@supabase/supabase-js';

// No Vite, variáveis de ambiente devem começar com VITE_
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseAnonKey;

if (!isConfigured) {
  console.warn("⚠️ Configuração do Supabase ausente ou inválida! O sistema funcionará em modo offline/mock até que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY sejam configurados corretamente.");
}

// Inicializa o cliente apenas se estiver configurado, ou usa uma URL que falhe rápido
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://invalid-project.supabase.co', 
  isConfigured ? supabaseAnonKey : 'invalid-key'
);
