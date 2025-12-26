
import React, { useState, useRef, useEffect } from 'react';
import { User, AppNotification } from '../types';

interface NavbarProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onAddBalance?: () => void;
  onLogout?: () => void;
  onMarkRead?: () => void;
  isLoggedIn: boolean;
  tickerMessages?: string[];
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onNavigate, 
  onAddBalance, 
  onLogout, 
  onMarkRead,
  isLoggedIn,
  tickerMessages = [] 
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = (user?.notifications || []).filter(n => !n.isRead).length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsProfileOpen(false);
    setIsNotifOpen(false);
  };

  const handleOpenNotifs = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
    if (!isNotifOpen && onMarkRead) onMarkRead();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative z-[60]">
      {/* Ticker bar superior - Desaparece ao rolar para dar foco à Nav Principal */}
      <div className={`bg-slate-900 text-white overflow-hidden transition-all duration-500 ${isScrolled ? 'h-0 opacity-0' : 'py-2 h-10 opacity-100'} border-b border-white/5 shadow-sm`}>
        <div className="whitespace-nowrap flex animate-[ticker_40s_linear_infinite] hover:pause">
          {[1, 2, 3].map(loop => (
            <div key={loop} className="flex items-center">
              {tickerMessages.map((msg, i) => (
                <div key={i} className="flex items-center gap-12 mx-6">
                  <span className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    {msg}
                  </span>
                  <span className="opacity-20 text-slate-500">/</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Nav Principal - Sticky e Reativa */}
      <nav 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'top-0 py-2 bg-white/80 backdrop-blur-2xl border-emerald-500/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] h-16' 
            : `top-${isScrolled ? '0' : '10'} py-4 bg-white/95 backdrop-blur-md border-slate-200 h-20`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full gap-4">
            
            {/* Logo com escala dinâmica */}
            <div 
              className={`flex items-center gap-2 cursor-pointer group flex-shrink-0 transition-transform duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`} 
              onClick={() => handleNav('home')}
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:rotate-12">$</div>
              <span className="hidden sm:block text-xl font-black tracking-tighter text-slate-800 uppercase">SORTEIO<span className="text-emerald-600">FÁCIL</span></span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <button onClick={() => handleNav('casino')} className={`px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-600 ${isScrolled ? 'scale-90' : 'scale-100'}`}>💎 ARENA VIP</button>
              <button onClick={() => handleNav('home')} className="text-slate-500 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-widest transition-colors">Sorteios</button>
              <button onClick={() => handleNav('afiliados')} className="text-slate-500 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-widest transition-colors">Afiliados</button>
              <button onClick={() => handleNav('ganhadores')} className="text-slate-500 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-widest transition-colors">Ganhadores</button>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-2 md:gap-4">
                  
                  {/* Sino de Notificação */}
                  <div className="relative" ref={notifRef}>
                    <button 
                      onClick={handleOpenNotifs}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${isNotifOpen ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-white animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {isNotifOpen && (
                      <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-24 md:top-full md:mt-3 md:w-80 bg-white rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.35)] border border-slate-100 py-6 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-4 duration-300 z-[100]">
                        <div className="px-6 pb-4 border-b border-slate-50 flex justify-between items-center">
                           <h3 className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest">Avisos e Novidades</h3>
                           <button onClick={() => handleNav('profile')} className="text-[9px] font-bold text-emerald-600 uppercase hover:underline">Ver Todas</button>
                        </div>
                        <div className="max-h-[65vh] md:max-h-96 overflow-y-auto custom-scrollbar">
                          {user.notifications && user.notifications.length > 0 ? (
                            user.notifications.slice(0, 10).map((notif) => (
                              <div key={notif.id} className="p-5 px-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex gap-4">
                                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${notif.isRead ? 'bg-transparent' : 'bg-emerald-500 shadow-[0_0_100px_#10b981]'}`} />
                                  <div className="flex-1">
                                    <p className={`text-[11px] font-black uppercase tracking-tight leading-tight mb-1 group-hover:text-emerald-600 transition-colors ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</p>
                                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3 font-medium">{notif.message}</p>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-12 text-center">
                              <span className="text-4xl block mb-3">🍃</span>
                              <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Nada pendente no momento</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Widget de Saldo e Avatar - Fica mais compacto ao rolar */}
                  <div className={`flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 pr-1.5 transition-all shadow-sm ${isScrolled ? 'scale-95' : 'scale-100'}`}>
                    <div className="flex items-center p-1 pr-3 group">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Saldo</span>
                        <span className="text-xs font-black text-slate-900 leading-none">R$ {user.currentBalance?.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={onAddBalance}
                        className="ml-3 w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform ${isScrolled ? 'scale-90' : 'scale-100'}`}
                      >
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </button>

                      {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 py-4 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
                          <div className="px-6 py-3 border-b border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Bem-vindo(a)</p>
                            <p className="text-xs font-black text-slate-900 truncate uppercase">{user.name}</p>
                          </div>
                          <div className="p-2">
                            <button onClick={() => handleNav('profile')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-widest transition-colors flex items-center gap-3">
                              👤 Perfil & Saldo
                            </button>
                            {user.role === 'admin' && (
                              <button onClick={() => handleNav('admin')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-3">
                                🛡️ Painel Admin
                              </button>
                            )}
                            <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-[10px] font-black text-red-500 uppercase tracking-widest transition-colors flex items-center gap-3">
                              🚪 Sair
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleNav('login')}
                  className={`bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-emerald-500/40 hover:scale-105 transition-all shadow-lg active:scale-95 ${isScrolled ? 'scale-90' : 'scale-100'}`}
                >
                  Entrar / Criar Conta
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer para evitar que o conteúdo suma embaixo da Nav Fixed */}
      <div className={`${isScrolled ? 'h-16' : 'h-20'}`}></div>
    </div>
  );
};

export default Navbar;