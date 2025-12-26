
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
  onSelectRaffleForPurchase?: (id: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, allUsers, orders, raffles, withdrawals, onLogout, onUpdateUser, onRequestWithdrawal, onOpenDeposit, onMarkRead, wheelConfig, extraSpinPrice, onSpinWin, onBuySpin, onPurchaseSpin, isCasinoPayoutEnabled, casinoLiquidity, onUpdateLiquidity, minesMaxPayout, onJoinAffiliate, siteConfig, onSelectRaffleForPurchase
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'store' | 'affiliate' | 'rewards' | 'casino' | 'notifs' | 'wallet' | 'history' | 'home'>('home');
  const [showBalance, setShowBalance] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentBalance = user.currentBalance || 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="min-h-screen bg-white font-inter pb-24">
      {/* HEADER ESTILO SUPER APP (VERDE) */}
      <div className="bg-[#007b4b] pt-6 pb-20 px-6 relative">
        {/* Top Icons */}
        <div className="flex justify-end gap-5 mb-6 text-white opacity-90">
          <button onClick={() => {}} className="text-xl">⚙️</button>
          <button onClick={() => setActiveTab('notifs')} className="text-xl relative">
            🔔
            { (user.notifications || []).some(n => !n.isRead) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#007b4b]" /> }
          </button>
          <button onClick={() => {}} className="text-xl">❓</button>
          <button onClick={() => setActiveTab('rewards')} className="text-xl">🎁</button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-emerald-700">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          <div>
            <h2 className="text-white text-2xl font-bold tracking-tight">Olá, {user.name.split(' ')[0].toUpperCase()}</h2>
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full mt-1">
              <span className="text-white text-[10px] font-bold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                Filiado
              </span>
            </div>
          </div>
        </div>

        {/* Balance & Actions Bar */}
        <div className="flex gap-3 mb-4">
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

      {/* CONTEÚDO PRINCIPAL (BRANCO) */}
      <div className="bg-white rounded-t-[2.5rem] -mt-10 relative z-10 px-6 pt-8 min-h-[60vh]">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500 space-y-10">
            {/* Banner Carousel Mock */}
            <div className="relative group">
              <div className="w-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 h-44 rounded-3xl border border-slate-100 overflow-hidden flex items-center px-8 relative">
                <div className="z-10">
                  <p className="text-emerald-800 font-black text-sm uppercase tracking-tight mb-1">CASHBACK ESPECIAL DE FIM DE ANO</p>
                  <h3 className="text-emerald-950 font-black text-2xl uppercase italic leading-none mb-4">CASHBACK <br/> DA VIRADA</h3>
                  <button onClick={onOpenDeposit} className="bg-amber-500 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase shadow-lg shadow-amber-500/30">APROVEITE</button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[url('https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center opacity-40 mix-blend-multiply" />
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                {[1,2,3,4,5,6].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${i === 1 ? 'w-4 bg-emerald-500' : 'w-1.5 bg-slate-200'}`} />)}
              </div>
            </div>

            {/* Serviços Grid */}
            <section>
              <h4 className="text-slate-800 font-black text-lg mb-6 tracking-tight">Serviços com ofertas especiais</h4>
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

            {/* Daily Mission Card */}
            {siteConfig?.dailyMission && (
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚀</div>
                  <div>
                    <h5 className="text-slate-900 font-black text-sm">{siteConfig.dailyMission.title}</h5>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">{siteConfig.dailyMission.reward}</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('affiliate')} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Fazer Agora</button>
              </div>
            )}
          </div>
        )}

        {/* OUTRAS ABAS (MANTENDO FUNCIONALIDADES EXISTENTES) */}
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

        {activeTab === 'rewards' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8 flex items-center gap-3">
              <button onClick={() => setActiveTab('home')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">←</button>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Roda Premiada</h3>
            </div>
            <DailyWheel onWin={onSpinWin} lastSpinDate={user.lastSpinDate} customPrizes={wheelConfig} extraSpinPrice={extraSpinPrice} onBuySpin={onBuySpin} onPurchaseSpin={onPurchaseSpin} userBalance={currentBalance} />
          </div>
        )}

        {activeTab === 'affiliate' && <AffiliateFunnel user={user} referrals={allUsers.filter(u => u.referredBy === user.id).map(r => ({...r, hasDeposited: orders.some(o => o.userId === r.id && o.status === 'paid')}))} dailyMission={siteConfig?.dailyMission} onToggleAutomation={() => {}} />}
        
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

        {activeTab === 'tickets' && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
            {orders.filter(o => o.userId === user.id && !['deposit','mines_bet','mines_win','wheel_spin'].includes(o.raffleId)).map(order => {
              const raffle = raffles.find(r => r.id === order.raffleId);
              return (
                <div key={order.id} className="bg-slate-50 p-6 rounded-3xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-4">
                    <img src={raffle?.prizeImage} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{raffle?.title}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{order.tickets.length} Cotas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] font-black text-emerald-600">#{order.tickets[0]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 animate-in slide-in-from-bottom duration-500">
            {orders.filter(o => o.userId === user.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15).map(o => (
              <div key={o.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-black text-slate-800 text-xs uppercase">{o.raffleId === 'deposit' ? 'Depósito Pix' : o.raffleId === 'mines_win' ? 'Ganho Arena' : 'Reserva Cota'}</p>
                  <p className="text-[9px] text-slate-400 font-bold">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <p className={`font-black text-sm ${o.raffleId === 'deposit' || o.raffleId === 'mines_win' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {o.raffleId === 'deposit' || o.raffleId === 'mines_win' ? '+' : '-'} R$ {o.totalValue.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="bg-emerald-50/30 p-8 rounded-[3rem] border border-emerald-500/10 animate-in zoom-in duration-500">
             <h3 className="text-2xl font-black text-slate-900 italic uppercase mb-6">Solicitar Resgate</h3>
             <div className="space-y-4">
               <div className="bg-white p-4 rounded-2xl border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Chave Pix</p>
                 <input type="text" placeholder="CPF ou Celular" className="w-full font-bold outline-none text-slate-700" />
               </div>
               <div className="bg-white p-4 rounded-2xl border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Valor</p>
                 <input type="number" placeholder="Min R$ 20" className="w-full font-bold outline-none text-slate-700" />
               </div>
               <button onClick={() => alert("Solicitação enviada!")} className="w-full bg-[#007b4b] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-700/20">Solicitar Saque via Pix</button>
             </div>
          </div>
        )}
      </div>

      {/* NAV FIXA INFERIOR ESTILO APP */}
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
            {activeTab === item.id && <div className="h-0.5 w-8 bg-emerald-500 rounded-full mt-0.5" />}
          </button>
        ))}
      </nav>

      <style>{`
        .custom-scrollbar-horizontal::-webkit-scrollbar { height: 0; background: transparent; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default UserProfile;