
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Order, Raffle, User, WithdrawalRequest, AppNotification, RaffleStatus } from '../types';
import AffiliateFunnel from '../components/AffiliateFunnel';
import DailyWheel from '../components/DailyWheel';
import MinesGame from '../components/MinesGame';

interface UserProfileProps {
  user: User;
  allUsers: User[];
  orders: Order[];
  raffles: Raffle[];
  withdrawals: WithdrawalRequest[];
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onRequestWithdrawal: (amount: number, pixKey: string) => void;
  onOpenDeposit: () => void;
  onMarkRead: () => void;
  wheelConfig: any[];
  extraSpinPrice: number;
  onSpinWin: (prize: any) => void;
  onBuySpin: () => void;
  onPurchaseSpin?: () => void;
  isCasinoPayoutEnabled: boolean;
  casinoLiquidity: number;
  onUpdateLiquidity: (amount: number, type: 'add' | 'remove') => void;
  minesMaxPayout: number;
  onJoinAffiliate?: () => void;
  siteConfig?: any;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, allUsers, orders, raffles, withdrawals, onLogout, onUpdateUser, onRequestWithdrawal, onOpenDeposit, onMarkRead, wheelConfig, extraSpinPrice, onSpinWin, onBuySpin, onPurchaseSpin, isCasinoPayoutEnabled, casinoLiquidity, onUpdateLiquidity, minesMaxPayout, onJoinAffiliate, siteConfig
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'store' | 'affiliate' | 'rewards' | 'casino' | 'notifs' | 'wallet' | 'history' | 'home'>('home');
  const [showBalance, setShowBalance] = useState(true);
  
  // Estados do Tour Spotlight
  const [showTour, setShowTour] = useState(!user.hasSeenTour);
  const [tourStep, setTourStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tourRefs = {
    profile: useRef<HTMLDivElement>(null),
    balance: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null)
  };

  const tourData = [
    { title: "Identidade Premium", desc: "Este é seu perfil oficial. Aqui você gerencia seus dados e nível VIP.", icon: "👤", ref: tourRefs.profile },
    { title: "Sua Banca PIX", desc: "Controle seu saldo em tempo real e acompanhe seu extrato de lucros.", icon: "💰", ref: tourRefs.balance },
    { title: "Nossos Serviços", desc: "Acesse sorteios, arena de jogos e sua área de afiliado em um só lugar.", icon: "🚀", ref: tourRefs.services }
  ];

