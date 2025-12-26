
import React, { useEffect, useState } from 'react';
import { Raffle } from '../types';

interface WinnerCelebrationProps {
  raffle: Raffle;
  ticketNumber: number;
  onClose: () => void;
}

const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({ raffle, ticketNumber, onClose }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setTimeout(() => setActive(true), 100);
  }, []);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      {/* Background Particles/Confetti Simulation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#10b981', '#fbbf24', '#ffffff', '#3b82f6'][i % 4],
              opacity: 0.6,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className={`relative w-full max-w-2xl bg-white rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.4)] border border-emerald-500/30 transition-all duration-1000 transform ${active ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-12'}`}>
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 h-3" />
        
        <div className="p-10 md:p-16 text-center">
          <div className="relative inline-block mb-10">
            <div className="w-28 h-28 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-inner animate-pulse">
              🏆
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-full shadow-lg border-4 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase">
            PARABÉNS!
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-12">Você é o grande vencedor deste sorteio</p>

          <div className="bg-slate-50 rounded-[3.5rem] p-8 mb-12 border border-slate-100 flex flex-col md:flex-row items-center gap-8 text-left group">
            <div className="w-44 h-44 rounded-3xl overflow-hidden shadow-2xl transition-transform group-hover:rotate-2 group-hover:scale-105 duration-500">
              <img src={raffle.prizeImage} alt={raffle.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest block mb-1">Prêmio Conquistado</span>
              <h3 className="text-2xl font-black text-slate-800 leading-tight mb-4">{raffle.title}</h3>
              <div className="inline-flex flex-col bg-slate-900 rounded-2xl px-6 py-3">
                <span className="text-[9px] font-black text-slate-500 uppercase mb-1">Cota Premiada</span>
                <span className="text-3xl font-mono font-black text-emerald-400">{ticketNumber.toString().padStart(5, '0')}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                const msg = encodeURIComponent(`Olá! Sou o ganhador do sorteio "${raffle.title}" com a cota ${ticketNumber}. Gostaria de iniciar o processo de resgate!`);
                window.open(`https://wa.me/5500000000000?text=${msg}`, '_blank');
              }}
              className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95"
            >
              RESGATAR MEU PRÊMIO
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 py-4"
            >
              Ver meus outros títulos
            </button>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-900 py-4 px-10 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Sorteio auditado e baseado na Loteria Federal</p>
        </div>
      </div>
    </div>
  );
};

export default WinnerCelebration;