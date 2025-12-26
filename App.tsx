import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RaffleDetail from './pages/RaffleDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Winners from './pages/Winners';
import Affiliates from './pages/Affiliates';
import Casino from './pages/Casino';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import CheckoutModal from './components/CheckoutModal';
import DepositModal from './components/DepositModal';
import WinnerCelebration from './components/WinnerCelebration';
import YearEndRegModal from './components/YearEndRegModal';
import { Raffle, User, Order, RaffleStatus, WithdrawalRequest, WheelWin, Winner, AppNotification, SlotSymbol } from './types';
import { mockRaffles, mockWinners, mockOrders } from './services/mockData';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRaffleId, setSelectedRaffleId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempEmail, setTempEmail] = useState('');
  
  // Modais de Fim de Ano
  const [showYearEndModal, setShowYearEndModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ title: '', message: '', ticket: '' });
  const [registeringYearEnd, setRegisteringYearEnd] = useState(false);
  
  // Estados Administrativos
  const [isCasinoPayoutEnabled, setIsCasinoPayoutEnabled] = useState(true);
  const [houseRetentionPercentage, setHouseRetentionPercentage] = useState(20);
  const [extraSpinPrice, setExtraSpinPrice] = useState(1.50);
  const [casinoLiquidity, setCasinoLiquidity] = useState(1000);
  const [minesMaxPayout, setMinesMaxPayout] = useState(500);
  
  // Configuração Inicial dos Slots (Tigrinho style)
  const [slotSymbols, setSlotSymbols] = useState<SlotSymbol[]>([
    { id: '1', icon: '🐯', multiplier: 50, label: 'Tigre Dourado', frequency: 2 },
    { id: '2', icon: '💎', multiplier: 20, label: 'Diamante', frequency: 5 },
    { id: '3', icon: '🧧', multiplier: 10, label: 'Envelope Vermelho', frequency: 10 },
    { id: '4', icon: '💰', multiplier: 5, label: 'Saco de Ouro', frequency: 15 },
    { id: '5', icon: '🍊', multiplier: 2, label: 'Laranja', frequency: 30 },
    { id: '6', icon: '🎆', multiplier: 1, label: 'Fogos', frequency: 40 }
  ]);
  
  const [wheelConfig, setWheelConfig] = useState([
    { id: 1, label: '100 PONTOS', color: '#10b981', type: 'points', value: 100, dailyLimit: 50, remaining: 50 },
    { id: 2, label: 'R$ 5,00 PIX', color: '#1e293b', type: 'pix', value: 5, dailyLimit: 5, remaining: 5 },
    { id: 3, label: '500 PONTOS', color: '#10b981', type: 'points', value: 500, dailyLimit: 20, remaining: 20 },
    { id: 4, label: 'SORTEIO GRÁTIS', color: '#1e293b', type: 'tickets', value: 1, dailyLimit: 10, remaining: 10 },
    { id: 5, label: '200 PONTOS', color: '#10b981', type: 'points', value: 200, dailyLimit: 40, remaining: 40 },
    { id: 6, label: 'TENTE DE NOVO', color: '#1e293b', type: 'nothing', value: 0, dailyLimit: 0, remaining: 0 },
    { id: 7, label: 'R$ 10,00 PIX', color: '#10b981', type: 'pix', value: 10, dailyLimit: 2, remaining: 2 },
    { id: 8, label: '1000 PONTOS', color: '#1e293b', type: 'points', value: 1000, dailyLimit: 5, remaining: 5 },
  ]);

  const [siteConfig, setSiteConfig] = useState({
    heroTitle: "NATAL PREMIADO",
    heroSubtitle: "ESTÂNCIA DA SORTE!",
    heroDescription: "O sistema de rifas mais seguro do Brasil. Resultados baseados na Loteria Federal.",
    userAnnouncement: "❄️ APROVEITE: Bônus de 10% em todos os depósitos via PIX realizados hoje!",
    yearEndTitle: "SORTEIO DA",
    yearEndSubtitle: "VIRADA 2024",
    yearEndDescription: "Cadastre-se gratuitamente na nossa ação especial e concorra ao prêmio principal do dia 31/12.",
    yearEndTargetDate: "2024-12-31T23:59:59",
    yearEndBannerUrl: "",
    dailyMission: { title: "Missão do Dia", description: "Compartilhe seu link.", reward: "+R$ 10,00" }
  });

  const [tickerMessages, setTickerMessages] = useState(["BEM-VINDO À ESTÂNCIA DA SORTE!", "MAIS UM TÍTULO ACABA DE SER RESERVADO!"]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>(mockRaffles);

  const mapProfileToUser = (profile: any): User => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    cpf: profile.cpf,
    role: profile.role,
    avatarUrl: profile.avatar_url || 'https://via.placeholder.com/150',
    currentBalance: parseFloat(profile.current_balance || 0),
    rewardPoints: parseInt(profile.reward_points || 0),
    createdAt: profile.created_at || new Date().toISOString(),
    isRegisteredForYearEnd: profile.is_registered_for_year_end,
    yearEndTicket: profile.year_end_ticket,
    hasSeenTour: profile.has_seen_tour,
    affiliateCode: profile.affiliate_code,
    referredBy: profile.referred_by,
    lastSpinDate: profile.last_spin_date
  });

  const fetchAppData = async (userId?: string) => {
    try {
      const [
        { data: dbRaffles },
        { data: dbWinners },
        { data: dbWithdrawals },
        { data: dbUsers },
        { data: dbOrders }
      ] = await Promise.all([
        supabase.from('raffles').select('*').order('created_at', { ascending: false }),
        supabase.from('winners').select('*').order('created_at', { ascending: false }),
        supabase.from('withdrawals').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);

      if (dbRaffles) setRaffles(dbRaffles as any);
      if (dbWinners) setWinners(dbWinners as any);
      if (dbWithdrawals) setWithdrawals(dbWithdrawals as any);
      if (dbUsers) setAllUsers(dbUsers.map(mapProfileToUser));
      if (dbOrders) setOrders(dbOrders as any);

      const { data: dbWheel } = await supabase.from('wheel_config').select('*').order('id', { ascending: true });
      if (dbWheel?.length) {
        setWheelConfig(dbWheel.map(w => ({
          id: w.id, 
          label: w.label, 
          color: w.color, 
          type: w.prize_type, 
          value: Number(w.prize_value),
          dailyLimit: w.daily_limit, 
          remaining: w.remaining
        })));
      }

      // Tentar carregar configuração de slots se existir no banco
      const { data: dbSlots } = await supabase.from('slot_config').select('*').order('multiplier', { ascending: false });
      if (dbSlots && dbSlots.length > 0) {
        setSlotSymbols(dbSlots.map(s => ({
          id: s.id,
          icon: s.icon,
          multiplier: Number(s.multiplier),
          label: s.label,
          frequency: Number(s.frequency)
        })));
      }

      const { data: dbSpinPrice } = await supabase.from('site_settings').select('setting_value').eq('setting_key', 'extra_spin_price').single();
      if (dbSpinPrice) setExtraSpinPrice(Number(dbSpinPrice.setting_value));

    } catch (err) {
      console.warn("Erro ao carregar alguns dados (usando mocks):", err);
    }
  };

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const initSupabase = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) setUser(mapProfileToUser(profile));
        }
        
        await fetchAppData();
      } catch (err) {
        console.error("Erro na inicialização do Supabase:", err);
      } finally {
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    };

    initSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) {
            setUser(mapProfileToUser(profile));
            await fetchAppData();
            handleNavigate('home');
          }
        } catch (e) {
          console.error("Erro ao buscar perfil após login:", e);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        handleNavigate('home');
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleUpdateUser = async (updated: User) => {
    const payload = {
      name: updated.name,
      email: updated.email,
      cpf: updated.cpf,
      role: updated.role,
      avatar_url: updated.avatarUrl, 
      current_balance: Number(updated.currentBalance),
      reward_points: Math.round(Number(updated.rewardPoints)),
      has_seen_tour: updated.hasSeenTour,
      is_registered_for_year_end: updated.isRegisteredForYearEnd,
      year_end_ticket: updated.yearEndTicket,
      last_spin_date: updated.lastSpinDate
    };

    const { error } = await supabase.from('profiles').update(payload).eq('id', updated.id);
    
    if (!error) {
      setAllUsers(allUsers.map(u => u.id === updated.id ? updated : u));
      if (user?.id === updated.id) {
        setUser(updated);
      }
    } else {
      console.error("Erro ao atualizar usuário no Supabase:", error);
      alert("Erro ao salvar alterações no servidor.");
    }
  };

  const handleAddRaffle = async (newRaffle: Raffle) => {
    const { error } = await supabase.from('raffles').insert([{
      title: newRaffle.title,
      description: newRaffle.description,
      prize_image: newRaffle.prizeImage,
      ticket_price: newRaffle.ticketPrice,
      total_tickets: newRaffle.totalTickets,
      status: newRaffle.status,
      draw_date: newRaffle.drawDate,
      min_tickets_per_user: newRaffle.minTicketsPerUser,
      max_tickets_per_user: newRaffle.maxTicketsPerUser
    }]);

    setRaffles([newRaffle, ...raffles]);
    if (error) console.error("Error adding raffle:", error);
  };

  const handleUpdateRaffle = async (updatedRaffle: Raffle) => {
    const { error } = await supabase.from('raffles').update({
      title: updatedRaffle.title,
      description: updatedRaffle.description,
      prize_image: updatedRaffle.prizeImage,
      ticket_price: updatedRaffle.ticketPrice,
      total_tickets: updatedRaffle.totalTickets,
      status: updatedRaffle.status,
      draw_date: updatedRaffle.drawDate,
      min_tickets_per_user: updatedRaffle.minTicketsPerUser,
      max_tickets_per_user: updatedRaffle.maxTicketsPerUser,
      winner_ticket: updatedRaffle.winnerTicket,
      winner_name: updatedRaffle.winnerName
    }).eq('id', updatedRaffle.id);

    setRaffles(raffles.map(r => r.id === updatedRaffle.id ? updatedRaffle : r));
    if (error) console.error("Error updating raffle:", error);
  };

  const handleUpdateWithdrawal = async (id: string, status: 'paid' | 'rejected') => {
    const { error } = await supabase.from('withdrawals').update({ status }).eq('id', id);
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status } : w));
    if (error) console.error("Error updating withdrawal:", error);
  };

  const handleSpinWin = (prize: any) => {
    if (!user) return;
    const updatedUser = { ...user };
    const prizeValue = Number(prize.value);
    
    if (prize.type === 'pix') {
      updatedUser.currentBalance = (Number(updatedUser.currentBalance) || 0) + prizeValue;
    } else if (prize.type === 'points') {
      updatedUser.rewardPoints = (Number(updatedUser.rewardPoints) || 0) + prizeValue;
    }
    
    updatedUser.lastSpinDate = new Date().toISOString();
    handleUpdateUser(updatedUser);
  };

  const handlePurchaseSpin = () => {
    if (!user || (user.currentBalance || 0) < extraSpinPrice) return;
    const updatedUser = { 
      ...user, 
      currentBalance: (user.currentBalance || 0) - extraSpinPrice 
    };
    handleUpdateUser(updatedUser);
  };

  const handleDeleteUser = async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (!error) setAllUsers(allUsers.filter(u => u.id !== id));
  };

  const handleSendNotification = async (target: 'all' | string, notif: Partial<AppNotification>) => {
    alert(`Notificação "${notif.title}" enviada para ${target === 'all' ? 'todos os usuários' : target}`);
  };

  const handleNavigate = (page: string) => {
    if ((page === 'profile' || page === 'admin' || page === 'casino') && !user) setCurrentPage('login');
    else setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Lógica Sorteio de Fim de Ano ---
  const handleOpenYearEnd = () => {
    if (!user) {
      setCurrentPage('login');
      return;
    }
    if (user.isRegisteredForYearEnd) {
      // Se já estiver participando, apenas mostra a celebração com o ticket
      setCelebrationData({
        title: 'Você já está dentro!',
        message: 'Seu ticket já está garantido para o grande sorteio.',
        ticket: user.yearEndTicket || '----'
      });
      setShowCelebration(true);
    } else {
      setShowYearEndModal(true);
    }
  };

  const handleConfirmYearEnd = async () => {
    if (!user) return;
    setRegisteringYearEnd(true);
    
    // Gera ticket aleatório de 6 dígitos
    const ticket = Math.floor(100000 + Math.random() * 900000).toString();
    
    const updatedUser = {
      ...user,
      isRegisteredForYearEnd: true,
      yearEndTicket: ticket
    };

    // Salva no banco
    await handleUpdateUser(updatedUser);
    
    setRegisteringYearEnd(false);
    setShowYearEndModal(false);
    
    // Mostra celebração
    setCelebrationData({
      title: 'Presença Confirmada!',
      message: 'Parabéns! Você já está concorrendo ao prêmio de R$ 50.000,00 da virada.',
      ticket: ticket
    });
    setShowCelebration(true);
  };
  // ------------------------------------

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black italic">ESTÂNCIA CARREGANDO...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar user={user} isLoggedIn={!!user} onNavigate={handleNavigate} onAddBalance={() => setCurrentPage('profile')} onLogout={async () => { await supabase.auth.signOut(); setUser(null); }} tickerMessages={tickerMessages} />
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home 
            raffles={raffles.filter(r => r.status === RaffleStatus.ACTIVE)} 
            onRaffleClick={(id) => { setSelectedRaffleId(id); setCurrentPage('detail'); }} 
            onJoinYearEndAction={handleOpenYearEnd} 
            isParticipating={user?.isRegisteredForYearEnd} 
            userTicket={user?.yearEndTicket}
            tickerMessages={tickerMessages} 
            siteConfig={siteConfig} 
          />
        )}
        {currentPage === 'login' && <Login onLogin={(u) => { handleNavigate('home'); }} onBack={() => setCurrentPage('home')} onNavigateToConfirm={(email) => { setTempEmail(email); setCurrentPage('confirm-email'); }} />}
        {currentPage === 'detail' && selectedRaffleId && <RaffleDetail raffle={raffles.find(r => r.id === selectedRaffleId)!} onBack={() => setCurrentPage('home')} onBuy={() => {}} />}
        {currentPage === 'profile' && user && (
          <UserProfile 
            user={user} 
            allUsers={allUsers} 
            orders={orders} 
            raffles={raffles} 
            withdrawals={withdrawals} 
            onLogout={async () => { await supabase.auth.signOut(); setUser(null); }} 
            onUpdateUser={handleUpdateUser} 
            onRequestWithdrawal={() => {}} 
            onOpenDeposit={() => {}} 
            wheelConfig={wheelConfig} 
            extraSpinPrice={extraSpinPrice} 
            onSpinWin={handleSpinWin} 
            onBuySpin={() => {}} 
            onPurchaseSpin={handlePurchaseSpin}
            isCasinoPayoutEnabled={isCasinoPayoutEnabled} 
            casinoLiquidity={casinoLiquidity} 
            onUpdateLiquidity={(amt, type) => setCasinoLiquidity(type === 'add' ? casinoLiquidity + amt : casinoLiquidity - amt)} 
            minesMaxPayout={minesMaxPayout} 
            siteConfig={siteConfig} 
            onMarkRead={() => {}} 
          />
        )}
        {currentPage === 'casino' && user && (
          <Casino 
             user={user}
             onUpdateUser={handleUpdateUser}
             onOpenDeposit={() => setCurrentPage('profile')}
             isCasinoPayoutEnabled={isCasinoPayoutEnabled}
             casinoLiquidity={casinoLiquidity}
             onUpdateLiquidity={(amt, type) => setCasinoLiquidity(type === 'add' ? casinoLiquidity + amt : casinoLiquidity - amt)}
             minesMaxPayout={minesMaxPayout}
             slotSymbols={slotSymbols}
          />
        )}
        {currentPage === 'ganhadores' && <Winners winners={winners} raffles={raffles} />}
        {currentPage === 'afiliados' && <Affiliates onJoin={() => handleNavigate('profile')} user={user} />}
        {currentPage === 'admin' && user?.role === 'admin' && (
          <AdminDashboard 
            raffles={raffles} orders={orders} withdrawals={withdrawals} users={allUsers} 
            wheelConfig={wheelConfig} extraSpinPrice={extraSpinPrice} onUpdateWheelConfig={setWheelConfig} 
            onUpdateExtraSpinPrice={setExtraSpinPrice} onAddRaffle={handleAddRaffle} onUpdateRaffle={handleUpdateRaffle} 
            onUpdateWithdrawal={handleUpdateWithdrawal} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} 
            onSendNotification={handleSendNotification} isCasinoPayoutEnabled={isCasinoPayoutEnabled} 
            onUpdateCasinoPayout={setIsCasinoPayoutEnabled} casinoLiquidity={casinoLiquidity} 
            onUpdateCasinoLiquidity={(amt, type) => setCasinoLiquidity(type === 'add' ? casinoLiquidity + amt : casinoLiquidity - amt)} 
            minesMaxPayout={minesMaxPayout} onUpdateMinesMaxPayout={setMinesMaxPayout} 
            tickerMessages={tickerMessages} onUpdateTickerMessages={setTickerMessages} 
            siteConfig={siteConfig} onUpdateSiteConfig={setSiteConfig} 
            winners={winners} onUpdateWinners={setWinners} houseRetention={houseRetentionPercentage} 
            onUpdateHouseRetention={setHouseRetentionPercentage}
            slotSymbols={slotSymbols}
            onUpdateSlotSymbols={setSlotSymbols}
          />
        )}
      </main>

      {/* Modais Globais */}
      <YearEndRegModal 
        isOpen={showYearEndModal} 
        onClose={() => setShowYearEndModal(false)} 
        onConfirm={handleConfirmYearEnd} 
        loading={registeringYearEnd} 
      />
      
      <WinnerCelebration 
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={celebrationData.title}
        message={celebrationData.message}
        ticketNumber={celebrationData.ticket}
      />
    </div>
  );
};

export default App;