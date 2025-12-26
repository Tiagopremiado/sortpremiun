
import React from 'react';
import { Raffle } from '../types';

interface RaffleCardProps {
  raffle: Raffle;
  onClick: (id: string) => void;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onClick }) => {
  const percentSold = (raffle.soldTickets / raffle.totalTickets) * 100;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `Sorteio: ${raffle.title}`,
      text: `Participe do sorteio: ${raffle.title}. Cotas por apenas R$ ${raffle.ticketPrice.toFixed(2)}!`,
      url: `${window.location.origin}/?raffle=${raffle.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback: Copiar para área de transferência
      try {
        await navigator.clipboard.writeText(`${shareData.text} Confira aqui: ${shareData.url}`);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        alert('Não foi possível copiar o link.');
      }
    }
  };
  
  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => onClick(raffle.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={raffle.prizeImage} 
          alt={raffle.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Ativo
        </div>
        <div className="absolute top-4 left-4">
          <button 
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-slate-600 hover:text-emerald-600 shadow-sm transition-colors border border-white/20"
            title="Compartilhar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="text-white text-sm font-medium">Sorteio dia {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{raffle.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{raffle.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-1 text-slate-400">
            <span>PROGRESSO</span>
            <span className="text-emerald-600">{percentSold.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000" 
              style={{ width: `${percentSold}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs block font-bold">POR APENAS</span>
            <span className="text-emerald-600 text-xl font-extrabold">R$ {raffle.ticketPrice.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClick(raffle.id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleCard;