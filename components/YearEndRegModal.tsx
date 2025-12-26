import React from 'react';

interface YearEndRegModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const YearEndRegModal: React.FC<YearEndRegModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.3)] relative">
        
        {/* Header Festivo */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-12 text-center relative overflow-hidden">
           <div className="relative z-10">
             <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-[0.3em] mb-4 border border-white/20">
               Exclusivo para Membros
             </div>
             <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2 drop-shadow-lg">Sorteio da Virada</h2>
             <p className="text-amber-100 text-xs font-bold uppercase tracking-widest opacity-90">Edição Especial 2024</p>
           </div>
           
           {/* Particles Background */}
           <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-[60px]" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-amber-200 rounded-full blur-[60px]" />
           </div>
        </div>

        <div className="p-8 md:p-12 text-center">
          <p className="text-slate-600 font-medium text-lg mb-10 leading-relaxed">
            Confirme sua participação gratuita e concorra ao grande prêmio de <span className="font-black text-slate-900 bg-amber-100 px-2 rounded">R$ 50.000,00</span> que será sorteado no dia 31 de Dezembro.
          </p>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-10 text-left flex items-start gap-5 hover:border-emerald-200 transition-colors">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 shrink-0">🎫</div>
             <div>
                <h4 className="font-black text-slate-900 text-sm uppercase mb-1">Seu Ticket Dourado</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Ao confirmar, o sistema gerará automaticamente seu número da sorte baseado no seu cadastro.</p>
             </div>
          </div>

          <button 
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="relative z-10">{loading ? 'GERANDO TICKET...' : 'GARANTIR MINHA VAGA'}</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
          
          <button onClick={onClose} className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors">
            Prefiro não participar
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearEndRegModal;