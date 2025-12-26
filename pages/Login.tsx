
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
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '?reset=true',
      });
      if (error) {
        setStatusMsg({ type: 'error', text: error.message });
      } else {
        setStatusMsg({ type: 'success', text: "Link de recuperação enviado para seu e-mail!" });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Erro inesperado. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'forgot') {
      handleForgotPassword(e);
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    
    try {
      if (view === 'register') {
        if (cpf.length < 14 || name.split(' ').length < 2) {
          alert("Por favor, preencha seu nome completo e um CPF válido.");
          setLoading(false);
          return;
        }

        const role = inviteCode.toUpperCase() === 'ADMIN2024' ? 'admin' : 'user';
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, cpf, role },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          alert(error.message);
        } else {
          onNavigateToConfirm(email);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Tratamento de erro específico para credenciais inválidas vs erros de sistema
          const msg = error.message === "Invalid login credentials" 
            ? "E-mail ou senha incorretos." 
            : error.message || "Erro ao conectar.";
          alert(`Falha no login: ${msg}`);
        } else if (data.user) {
          // Notifica o componente pai do sucesso
          onLogin(data.user);
        }
      }
    } catch (error: any) {
      console.error("Erro crítico no login:", error);
      alert("Ocorreu um erro inesperado. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="bg-white w-full max-w-md rounded-[3rem] border border-slate-100 shadow-2xl p-8 md:p-10 relative overflow-hidden animate-in zoom-in duration-300">
        
        {view === 'register' && (
          <div className="mb-8 bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top duration-500">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1 italic">Segurança de Acesso</p>
              <p className="text-[9px] text-blue-700 font-medium leading-tight">Utilize o código de convite para definir seu nível de acesso.</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-emerald-200 mx-auto mb-6">
            $
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic uppercase">
            {view === 'register' ? 'NOVO CADASTRO' : view === 'forgot' ? 'RECUPERAR' : 'ÁREA DE ACESSO'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {view === 'register' ? 'Crie sua identidade na plataforma.' : view === 'forgot' ? 'Enviaremos um link para seu e-mail.' : 'Entre para gerenciar seus sorteios.'}
          </p>
        </div>

        {statusMsg && (
          <div className={`mb-6 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 italic">Nome Completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome e Sobrenome" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 italic">CPF</label>
                <input type="text" value={cpf} onChange={handleCpfChange} placeholder="000.000.000-00" maxLength={14} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-mono font-bold text-slate-700" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 ml-2 italic">Código de Convite</label>
                <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Ex: ADMIN2024" className="w-full bg-emerald-50 border border-emerald-100 px-6 py-4 rounded-2xl font-bold text-emerald-700 placeholder:text-emerald-300 outline-none focus:border-emerald-500" />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 italic">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" required />
          </div>
          
          {view !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 italic">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" required />
            </div>
          )}

          <button disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white py-5 rounded-2xl font-black text-lg hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all shadow-xl mt-6 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'PROCESSANDO...' : view === 'register' ? 'FINALIZAR CADASTRO' : view === 'forgot' ? 'ENVIAR LINK' : 'ENTRAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          {view === 'login' && (
            <button type="button" onClick={() => setView('forgot')} className="block w-full text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600">Esqueci minha senha</button>
          )}
          
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
