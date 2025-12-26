
import React, { useState, useEffect } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState<'amount' | 'pix' | 'verifying'>('amount');
  const [amount, setAmount] = useState<number>(10);
  const [countdown, setCountdown] = useState(600);

  // Valores rápidos atualizados para incluir o novo mínimo de R$ 5
  const quickAmounts = [5, 10, 20, 50, 100, 200];

  useEffect(() => {
    if (step === 'pix' && countdown > 0) {
      const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (step === 'verifying') {
      const timer = setTimeout(() => {
        onConfirm(amount);
        setStep('amount');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, countdown, onConfirm, amount]);

  if (!isOpen) return null;

  const handleStartPix = () => {
    if (amount < 5) {
      alert("O depósito mínimo é de R$ 5,00");
      return;
    }
    setStep('pix');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
        
        {/* Header Profissional */}
        <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-2xl font-black mb-1 italic uppercase">Adicionar Saldo</h2>
              <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">Recarga via PIX instantâneo</p>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        </div>

        {step === 'amount' && (
          <div className="p-8">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest italic">Quanto deseja recarregar?</label>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
               {quickAmounts.map(val => (
                 <button 
                  key={val} 
                  onClick={() => setAmount(val)}
                  className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${amount === val ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-105' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200'}`}
                 >
                   R$ {val}
                 </button>
               ))}
            </div>

            <div className="relative group mb-8">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl group-focus-within:text-emerald-500 transition-colors">R$</span>
               <input 
                type="number" 
                value={amount}
                min="5"
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-100 px-14 py-5 rounded-2xl outline-none focus:border-emerald-500 font-black text-2xl text-slate-800 shadow-inner"
                placeholder="5,00"
               />
               <p className="mt-2 text-[9px] text-slate-400 font-bold uppercase text-center italic">Mínimo para recarga: R$ 5,00</p>
            </div>

            <button 
              onClick={handleStartPix}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
            >
              GERAR QR CODE PIX
            </button>
            <button onClick={onClose} className="w-full mt-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-600 transition-colors">Talvez mais tarde</button>
          </div>
        )}

        {step === 'pix' && (
          <div className="p-8 text-center animate-in slide-in-from-right duration-500">
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-emerald-100">
                EXPIRA EM: {formatTime(countdown)}
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Escaneie o QR Code</h2>
            <p className="text-slate-400 text-sm font-medium mb-8">O valor de <span className="text-slate-900 font-black">R$ {amount.toFixed(2)}</span> será creditado instantaneamente.</p>
            
            <div className="bg-white border-4 border-slate-50 p-6 rounded-[3rem] inline-block mb-8 shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DEPOSIT_PIX_${amount}`} 
                alt="QR Code PIX" 
                className="w-44 h-44"
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-widest">Pix Copia e Cola</p>
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(`00020126580014BR.GOV.BCB.PIX0136DEPOSITO_ESTANCIA_${amount}`);
                   alert('Chave PIX copiada!');
                }}
                className="text-[11px] text-emerald-600 font-mono font-black hover:bg-white p-2 rounded-lg transition-all break-all"
              >
                00020126580014BR.GOV.BCB.PIX0136...{amount}
              </button>
            </div>

            <button 
              onClick={() => setStep('verifying')}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-2xl active:scale-95"
            >
              JÁ PAGUEI, VERIFICAR AGORA
            </button>
          </div>
        )}

        {step === 'verifying' && (
          <div className="p-20 text-center animate-in zoom-in duration-500">
            <div className="mb-10 flex justify-center relative">
               <div className="w-24 h-24 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center text-3xl">🛡️</div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Processando Crédito</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Integrando com o Banco...</p>
            <p className="text-slate-500 font-medium text-sm">Validando sua transferência PIX em tempo real.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositModal;