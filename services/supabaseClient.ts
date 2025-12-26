import { createClient } from '@supabase/supabase-js';

// No Vite, variáveis de ambiente devem começar com VITE_
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Configuração do Supabase ausente! Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao seu arquivo .env ou variáveis de ambiente do servidor.");
}

// Inicializa o cliente. Caso as chaves não existam, o sistema tentará usar os placeholders para não quebrar o build, 
// mas as requisições falharão até que as chaves reais sejam inseridas.
export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co', 
  supabaseAnonKey || 'your-anon-key'
);