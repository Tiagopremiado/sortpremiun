
import React, { useState, useEffect } from 'react';

interface Prize {
  id: number;
  label: string;
  color: string;
  type: 'points' | 'pix' | 'discount' | 'tickets' | 'nothing';
  value: number;
  dailyLimit?: number;
  remaining?: number;
}

interface DailyWheelProps {
  onWin: (prize: Prize) => void;
  lastSpinDate?: string;
  customPrizes?: Prize[];
  affiliateCode?: string;
  extraSpinPrice?: number;
  userBalance?: number;
  onBuySpin?: () => void;
  onPurchaseSpin?: () => void;
}

const DailyWheel: React.FC<DailyWheelProps> = ({ 
  onWin, 
  lastSpinDate, 
  customPrizes, 
  affiliateCode,
  extraSpinPrice = 1.50,
  userBalance = 0,
  onBuySpin,
  onPurchaseSpin
}) => {
  const currentPrizes = customPrizes || [];
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [canSpinFree, setCanSpinFree] = useState(false);
  const [hasWon, setHasWon] = useState<Prize | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const checkCanSpin = () => {
      if (!lastSpinDate) {
        setCanSpinFree(true);
        setTimeLeft(null);
        return;
      }
      const last = new Date(lastSpinDate).getTime();
      const now = new Date().getTime();
      const diff = now - last;
      const dayInMs = 24 * 60 * 60 * 1000;

      if (diff >= dayInMs) {
        setCanSpinFree(true);
        setTimeLeft(null);
      } else {
        setCanSpinFree(false);
        const remaining = dayInMs - diff;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    };

    checkCanSpin();
    const interval = setInterval(checkCanSpin, 1000);
    return () => clearInterval(interval);
  }, [lastSpinDate]);

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/?ref=${affiliateCode || ''}`;
    const text = `Ganhe prêmios incríveis no Sorteio Fácil! Participe usando meu link: ${shareUrl}`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else {
       if (navigator.share) {
          navigator.share({ title: 'Sorteio Fácil', text, url: shareUrl }).catch(console.error);
       } else {
          navigator.clipboard.writeText(text);
          alert('Link de convite copiado!');
       }
    }
  };

  const spin = (isTurbo: boolean = false) => {
    if (isSpinning) return;
    
    // Se for Turbo e não for o giro grátis diário
    if (isTurbo && !canSpinFree) {
      if (userBalance < extraSpinPrice) {
        if (onBuySpin) onBuySpin(); // Abre depósito se saldo for baixo
        return;
      }
      
      // Se tiver saldo, processa a compra do giro
      if (onPurchaseSpin) {
        onPurchaseSpin();
      } else {
        return;
      }
    }

    setIsSpinning(true);
    setHasWon(null);
    setShowShareOptions(false);
    
    const validIndices = currentPrizes
      .map((p, i) => (p.remaining === undefined || p.remaining > 0) ? i : -1)
      .filter(i => i !== -1);
    
    const targetPrizeIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    const anglePerSegment = 360 / currentPrizes.length;
    
    const totalSpins = 15 + Math.floor(Math.random() * 8);
    const stopAngle = (currentPrizes.length - targetPrizeIndex) * anglePerSegment;
    const newRotation = rotation + (totalSpins * 360) + (stopAngle - (rotation % 360));
    
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = currentPrizes[targetPrizeIndex];
      setHasWon(prize);
      setTimeout(() => setShowShareOptions(true), 1000);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* AREA DA ROLETA */}
      <div className={`relative w-72 h-72 md:w-96 md:h-96 group transition-all duration-700 ${!canSpinFree ? 'scale-105' : ''}`}>
        
        {/* Marcador Superior Dinâmico */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-[60]">
           <div className={`w-14 h-20 bg-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center rounded-b-[2rem] border-x-4 border-t-4 ${canSpinFree ? 'border-emerald-500' : 'border-amber-500'}`}>
              <div className={`w-3 h-3 rounded-full mt-2 animate-pulse shadow-[0_0_15px_#fff] ${canSpinFree ? 'bg-white' : 'bg-amber-400'}`} />
              <div className={`w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[24px] mt-2 ${canSpinFree ? 'border-t-emerald-500' : 'border-t-amber-500'}`} />
           </div>
        </div>

        {/* Borda de LEDs - Diferenciada por modo */}
        <div className={`absolute -inset-8 rounded-full border-[14px] border-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.4)] bg-slate-950 z-0 overflow-hidden ${!canSpinFree ? 'ring-4 ring-amber-500/50 shadow-[0_0_100px_rgba(245,158,11,0.3)]' : 'ring-2 ring-emerald-500/20'}`}>
            {Array.from({ length: 32 }).map((_, i) => (
                <div 
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${!canSpinFree ? 'bg-amber-400' : 'bg-white'}`}
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * (360/32)}deg) translateY(-145px) md:translateY(-188px)`,
                        animation: `led-blink 1.2s infinite ${i * 0.05}s`,
                        boxShadow: !canSpinFree ? '0 0 15px #fbbf24' : '0 0 10px #fff'
                    }}
                />
            ))}
            {!isSpinning && !canSpinFree && (
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent animate-spin-slow pointer-events-none" />
            )}
        </div>
        
        {/* Disco da Roleta */}
        <div 
          className={`relative w-full h-full rounded-full border-[16px] border-slate-900 shadow-[inset_0_0_80px_rgba(0,0,0,0.9),0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-[6000ms] cubic-bezier(0.1, 0, 0.1, 1) z-10`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {currentPrizes.map((prize, idx) => {
            const angle = 360 / currentPrizes.length;
            return (
              <div 
                key={idx}
                className="absolute top-0 left-1/2 origin-bottom h-1/2 w-[44%] -translate-x-1/2"
                style={{ 
                  transform: `translateX(-50%) rotate(${idx * angle}deg)`,
                  backgroundColor: prize.color,
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                }}
              >
                <div className="absolute top-10 md:top-20 left-1/2 -translate-x-1/2 -rotate-90 origin-center whitespace-nowrap text-[9px] md:text-[14px] font-black text-white uppercase tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                  {prize.label}
                </div>
              </div>
            );
          })}
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 bg-slate-900 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center z-20 border-[10px] border-slate-800 overflow-hidden">
             <div className="flex flex-col items-center">
                <span className={`text-[10px] md:text-[14px] font-black tracking-tighter italic uppercase ${canSpinFree ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {canSpinFree ? 'ESTÂNCIA' : 'TURBO'}
                </span>
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] text-white/40 -mt-1">DA SORTE</span>
             </div>
          </div>
        </div>
      </div>

      {/* CONTROLES DIFERENCIADOS */}
      <div className="mt-24 w-full text-center space-y-6">
        {canSpinFree ? (
          <div className="animate-in slide-in-from-bottom duration-500">
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 animate-pulse italic">Presente da Estância:</p>
            <button 
              onClick={() => spin(false)} 
              disabled={isSpinning}
              className="w-full py-8 rounded-[3rem] font-black text-2xl uppercase tracking-widest shadow-2xl transition-all active:scale-95 border-b-[8px] bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500 shadow-emerald-900/20"
            >
              {isSpinning ? "SORTEANDO..." : 'GIRAR GRÁTIS'}
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom duration-700 space-y-8">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-3xl inline-block">
               <p className="text-amber-600 font-black text-xs uppercase tracking-widest italic flex items-center gap-2">
                 <span className="animate-pulse">⚡</span> SORTE <span className="text-slate-900 font-black">TURBO</span> ATIVADA!
               </p>
            </div>

            <div className="relative group">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] z-20 shadow-lg border-2 border-white animate-bounce">
                  R$ {extraSpinPrice.toFixed(2)} / GIRO
               </div>

               <button 
                onClick={() => spin(true)}
                disabled={isSpinning}
                className="w-full py-8 rounded-[3.5rem] font-black text-2xl uppercase tracking-widest shadow-[0_20px_60px_rgba(245,158,11,0.4)] transition-all active:scale-95 border-b-[10px] bg-slate-900 text-white border-amber-600 hover:bg-slate-800 hover:border-amber-500 relative overflow-hidden group-hover:scale-[1.02]"
               >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSpinning ? "PROCESSANDO..." : "GIRAR AGORA ⚡"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
               </button>
            </div>

            <div className="flex flex-col items-center gap-2">
               <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.4em] italic">Próximo giro grátis em: <span className="text-slate-900">{timeLeft}</span></p>
               <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 animate-pulse" style={{ width: '60%' }} />
               </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE VITÓRIA */}
      {showShareOptions && hasWon && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
              <div className={`bg-white w-full max-w-[650px] rounded-[4rem] p-8 md:p-14 text-center border-4 shadow-[0_0_150px_rgba(245,158,11,0.3)] relative animate-in zoom-in duration-700 ${!canSpinFree ? 'border-amber-500/30' : 'border-emerald-500/30'}`}>
                  
                  <div className="mb-12">
                      <div className="text-9xl mb-8 animate-victory-pop drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                        {hasWon.type === 'nothing' ? '⚡' : '💎'}
                      </div>
                      <h3 className="text-slate-900 font-black text-4xl md:text-6xl mb-4 uppercase tracking-tighter italic leading-tight">
                          {hasWon.type === 'nothing' ? 'VALEU O GIRO!' : 'BUENA SORTE!'}
                      </h3>
                      <div className={`px-10 py-5 rounded-[2.5rem] inline-block font-black text-2xl uppercase tracking-widest border-2 italic shadow-sm ${!canSpinFree ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                          {hasWon.label}
                      </div>
                  </div>

                  <div className="bg-slate-900 p-8 md:p-10 rounded-[3.5rem] mb-12 shadow-2xl text-left relative overflow-hidden border-b-[12px] border-emerald-500">
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                          <h4 className="text-white font-black text-2xl mb-2 italic uppercase tracking-tighter">🚀 QUER DOBRAR O GANHO?</h4>
                          <p className="text-slate-400 text-sm md:text-base font-bold leading-relaxed">
                              Cada amigo que entrar pelo seu link e depositar te dá <span className="text-amber-400">1 GIRO TURBO EXTRA</span>. A estância é sua!
                          </p>
                        </div>
                        <button 
                            onClick={() => handleShare('whatsapp')}
                            className="w-full md:w-auto bg-[#25D366] text-white px-12 py-6 rounded-[2rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 whitespace-nowrap"
                        >
                            CONVIDAR AMIGOS
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px] -mr-24 -mt-24" />
                  </div>

                  <button 
                      onClick={() => { onWin(hasWon); setShowShareOptions(false); }}
                      className="text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] hover:text-emerald-600 transition-colors"
                  >
                      VOLTAR AO DASHBOARD
                  </button>
              </div>
          </div>
      )}

      <style>{`
        @keyframes led-blink {
            0%, 100% { opacity: 0.3; filter: brightness(0.6); }
            50% { opacity: 1; filter: brightness(2.5); }
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        @keyframes victory-pop {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.25); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-victory-pop { animation: victory-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default DailyWheel;