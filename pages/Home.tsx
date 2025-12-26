import React, { useState, useEffect } from 'react';
import RaffleCard from '../components/RaffleCard';
import { Raffle } from '../types';

interface HomeProps {
  raffles: Raffle[];
  onRaffleClick: (id: string) => void;
  onJoinYearEndAction: () => void;
  isParticipating?: boolean;
  userTicket?: string;
  tickerMessages?: string[];
  siteConfig?: any;
}

const Home: React.FC<HomeProps> = ({ raffles, onRaffleClick, onJoinYearEndAction, isParticipating, userTicket, tickerMessages = [], siteConfig }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const targetDateStr = siteConfig?.yearEndTargetDate || '2024-12-31T23:59:59';
  const yearEndTitle = siteConfig?.yearEndTitle || "SORTEIO DA";
  const yearEndSubtitle = siteConfig?.yearEndSubtitle || "VIRADA 2024";
  const yearEndDesc = siteConfig?.yearEndDescription || "Estamos encerrando o ano com chave de ouro! Cadastre-se gratuitamente na nossa ação especial e concorra ao prêmio principal.";
  const bannerUrl = siteConfig?.yearEndBannerUrl || "";

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return (
    <div className="overflow-hidden">
      {/* Ticker de Fim de Ano */}
      <div className="bg-red-600 py-3 text-white overflow-hidden relative border-b-2 border-amber-400 z-20">
         <div className="whitespace-nowrap flex animate-[ticker_25s_linear_infinite]">
            {[1, 2, 3, 4, 5].map(loop => (
              <div key={loop} className="flex items-center">
                {tickerMessages.length > 0 ? (
                  tickerMessages.map((msg, i) => (
                    <p key={i} className="mx-8 font-black text-[10px] uppercase tracking-[0.3em] italic">
                      ❄️ {msg} ❄️
                    </p>
                  ))
                ) : (
                  <p className="mx-8 font-black text-[10px] uppercase tracking-[0.3em] italic">
                    ❄️ AÇÃO DE NATAL: GANHE BÔNUS EM DOBRO NO PRIMEIRO DEPÓSITO ❄️ SORTEIO FEDERAL GARANTIDO ❄️
                  </p>
                )}
              </div>
            ))}
         </div>
      </div>

      {/* SUPER SECTION: SORTEIO DA VIRADA (AÇÃO DE FIM DE ANO) */}
      <section 
        className="relative pt-32 pb-40 overflow-hidden border-b border-amber-500/20"
        style={{ 
          backgroundColor: bannerUrl ? 'transparent' : '#020617',
          backgroundImage: bannerUrl ? `linear-gradient(rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url(${bannerUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-40">
           {/* Efeito de Neve Dourada */}
           {Array.from({ length: 20 }).map((_, i) => (
             <div 
               key={i} 
               className="absolute bg-amber-400 rounded-full animate-pulse" 
               style={{
                 width: Math.random() * 4 + 'px',
                 height: Math.random() * 4 + 'px',
                 top: Math.random() * 100 + '%',
                 left: Math.random() * 100 + '%',
                 animationDuration: (Math.random() * 3 + 2) + 's',
                 opacity: Math.random()
               }}
             />
           ))}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(217,176,77,0.15)_0%,_transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 animate-bounce">
            🎉 AÇÃO ESPECIAL DE FINAL DE ANO 🎉
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            {yearEndTitle} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 uppercase italic">{yearEndSubtitle}</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
            {yearEndDesc}
          </p>

          {/* TIMER REGRESSIVO */}
          <div className="flex justify-center gap-4 md:gap-8 mb-16">
            {[
              { val: timeLeft.days, label: 'DIAS' },
              { val: timeLeft.hours, label: 'HORAS' },
              { val: timeLeft.minutes, label: 'MINUTOS' },
              { val: timeLeft.seconds, label: 'SEGUNDOS' }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-white/5 border border-white/10 w-20 h-24 md:w-28 md:h-32 rounded-3xl flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-[0_0_40px_rgba(245,158,11,0.1)] backdrop-blur-xl">
                  {unit.val.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] font-black text-amber-500 mt-4 tracking-widest">{unit.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-8">
            {isParticipating ? (
              <div className="bg-emerald-600/20 border border-emerald-500/50 p-8 rounded-[3rem] animate-in zoom-in duration-500 max-w-xl mx-auto backdrop-blur-md">
                <div className="text-5xl mb-4">🎫</div>
                <p className="text-emerald-400 font-black text-xl uppercase italic mb-2 tracking-tighter">VOCÊ JÁ ESTÁ DENTRO!</p>
                <div className="bg-slate-950/50 rounded-2xl p-4 my-4 border border-white/10">
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Seu Número da Sorte</p>
                   <p className="text-4xl font-mono font-black text-white tracking-[0.2em]">{userTicket || '----'}</p>
                </div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">O sorteio ocorrerá dia 31/12 via Loteria Federal.</p>
              </div>
            ) : (
              <button 
                onClick={onJoinYearEndAction}
                className="group relative bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 px-16 py-8 rounded-[2.5rem] font-black text-2xl hover:scale-105 transition-all shadow-[0_0_80px_rgba(245,158,11,0.4)] active:scale-95 uppercase tracking-tighter overflow-hidden"
              >
                <span className="relative z-10">CADASTRAR NESTA AÇÃO GRATUITAMENTE</span>
                <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
              </button>
            )}
            
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
              MAIS DE 154.200 PESSOAS JÁ SE CADASTRARAM
            </p>
          </div>
        </div>
      </section>

      {/* Outros Sorteios */}
      <section id="sorteios" className="max-w-7xl mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-4 block italic">Oportunidades de Fim de Ano</span>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase italic">Escolha sua Sorte</h2>
          <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {raffles.map(raffle => (
            <RaffleCard key={raffle.id} raffle={raffle} onClick={onRaffleClick} />
          ))}
        </div>
      </section>

      {/* Footer Profissional */}
      <footer className="bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
              $
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-800 uppercase">SORTEIO<span className="text-emerald-600">FÁCIL</span></span>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">
            &copy; 2024 - ESTÂNCIA DA SORTE - AÇÃO DA VIRADA
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

export default Home;