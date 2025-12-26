
import React, { useState } from 'react';
import MinesGame from '../components/MinesGame';
import SlotsGame from '../components/SlotsGame';
import { User, SlotSymbol } from '../types';

interface CasinoProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onOpenDeposit: () => void;
  isCasinoPayoutEnabled: boolean;
  casinoLiquidity: number;
  onUpdateLiquidity: (amount: number, type: 'add' | 'remove') => void;
  minesMaxPayout: number;
  onRecordTransaction?: (type: 'mines_bet' | 'mines_win' | 'slot_bet' | 'slot_win', amount: number) => void;
  slotSymbols: SlotSymbol[];
}

const Casino: React.FC<CasinoProps> = ({ 
  user, 
  onUpdateUser, 
  onOpenDeposit, 
  isCasinoPayoutEnabled,
  casinoLiquidity,
  onUpdateLiquidity,
  minesMaxPayout,
  onRecordTransaction,
  slotSymbols
}) => {
  const [selectedGameId, setSelectedGameId] = useState<'mines' | 'slots' | null>(null);

  if (selectedGameId === 'mines') {
    return (
      <div className="min-h-screen bg-[#020617] p-4 md:p-8 animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <button onClick={() => setSelectedGameId(null)} className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">←</div>
              Voltar ao Lobby
            </button>
            <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-3 rounded-2xl border border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase leading-none">Minha Banca</p>
                <p className="text-emerald-400 font-black text-lg">R$ {(user.currentBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <button onClick={onOpenDeposit} className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-black">+</button>
            </div>
          </div>

          <MinesGame 
            userBalance={user.currentBalance || 0} 
            onUpdateBalance={(newBalance) => {
              const betAmount = (user.currentBalance || 0) - newBalance;
              if (betAmount > 0 && onRecordTransaction) onRecordTransaction('mines_bet', betAmount);
              onUpdateUser({ ...user, currentBalance: newBalance });
            }}
            onWin={(winAmount) => {
              if (onRecordTransaction) onRecordTransaction('mines_win', winAmount);
              onUpdateUser({ ...user, currentBalance: (user.currentBalance || 0) + winAmount });
            }}
            onOpenDeposit={onOpenDeposit}
            isCasinoPayoutEnabled={isCasinoPayoutEnabled}
            casinoLiquidity={casinoLiquidity}
            onUpdateLiquidity={onUpdateLiquidity}
            minesMaxPayout={minesMaxPayout}
          />
        </div>
      </div>
    );
  }

  if (selectedGameId === 'slots') {
    return (
      <div className="min-h-screen bg-[#1a0505] p-4 md:p-8 animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <button onClick={() => setSelectedGameId(null)} className="flex items-center gap-3 text-white/50 hover:text-white transition-all font-black text-xs uppercase tracking-widest">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center">←</div>
              Voltar ao Lobby
            </button>
            <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
              <div className="text-right">
                <p className="text-[10px] font-black text-amber-500 uppercase leading-none">Minha Banca</p>
                <p className="text-white font-black text-lg">R$ {(user.currentBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <button onClick={onOpenDeposit} className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white text-xl font-black">+</button>
            </div>
          </div>

          <SlotsGame 
            userBalance={user.currentBalance || 0}
            onUpdateBalance={(newBalance) => {
               onUpdateUser({ ...user, currentBalance: newBalance });
            }}
            onWin={(winAmount) => {
               onUpdateUser({ ...user, currentBalance: (user.currentBalance || 0) + winAmount });
            }}
            onRecordTransaction={onRecordTransaction}
            onOpenDeposit={onOpenDeposit}
            symbols={slotSymbols}
            isCasinoPayoutEnabled={isCasinoPayoutEnabled}
            casinoLiquidity={casinoLiquidity}
            onUpdateLiquidity={onUpdateLiquidity}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:py-16 text-center">
       <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 italic uppercase">ESTÂNCIA <span className="text-emerald-600">LOBBY</span></h1>
       <p className="text-slate-400 font-medium mb-16 uppercase tracking-widest text-xs">Jogos originais verificados</p>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card Mines */}
          <div onClick={() => setSelectedGameId('mines')} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden">
             <div className="h-64 bg-slate-900 rounded-2xl mb-6 overflow-hidden relative border-4 border-slate-100">
                <img src="https://images.unsplash.com/photo-1551334787-21e6bd3ab135?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Mines" />
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Popular</div>
             </div>
             <div className="text-left">
                <h3 className="text-2xl font-black italic text-slate-900">MINES ARENA</h3>
                <div className="flex justify-between items-center mt-2">
                   <p className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">Multiplicador Infinito</p>
                   <span className="text-slate-300 text-xl">💣</span>
                </div>
             </div>
          </div>

          {/* Card Royal Slots (Tigrinho) */}
          <div onClick={() => setSelectedGameId('slots')} className="bg-[#1a0505] border-2 border-amber-600 rounded-[2.5rem] p-8 cursor-pointer hover:shadow-[0_20px_60px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all group relative overflow-hidden">
             <div className="h-64 bg-gradient-to-b from-[#500a0f] to-black rounded-2xl mb-6 overflow-hidden relative border-4 border-amber-500/50 flex items-center justify-center">
                 <div className="absolute inset-0 flex items-center justify-center text-8xl animate-pulse grayscale group-hover:grayscale-0 transition-all duration-500">
                    🐯
                 </div>
                 <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
                 <div className="absolute top-4 left-4 bg-amber-500 text-[#500a0f] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg animate-bounce">Novo</div>
             </div>
             <div className="text-left">
                <h3 className="text-2xl font-black italic text-white group-hover:text-amber-400 transition-colors">ROYAL FORTUNE</h3>
                <div className="flex justify-between items-center mt-2">
                   <p className="text-amber-600 font-bold uppercase text-[10px] tracking-widest">Pagamento Turbo</p>
                   <span className="text-amber-500 text-xl">🎰</span>
                </div>
             </div>
             {/* Efeito de brilho ao fundo */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-600/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-600/30 transition-colors" />
          </div>
       </div>
    </div>
  );
};

export default Casino;