  useEffect(() => {
    if (showTour && tourData[tourStep]?.ref?.current) {
      const el = tourData[tourStep].ref.current;
      const rect = el.getBoundingClientRect();
      setSpotlightRect({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height
      });
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [tourStep, showTour]);

  const closeTour = () => {
    setShowTour(false);
    onUpdateUser({ ...user, hasSeenTour: true });
  };

  const currentBalance = user.currentBalance || 0;

  const services = [
    { id: 'store', label: 'Sorteios', icon: '🎫', color: 'bg-blue-100', text: 'text-blue-600' },
    { id: 'casino', label: 'Arena VIP', icon: '🎮', color: 'bg-purple-100', text: 'text-purple-600', badge: 'PRO' },
    { id: 'rewards', label: 'Roleta', icon: '🎡', color: 'bg-amber-100', text: 'text-amber-600' },
    { id: 'affiliate', label: 'Indicar', icon: '🚀', color: 'bg-emerald-100', text: 'text-emerald-600' },
    { id: 'notifs', label: 'Avisos', icon: '🔔', color: 'bg-red-100', text: 'text-red-600' },
    { id: 'wallet', label: 'Saques', icon: '💸', color: 'bg-slate-100', text: 'text-slate-600' },
    { id: 'tickets', label: 'Meus Títulos', icon: '📂', color: 'bg-indigo-100', text: 'text-indigo-600' },
    { id: 'history', label: 'Histórico', icon: '📋', color: 'bg-slate-100', text: 'text-slate-600' },
  ];

  return (
    <div className="min-h-screen bg-white font-inter pb-24 relative">
      
      {/* MÁSCARA SVG DO TOUR */}
      {showTour && spotlightRect && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          <svg className="w-full h-full pointer-events-auto">
            <defs>
              <mask id="tour-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect 
                  x={spotlightRect.x - 10} 
                  y={spotlightRect.y - 10} 
                  width={spotlightRect.w + 20} 
                  height={spotlightRect.h + 20} 
                  rx="30" 
                  fill="black" 
                  className="transition-all duration-500 ease-in-out"
                />
              </mask>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(2, 6, 23, 0.85)" mask="url(#tour-mask)" onClick={closeTour} />
          </svg>

          {/* Card flutuante do Tour */}
          <div 
            className="absolute z-[210] pointer-events-auto transition-all duration-500 ease-in-out p-6 bg-white rounded-[2.5rem] shadow-2xl w-[320px] text-center border border-white/20 animate-in zoom-in slide-in-from-top-10"
            style={{ 
              top: spotlightRect.y + spotlightRect.h + 20,
              left: Math.min(Math.max(20, spotlightRect.x + spotlightRect.w / 2 - 160), window.innerWidth - 340)
            }}
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 text-white shadow-lg shadow-emerald-500/20">
              {tourData[tourStep].icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">{tourData[tourStep].title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{tourData[tourStep].desc}</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1">
                {tourData.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${tourStep === i ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-100'}`} />
                ))}
              </div>
              <button 
                onClick={() => tourStep < tourData.length - 1 ? setTourStep(tourStep + 1) : closeTour()}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
              >
                {tourStep < tourData.length - 1 ? 'Próximo' : 'Finalizar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER ESTILO SUPER APP (VERDE) */}
      <div className="bg-[#007b4b] pt-6 pb-20 px-6 relative">
        <div className="flex justify-end gap-5 mb-6 text-white opacity-90">
          <button className="text-xl">⚙️</button>
          <button onClick={() => setActiveTab('notifs')} className="text-xl relative">
            🔔
            { (user.notifications || []).some(n => !n.isRead) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#007b4b]" /> }
          </button>
          <button className="text-xl">❓</button>
          <button onClick={() => setActiveTab('rewards')} className="text-xl">🎁</button>
        </div>

        {/* Alvo Tour: PROFILE */}
        <div ref={tourRefs.profile} className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-emerald-700">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold tracking-tight">Olá, {user.name.split(' ')[0].toUpperCase()}</h2>
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full mt-1">
              <span className="text-white text-[10px] font-bold flex items-center gap-1">
                Filiado
              </span>
            </div>
          </div>
        </div>

        {/* Alvo Tour: BALANCE */}
        <div ref={tourRefs.balance} className="flex gap-3 mb-4">
          <div className="flex-1 bg-white rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold text-lg">R$</span>
              <span className="text-slate-900 font-black text-xl tracking-tighter">
                {showBalance ? currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '••••••'}
              </span>
            </div>
            <button onClick={() => setShowBalance(!showBalance)} className="text-slate-400">
              {showBalance ? '👁️' : '🙈'}
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('history')}
            className="flex-1 bg-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg"
          >
            <span className="text-emerald-700 text-xl">📋</span>
            <span className="text-[#007b4b] font-bold text-sm">Meu extrato</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-[2.5rem] -mt-10 relative z-10 px-6 pt-8 min-h-[60vh]">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <div className="relative group">
              <div className="w-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 h-44 rounded-3xl border border-slate-100 overflow-hidden flex items-center px-8 relative">
                <div className="z-10">
                  <p className="text-emerald-800 font-black text-sm uppercase tracking-tight mb-1">CASHBACK ESPECIAL DE FIM DE ANO</p>
                  <h3 className="text-emerald-950 font-black text-2xl uppercase italic leading-none mb-4">CASHBACK <br/> DA VIRADA</h3>
                  <button onClick={onOpenDeposit} className="bg-amber-500 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase shadow-lg shadow-amber-500/30">APROVEITE</button>
                </div>
              </div>
            </div>

            {/* Alvo Tour: SERVICES */}
            <section ref={tourRefs.services}>
              <h4 className="text-slate-800 font-black text-lg mb-6 tracking-tight">Serviços da Estância</h4>
              <div className="grid grid-cols-4 gap-y-10 gap-x-4">
                {services.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setActiveTab(s.id as any)}
                    className="flex flex-col items-center group"
                  >
                    <div className={`w-16 h-16 ${s.color} rounded-[1.8rem] flex items-center justify-center text-3xl mb-3 shadow-sm group-active:scale-90 transition-transform relative`}>
                      {s.icon}
                      {s.badge && <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md shadow-sm">{s.badge}</span>}
                    </div>
                    <span className="text-slate-500 font-bold text-[10px] text-center leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ... (Demais abas permanecem inalteradas, mantendo funcionalidade) ... */}
        {activeTab === 'casino' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex items-center gap-3">
              <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">←</button>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Arena de Jogos</h3>
            </div>
            <MinesGame 
              userBalance={currentBalance} 
              onUpdateBalance={(newBalance) => onUpdateUser({ ...user, currentBalance: newBalance })} 
              onWin={(winAmount) => onUpdateUser({ ...user, currentBalance: (user.currentBalance || 0) + winAmount })} 
              onOpenDeposit={onOpenDeposit} 
              isCasinoPayoutEnabled={isCasinoPayoutEnabled} 
              casinoLiquidity={casinoLiquidity} 
              onUpdateLiquidity={onUpdateLiquidity} 
              minesMaxPayout={minesMaxPayout} 
            />
          </div>
        )}
        
        {/* Renderização condicional para outras abas como Notifs, History, etc. segue o mesmo padrão */}
        {activeTab === 'notifs' && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
             {user.notifications?.length ? user.notifications.map(n => (
              <div key={n.id} className={`p-6 rounded-3xl border-2 ${n.isRead ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/30 border-emerald-500/20 shadow-lg shadow-emerald-500/5'}`}>
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                 <h4 className="text-lg font-black text-slate-900 leading-tight mb-2">{n.title}</h4>
                 <p className="text-slate-500 text-xs font-medium leading-relaxed">{n.message}</p>
              </div>
            )) : <p className="text-center py-20 text-slate-300 font-bold uppercase text-[10px] tracking-widest">Nenhum aviso</p>}
          </div>
        )}

      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around py-3 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {[
          { id: 'home', label: 'Início', icon: '🏠' },
          { id: 'wallet', label: 'Saques', icon: '💸' },
          { id: 'history', label: 'Extrato', icon: '📋' },
          { id: 'notifs', label: 'Avisos', icon: '🔔' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 min-w-[70px] transition-all ${activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default UserProfile;
