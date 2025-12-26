
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleTitle: string;
  ticketCount: number;
  totalValue: number;
  user: User | null;
  onConfirm: (method: 'pix' | 'wallet' | 'mixed', walletDeduction: number, pointsDeduction: number) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  raffleTitle, 
  ticketCount, 
  totalValue, 
  user,
  onConfirm 
}) => {
  const [step, setStep] = useState<'selection' | 'pix' | 'verifying'>('selection');
  const [useBalance, setUseBalance] = useState(true);
  const [usePoints, setUsePoints] = useState(false);
  const [countdown, setCountdown] = useState(600);

  const POINTS_CONVERSION_RATE = 1000;
  const userPoints = user?.rewardPoints || 0;
  const userPointsValue = userPoints / POINTS_CONVERSION_RATE;
  const userBalance = user?.currentBalance || 0;

  const summary = useMemo(() => {
    let discountFromPoints = 0;
    let discountFromBalance = 0;
    let pointsToDeduct = 0;

    if (usePoints && userPoints > 0) {
      discountFromPoints = Math.min(totalValue, userPointsValue);
      pointsToDeduct = discountFromPoints * POINTS_CONVERSION_RATE;
    }

    if (useBalance && userBalance > 0) {
      const remainingAfterPoints = totalValue - discountFromPoints;
      discountFromBalance = Math.min(userBalance, remainingAfterPoints);
    }

    const totalDiscount = discountFromPoints + discountFromBalance;
    const finalAmount = Math.max(0, totalValue - totalDiscount);

    return {
      discountFromPoints,
      discountFromBalance,
      totalDiscount,
      finalAmount,
      pointsToDeduct,
      isFullyCovered: finalAmount === 0
    };
  }, [useBalance, usePoints, totalValue, userPoints, userPointsValue, userBalance]);

  const handleNextStep = () => {
    if (summary.isFullyCovered) {
      setStep('verifying');
    } else {
      setStep('pix');
    }
  };

  useEffect(() => {
    if (step === 'pix' && countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (step === 'verifying') {
      const timer = setTimeout(() => {
        onConfirm(
          summary.isFullyCovered ? 'wallet' : 'mixed', 
          summary.discountFromBalance, 
          summary.pointsToDeduct
        );
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, countdown, onConfirm, summary]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.4)] border border-slate-200 animate-in zoom-in duration-500">
        
        <div className="bg-[#1e3a8a] p-8 md:p-10 text-white relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Checkout <span className="text-emerald-400">Seguro</span></h2>
                <div className="bg-emerald-500 text-[9px] font-black px-3 py-1 rounded-lg uppercase">SSL Ativado</div>
              </div>
              <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em]">{raffleTitle}</p>
           </div>
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        {step === 'selection' && (
          <div className="p-8 md:p-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic text-center">Como deseja pagar suas {ticketCount} cotas?</h3>
            
            <div className="space-y-4 mb-10">
               <button 
                onClick={() => setUseBalance(!useBalance)}
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${useBalance ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
               >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${useBalance ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>💰</div>
                    <div>
                      <p className={`text-xs font-black uppercase tracking-tight ${useBalance ? 'text-emerald-700' : 'text-slate-800'}`}>Saldo da Carteira</p>
                      <p className="text-[10px] text-slate-500 font-bold">Disponível: R$ {userBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${useBalance ? 'bg-emerald-600 border-emerald-600' : 'border-slate-200'}`}>
                    {useBalance && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
               </button>

               <button 
                onClick={() => userPoints > 0 && setUsePoints(!usePoints)}
                disabled={userPoints <= 0}
                className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group relative ${usePoints ? 'border-amber-500 bg-amber-50' : 'border-slate-100 hover:border-slate-200 bg-white'} ${userPoints <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
               >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${usePoints ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>💎</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-black uppercase tracking-tight ${usePoints ? 'text-amber-700' : 'text-slate-800'}`}>Resgatar Pontos</p>
                        <span className="bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Vantagem</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">Equivale a: <span className="text-amber-600">R$ {userPointsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${usePoints ? 'bg-amber-500 border-amber-500' : 'border-slate-200'}`}>
                    {usePoints && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
               </button>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-10 text-white relative overflow-hidden border-b-8 border-emerald-500 shadow-2xl">
               <div className="relative z-10">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Valor do Pedido</span>
                      <span className="font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    {summary.discountFromPoints > 0 && (
                      <div className="flex justify-between items-center text-amber-400 animate-in slide-in-from-right duration-300">
                        <span className="text-[10px] font-black uppercase tracking-widest">Resgate de Pontos VIP</span>
                        <span className="font-black">- R$ {summary.discountFromPoints.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}

                    {summary.discountFromBalance > 0 && (
                      <div className="flex justify-between items-center text-emerald-400 animate-in slide-in-from-right duration-500">
                        <span className="text-[10px] font-black uppercase tracking-widest">Uso de Saldo em Conta</span>
                        <span className="font-black">- R$ {summary.discountFromBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Total Final</p>
                      <p className="text-4xl font-black tracking-tighter text-white">
                        R$ {summary.finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    {summary.isFullyCovered && (
                      <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase animate-bounce">Pago com Sucesso!</div>
                    )}
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
            </div>

            <button 
              onClick={handleNextStep}
              className="w-full bg-[#1e3a8a] text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group"
            >
              {summary.isFullyCovered ? 'FINALIZAR AGORA' : 'GERAR PIX DO RESTANTE'}
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button onClick={onClose} className="w-full mt-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-red-500 transition-colors">Cancelar Operação</button>
          </div>
        )}

        {step === 'pix' && (
          <div className="p-8 md:p-10 text-center animate-in slide-in-from-right duration-500">
            <div className="inline-block bg-slate-100 text-slate-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              PAGAMENTO EXPIRA EM: {formatTime(countdown)}
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">QUASE LÁ!</h2>
            <p className="text-slate-400 text-xs font-bold mb-8 uppercase px-6">
              Escaneie o QR Code abaixo para pagar o restante de <span className="text-emerald-600">R$ {summary.finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>.
            </p>
            
            <div className="bg-white border-8 border-slate-50 p-6 rounded-[3rem] inline-block mb-10 shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PIX_FINAL_${summary.finalAmount.toFixed(2)}`} 
                alt="PIX QR Code" 
                className="w-48 h-48 md:w-56 md:h-56"
              />
            </div>

            <button 
              onClick={() => {
                navigator.clipboard.writeText("PIX_CODE_GOES_HERE");
                alert("Copia e Cola copiado com sucesso!");
              }}
              className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest mb-6 hover:bg-slate-200 transition-colors"
            >
              Copiar Código Pix
            </button>

            <button 
              onClick={() => setStep('verifying')}
              className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl active:scale-95"
            >
              JÁ REALIZEI O PIX
            </button>
          </div>
        )}

        {step === 'verifying' && (
          <div className="p-20 text-center animate-in zoom-in duration-500">
            <div className="mb-12 flex justify-center relative">
               <div className="w-24 h-24 border-[10px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center text-4xl">💎</div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">VALIDANDO</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Oficializando suas cotas na estância...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;