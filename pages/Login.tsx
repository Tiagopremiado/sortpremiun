
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LoginProps {
  onLogin: (user: any) => void;
  onBack: () => void;
  onNavigateToConfirm: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, onNavigateToConfirm }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    
    try {
      if (view === 'register') {
        const role = inviteCode.toUpperCase() === 'ADMIN2024' ? 'admin' : 'user';
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, cpf, role },
          },
        });

        if (error) {
          alert("Erro no cadastro: " + error.message);
        } else {
          alert("Cadastro solicitado! Se você não for logado automaticamente, verifique seu e-mail.");
          // O Supabase às vezes loga direto no signup dependendo da config. 
          // Se não logar, mudamos para a vista de login.
          if (!data.session) setView('login');
        }
      } else if (view === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          // Erro comum de credenciais ou e-mail não confirmado
          const msg = error.message === "Invalid login credentials" 
            ? "E-mail ou senha incorretos." 
            : error.message;
          alert("Falha no acesso: " + msg);
        } else if (data.user) {
          onLogin(data.user);
        }
      }
    } catch (err) {
      alert("Erro de conexão com o servidor. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white w-full max-w-md rounded-[3rem] border border-slate-100 shadow-2xl p-10 animate-in zoom-in duration-300">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-6">
            $
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic uppercase">
            {view === 'register' ? 'NOVO CADASTRO' : 'ÁREA DE ACESSO'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {view === 'register' ? 'Crie sua conta na estância.' : 'Entre para gerenciar seus sorteios.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700" required />
              <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Seu CPF" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700" required />
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Código Convite (Opcional)" className="w-full bg-emerald-50 border border-emerald-100 px-6 py-4 rounded-2xl font-bold text-emerald-700 outline-none focus:border-emerald-500" />
            </>
          )}
          
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua Senha" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700" required />

          <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl uppercase tracking-widest disabled:opacity-50">
            {loading ? 'CARREGANDO...' : view === 'register' ? 'CRIAR MINHA CONTA' : 'ENTRAR AGORA'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button type="button" onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-slate-400 text-xs font-black uppercase tracking-widest hover:text-emerald-600">
            {view === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
          </button>
          <div className="pt-6 border-t border-slate-50">
             <button type="button" onClick={onBack} className="text-[10px] text-slate-300 font-black uppercase tracking-widest hover:text-slate-400">Voltar ao início</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
