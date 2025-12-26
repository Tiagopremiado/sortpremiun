
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RaffleDetail from './pages/RaffleDetail';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Winners from './pages/Winners';
import Affiliates from './pages/Affiliates';
import Casino from './pages/Casino';
import WinnerCelebration from './components/WinnerCelebration';
import YearEndRegModal from './components/YearEndRegModal';
import { Raffle, User, Order, RaffleStatus, WithdrawalRequest, Winner, SlotSymbol } from './types';
import { mockRaffles } from './services/mockData';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRaffleId, setSelectedRaffleId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isCasinoPayoutEnabled, setIsCasinoPayoutEnabled] = useState(true);
  const [casinoLiquidity, setCasinoLiquidity] = useState(1000);
  const [minesMaxPayout, setMinesMaxPayout] = useState(500);
  const [extraSpinPrice, setExtraSpinPrice] = useState(1.50);
  
  const [siteConfig, setSiteConfig] = useState({
    yearEndTargetDate: "2024-12-31T23:59:59",
    yearEndTitle: "SORTEIO DA",
    yearEndSubtitle: "VIRADA 2024",
  });

  const [tickerMessages, setTickerMessages] = useState(["BEM-VINDO À ESTÂNCIA DA SORTE!", "MAIS UM TÍTULO ACABA DE SER RESERVADO!"]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>(mockRaffles);
  const [wheelConfig, setWheelConfig] = useState([]);
  const [slotSymbols, setSlotSymbols] = useState<SlotSymbol[]>([]);

  const mapProfileToUser = (profile: any, authUser: any): User => {
    return {
      id: authUser.id,
      name: profile?.name || authUser.user_metadata?.name || 'Usuário',
      email: authUser.email || '',
      cpf: profile?.cpf || authUser.user_metadata?.cpf || '',
      role: profile?.role || authUser.user_metadata?.role || 'user',
      avatarUrl: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`,
      currentBalance: parseFloat(profile?.current_balance || 0),
      rewardPoints: parseInt(profile?.reward_points || 0),
      createdAt: profile?.created_at || authUser.created_at,
      isRegisteredForYearEnd: profile?.is_registered_for_year_end || false,
      yearEndTicket: profile?.year_end_ticket || '',
      hasSeenTour: profile?.has_seen_tour || false
    };
  };

  const loadSession = async () => {
    try {
      // Tenta buscar a sessão com um timeout manual implícito
      const sessionPromise = supabase.auth.getSession();
      const { data: { session }, error: sessionError } = await sessionPromise;
      
      if (sessionError) throw sessionError;

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(mapProfileToUser(profile, session.user));
      }
    } catch (err) {
      console.warn("Conexão com banco de dados limitada ou pendente de configuração:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // TIMER DE SEGURANÇA: Se em 5 segundos não carregar, libera a tela
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.log("Safety timer acionado: Forçando encerramento do loading.");
        setLoading(false);
      }
    }, 5000);

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUser(mapProfileToUser(profile, session.user));
          if (event === 'SIGNED_IN') setCurrentPage('home');
        } catch (e) {
          setUser(mapProfileToUser(null, session.user));
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleUpdateUser = async (updated: User) => {
    setUser(updated);
    try {
      await supabase.from('profiles').upsert({
        id: updated.id,
        name: updated.name,
        current_balance: updated.currentBalance,
        reward_points: updated.rewardPoints,
        has_seen_tour: updated.hasSeenTour,
        is_registered_for_year_end: updated.isRegisteredForYearEnd,
        year_end_ticket: updated.yearEndTicket
      });
    } catch (e) {
      console.error("Erro ao sincronizar perfil:", e);
    }
  };

  const handleNavigate = (page: string) => {
    if (!user && ['profile', 'admin', 'casino'].includes(page)) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-700 flex flex-col items-center justify-center text-white p-10 text-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
        <h1 className="text-xl font-black uppercase italic tracking-tighter">Estância da Sorte</h1>
        <p className="opacity-60 text-[10px] font-bold uppercase tracking-widest mt-2">Sincronizando...</p>
        <button 
          onClick={() => setLoading(false)}
          className="mt-8 text-[9px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
        >
          Entrar mesmo assim
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar 
        user={user} 
        isLoggedIn={!!user} 
        onNavigate={handleNavigate} 
        onAddBalance={() => handleNavigate('profile')} 
        onLogout={() => supabase.auth.signOut()}
        tickerMessages={tickerMessages} 
      />
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home 
            raffles={raffles.filter(r => r.status === RaffleStatus.ACTIVE)} 
            onRaffleClick={(id) => { setSelectedRaffleId(id); setCurrentPage('detail'); }} 
            onJoinYearEndAction={() => handleNavigate('profile')} 
            isParticipating={user?.isRegisteredForYearEnd}
            userTicket={user?.yearEndTicket}
            siteConfig={siteConfig}
            tickerMessages={tickerMessages}
          />
        )}
        
        {currentPage === 'login' && (
          <Login 
            onLogin={() => {}} 
            onBack={() => setCurrentPage('home')} 
            onNavigateToConfirm={() => setCurrentPage('home')} 
          />
        )}

        {currentPage === 'detail' && selectedRaffleId && (
          <RaffleDetail 
            raffle={raffles.find(r => r.id === selectedRaffleId)!} 
            onBack={() => setCurrentPage('home')} 
            onBuy={() => {
              if (!user) setCurrentPage('login');
              else alert("Integração de checkout em breve!");
            }} 
          />
        )}

        {currentPage === 'profile' && user && (
          <UserProfile 
            user={user} 
            allUsers={allUsers}
            orders={orders}
            raffles={raffles}
            withdrawals={withdrawals}
            onLogout={() => supabase.auth.signOut()}
            onUpdateUser={handleUpdateUser}
            onRequestWithdrawal={() => {}}
            onOpenDeposit={() => {}}
            onMarkRead={() => {}}
            wheelConfig={wheelConfig}
            extraSpinPrice={extraSpinPrice}
            onSpinWin={() => {}}
            onBuySpin={() => {}}
            isCasinoPayoutEnabled={isCasinoPayoutEnabled}
            casinoLiquidity={casinoLiquidity}
            onUpdateLiquidity={(amt, type) => setCasinoLiquidity(l => type === 'add' ? l + amt : l - amt)}
            minesMaxPayout={minesMaxPayout}
            siteConfig={siteConfig}
          />
        )}

        {currentPage === 'casino' && user && (
          <Casino 
            user={user}
            onUpdateUser={handleUpdateUser}
            onOpenDeposit={() => handleNavigate('profile')}
            isCasinoPayoutEnabled={isCasinoPayoutEnabled}
            casinoLiquidity={casinoLiquidity}
            onUpdateLiquidity={(amt, type) => setCasinoLiquidity(l => type === 'add' ? l + amt : l - amt)}
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
            onUpdateExtraSpinPrice={setExtraSpinPrice} onAddRaffle={() => {}} onUpdateRaffle={() => {}} 
            onUpdateWithdrawal={() => {}} onUpdateUser={handleUpdateUser} onDeleteUser={() => {}} 
            onSendNotification={() => {}} isCasinoPayoutEnabled={isCasinoPayoutEnabled} 
            onUpdateCasinoPayout={setIsCasinoPayoutEnabled} casinoLiquidity={casinoLiquidity} 
            onUpdateCasinoLiquidity={(amt, type) => setCasinoLiquidity(l => type === 'add' ? l + amt : l - amt)} 
            minesMaxPayout={minesMaxPayout} onUpdateMinesMaxPayout={setMinesMaxPayout} 
            siteConfig={siteConfig} onUpdateSiteConfig={setSiteConfig} 
            winners={winners} onUpdateWinners={setWinners}
          />
        )}
      </main>
    </div>
  );
};

export default App;
