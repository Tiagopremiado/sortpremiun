import React, { useEffect } from 'react';

interface WinnerCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  ticketNumber?: string;
}

const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({ isOpen, onClose, title, message, ticketNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl animate-in zoom-in duration-500">
        {/* Elementos decorativos animados */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className={`absolute w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                style={{ 
                  top: Math.random() * 100 + '%', 
                  left: Math.random() * 100 + '%', 
                  animation: `bounce ${1 + Math.random()}s infinite`
                }} 
              />
           ))}
        </div>

        <div className="relative z-10">
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter leading-none">{title}</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed px-4">{message}</p>
          
          {ticketNumber && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl mb-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500 rounded-full blur-2xl opacity-20 -mr-10 -mt-10" />
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Seu Número da Sorte</p>
              <p className="text-5xl font-black tracking-widest font-mono group-hover:scale-110 transition-transform">{ticketNumber}</p>
            </div>
          )}

          <button 
            onClick={onClose} 
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            Show de Bola!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default WinnerCelebration;