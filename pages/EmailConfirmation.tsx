
import React from 'react';

interface EmailConfirmationProps {
  email?: string;
  onBack: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ email, onBack }) => {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="bg-white w-full max-w-md rounded-[3rem] border border-slate-100 shadow-2xl p-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
            📧
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase leading-none">Verifique seu <br/> <span className="text-emerald-600">E-mail</span></h1>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            Enviamos um link de confirmação para {email ? <span className="text-slate-900 font-black">{email}</span> : "seu endereço cadastrado"}. <br/> Clique no link para ativar sua sorte na estância!
          </p>
          
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10 text-left">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Dica de mestre</p>
             <p className="text-[10px] text-slate-500 font-bold leading-tight">Não encontrou? Verifique sua caixa de <span className="text-slate-900">Spam</span> ou <span className="text-slate-900">Promoções</span>.</p>
          </div>

          <button 
            onClick={onBack}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl"
          >
            VOLTAR PARA LOGIN
          </button>
        </div>
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
      </div>
    </div>
  );
};

export default EmailConfirmation;