
import React, { useState, useEffect } from 'react';
import { Raffle, RaffleStatus } from '../types';

interface RaffleDetailProps {
  raffle: Raffle;
  onBack: () => void;
  onBuy: (count: number) => void;
}

const RaffleDetail: React.FC<RaffleDetailProps> = ({ raffle, onBack, onBuy }) => {
  // Garante que o mínimo seja pelo menos 5, mesmo se definido como menos no DB/Mock
  const minTickets = Math.max(5, raffle.minTicketsPerUser || 5);
  const [ticketCount, setTicketCount] = useState(minTickets);
  const totalValue = ticketCount * raffle.ticketPrice;
  const percentSold = (raffle.soldTickets / raffle.totalTickets) * 100;

  // Opções rápidas respeitando o novo piso de 5
  const quickOptions = [
    minTickets, 
    minTickets * 2, 
    minTickets * 10, 
    minTickets * 20
  ];

  const handleIncrement = () => setTicketCount(prev => prev + 1);
  const handleDecrement = () => setTicketCount(prev => Math.max(minTickets, prev - 1));

  // Ajusta se o valor inicial for menor que o novo mínimo por algum motivo
  useEffect(() => {
    if (ticketCount < minTickets) {
      setTicketCount(minTickets);
    }
  }, [minTickets]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-emerald-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Voltar para sorteios
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Lado Esquerdo: Info e Cotas Premiadas */}
        <div className="space-y-8">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            <img src={raffle.prizeImage} alt={raffle.title} className="w-full h-[450px] object-cover" />
            <div className="absolute top-6 left-6 bg-slate-900/60 backdrop-blur-md text-white px-6 py-2 rounded-2xl text-sm font-bold border border-white/20">
              PRÊMIO PRINCIPAL
            </div>
          </div>
          
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              {raffle.status === RaffleStatus.ACTIVE && (
                <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg shadow-emerald-200/20">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  Sorteio Ativo
                </span>
              )}
              {raffle.status === RaffleStatus.DRAWN && (
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                  🏁 Concluído
                </span>
              )}
              {raffle.status === RaffleStatus.PAUSED && (
                <span className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                  ⏸️ Pausado
                </span>
              )}
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Sorteio Oficial</span>
              {raffle.luckyNumbers && raffle.luckyNumbers.length > 0 && (
                <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Cotas Premiadas</span>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">{raffle.title}</h1>
            <p className="text-slate-500 leading-relaxed text-lg mb-8">{raffle.description}</p>
          </div>

          {raffle.luckyNumbers && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-amber-500">✨</span> Cotas Premiadas Disponíveis
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {raffle.luckyNumbers.slice(0, 10).map((lucky, idx) => (
                  <div key={idx} className={`py-2 rounded-xl text-center text-xs font-bold border ${lucky.isFound ? 'bg-slate-50 text-slate-300 line-through' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {lucky.number}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center font-bold uppercase tracking-widest">Quanto mais cotas você compra, mais chances de achar!</p>
            </div>
          )}
        </div>

        {/* Lado Direito: Compra com Regra de Mínimo 5 */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 overflow-hidden relative">
            <div className="absolute -top-1 -right-1 bg-slate-900 text-white px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest">
              Compra Mínima: {minTickets} Cotas
            </div>

            <div className="mb-8 mt-4">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Valor Unitário</span>
                  <span className="text-emerald-600 text-3xl font-black">R$ {raffle.ticketPrice.toFixed(2)}</span>
               </div>
               
               <div className="mt-8">
                 <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-tighter">
                   <span>Progresso de Vendas</span>
                   <span className="text-emerald-600">{Math.round(percentSold)}%</span>
                 </div>
                 <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                   <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${percentSold}%` }} />
                 </div>
               </div>
            </div>

            <div className="mb-8">
              <p className="text-slate-800 font-black text-center mb-4 uppercase text-xs tracking-widest">Aproveite a sorte!</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {quickOptions.map(num => (
                  <button 
                    key={num}
                    onClick={() => setTicketCount(num)}
                    disabled={raffle.status !== RaffleStatus.ACTIVE}
                    className={`py-4 rounded-2xl font-black transition-all border-2 relative overflow-hidden ${ticketCount === num ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-emerald-200'} ${raffle.status !== RaffleStatus.ACTIVE ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                  >
                    {num} Cotas
                    {num >= minTickets * 10 && (
                      <span className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[8px] px-2 py-0.5 rounded-bl-lg">POPULAR</span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-3xl border border-slate-100">
                <button 
                  onClick={handleDecrement} 
                  disabled={ticketCount <= minTickets || raffle.status !== RaffleStatus.ACTIVE}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${ticketCount <= minTickets || raffle.status !== RaffleStatus.ACTIVE ? 'text-slate-300' : 'bg-white text-slate-600 shadow-sm hover:text-emerald-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                </button>
                <div className="flex-1 text-center">
                  <span className="text-3xl font-black text-slate-800">{ticketCount}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Cotas</p>
                </div>
                <button 
                  onClick={handleIncrement} 
                  disabled={raffle.status !== RaffleStatus.ACTIVE}
                  className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-600 shadow-sm hover:text-emerald-600 transition-all ${raffle.status !== RaffleStatus.ACTIVE ? 'opacity-50' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <p className="text-center text-[10px] text-slate-400 font-bold mt-3 uppercase">
                Mínimo obrigatório: {minTickets} cotas
              </p>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
               <div className="relative z-10 flex justify-between items-center">
                 <div>
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block">Total do Pedido</span>
                   <span className="text-3xl font-black text-emerald-400">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="text-right">
                   <span className="text-[10px] font-black text-slate-400 uppercase block">Chances</span>
                   <span className="text-lg font-black text-white">x{ticketCount}</span>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            </div>

            <button 
              onClick={() => onBuy(ticketCount)}
              disabled={raffle.status !== RaffleStatus.ACTIVE}
              className={`w-full bg-emerald-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-95 ${raffle.status !== RaffleStatus.ACTIVE ? 'bg-slate-300 cursor-not-allowed shadow-none grayscale' : ''}`}
            >
              {raffle.status === RaffleStatus.ACTIVE ? (
                <>
                  CONCLUIR RESERVA
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              ) : raffle.status === RaffleStatus.DRAWN ? (
                'SORTEIO FINALIZADO'
              ) : (
                'VENDAS PAUSADAS'
              )}
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-bold mt-6 uppercase tracking-widest">
              Sorteio baseado na Loteria Federal • 100% Seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleDetail;