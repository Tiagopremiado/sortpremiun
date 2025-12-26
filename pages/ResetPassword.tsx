
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface ResetPasswordProps {
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Senha atualizada com sucesso! Você já pode entrar." });
      setTimeout(onBack, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="bg-white w-full max-w-md rounded-[3rem] border border-slate-100 shadow-2xl p-8 md:p-10 relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg mx-auto mb-6">
            🔒
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic uppercase">Nova Senha</h1>
          <p className="text-slate-500 text-sm font-medium">Crie uma senha forte para sua segurança.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 italic">Nova Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" 
              required 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 italic">Confirmar Senha</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700" 
              required 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 mt-6 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? 'ATUALIZANDO...' : 'REDEFINIR SENHA'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={onBack} className="text-[10px] text-slate-300 font-black uppercase tracking-widest hover:text-slate-400">Voltar ao login</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;