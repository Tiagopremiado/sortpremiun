
import React, { useEffect, useState } from 'react';
import { Raffle } from '../types';

interface GlobalWinnerToastProps {
  raffle: Raffle;
  onClose: () => void;
}

const GlobalWinnerToast: React.FC<GlobalWinnerToastProps> = ({ raffle, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [timeAgo, setTimeAgo] = useState('agora mesmo');

  useEffect(() => {
    // Pequeno delay para entrada suave
    const entryTimer = setTimeout(() => setVisible(true), 100);
    
    // Auto-fechar após 8 segundos
    const closeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 8500);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 left-6 md:left-auto md:right-8 z-[200] transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>
      <div className="glass-dark bg-slate-900/95 border border-white/10 backdrop-blur-xl p-3 pr-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4">
        
        {/* Thumbnail do Prêmio */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/50">
            <img src={raffle.prizeImage} alt={raffle.title} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Conteúdo Informativo */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">NOVO GANHADOR!</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">• {timeAgo}</span>
          </div>
          <h4 className="text-white text-xs font-black line-clamp-1 mb-0.5">{raffle.title}</h4>
          <p className="text-[10px] text-slate-400 font-medium">
            <span className="text-white font-bold">{raffle.winnerName || 'Sorteio Finalizado'}</span> ganhou com a cota <span className="text-emerald-400 font-bold">#{raffle.winnerTicket?.toString().padStart(5, '0')}</span>
          </p>
        </div>

        {/* Botão Fechar */}
        <button 
          onClick={() => setVisible(false)}
          className="absolute top-2 right-4 text-slate-600 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Glow Effect Background */}
      <div className="absolute -inset-1 bg-emerald-500/20 rounded-[2.6rem] blur-xl -z-10 animate-pulse" />
    </div>
  );
};

export default GlobalWinnerToast;