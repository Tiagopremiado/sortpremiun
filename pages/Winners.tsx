
import React, { useState } from 'react';
import { Winner, Raffle } from '../types';

interface WinnersProps {
  winners: Winner[];
  raffles: Raffle[];
}

const Winners: React.FC<WinnersProps> = ({ winners, raffles }) => {
  const [filter, setFilter] = useState<'all' | 'big' | 'daily'>('all');
  
  const filteredWinners = winners.filter(w => {
    if (filter === 'all') return true;
    if (filter === 'big') return w.raffleId !== '0';
    return w.raffleId === '0';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-in fade-in duration-700">
      {/* Header Impactante */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl mb-6">
           <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Prova Social Verificada</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter italic uppercase leading-none">
          HALL DA <span className="text-emerald-600">FORTUNA</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          A transparência é nossa maior bandeira. Conheça as histórias reais de quem acreditou e mudou de vida com nossos sorteios oficiais.
        </p>
      </div>

      {/* Auditória Federal Card */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden mb-24 shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block italic">Auditória & Transparência</span>
               <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight uppercase italic">Como saber se é real?</h2>
               <p className="text-slate-400 text-lg mb-10 font-medium">
                  Todos os nossos sorteios principais são baseados nos resultados da <span className="text-white font-bold underline decoration-emerald-500">Loteria Federal da Caixa</span>. Não existe interferência humana: o número que sai na extração oficial é o ganhador aqui.
               </p>
               <div className="flex flex-wrap gap-4">
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                     <span className="text-2xl">🏛️</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">Extração 100% Governamental</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                     <span className="text-2xl">🛡️</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">Pagamentos Imediatos via PIX</span>
                  </div>
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative group hover:scale-[1.02] transition-transform">
               <div className="flex justify-between items-center mb-8">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exemplo de Auditória</p>
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[9px] font-black">VALIDADO</span>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                     <div>
                        <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Loteria Federal (Conc. 5822)</p>
                        <p className="text-2xl font-black text-white">45.892</p>
                     </div>
                     <span className="text-emerald-500 text-3xl font-black">=</span>
                     <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Título Ganhador</p>
                        <p className="text-2xl font-black text-emerald-400">45892</p>
                     </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium italic text-center leading-relaxed">
                     "Confira sempre o 1º prêmio da Federal no site da Caixa e compare com os ganhadores desta galeria."
                  </p>
               </div>
            </div>
         </div>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      </div>

      {/* Filtros de Ganhadores */}
      <div className="flex justify-center gap-4 mb-16">
         {[
            { id: 'all', label: 'Todos os Ganhadores' },
            { id: 'big', label: 'Grandes Prêmios' },
            { id: 'daily', label: 'Prêmios Instantâneos' }
         ].map(btn => (
            <button 
               key={btn.id}
               onClick={() => setFilter(btn.id as any)}
               className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === btn.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
            >
               {btn.label}
            </button>
         ))}
      </div>

      {/* Grid de Ganhadores Profissional */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredWinners.map(winner => (
          <div key={winner.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
               <img 
                  src={winner.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={winner.userName} 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                     <p className="text-white font-black text-xl tracking-tighter leading-none">{winner.userName}</p>
                     <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">{winner.location}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                     <span className="text-white text-[9px] font-black">#{winner.ticketNumber.toString().padStart(5, '0')}</span>
                  </div>
               </div>
               {/* Selo de Verificação */}
               <div className="absolute top-6 left-6">
                  <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                     <span className="text-xs">✓</span>
                     <span className="text-[8px] font-black uppercase tracking-widest">Pagamento Verificado</span>
                  </div>
               </div>
            </div>
            
            <div className="p-8">
               <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest italic">Depoimento do Ganhador</p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{winner.testimonial}"</p>
               </div>
               
               <div className="flex justify-between items-center">
                  <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prêmio Recebido</p>
                     <p className="text-lg font-black text-slate-900 italic uppercase">{winner.prizeName}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data</p>
                     <p className="text-xs font-bold text-slate-600">{new Date(winner.drawDate).toLocaleDateString('pt-BR')}</p>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Call to Action Final */}
      <div className="mt-32 text-center max-w-4xl mx-auto">
         <div className="bg-emerald-600 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter leading-tight">O próximo rosto aqui <br/> pode ser o <span className="text-slate-900">seu.</span></h2>
               <p className="text-emerald-100 text-lg mb-12 font-medium max-w-xl mx-auto leading-relaxed">
                  Não espere pela sorte, dê o primeiro passo. Milhares de pessoas já acreditaram e o PIX já caiu na conta de todas elas.
               </p>
               <button className="bg-white text-emerald-600 px-12 py-6 rounded-3xl font-black text-xl hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest">
                  QUERO MINHA CHANCE AGORA
               </button>
            </div>
            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mb-32" />
         </div>
      </div>
    </div>
  );
};

export default Winners;