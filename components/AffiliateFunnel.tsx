
import React, { useState } from 'react';
import { User, AffiliateAutomation, DailyMission } from '../types';

interface ReferralWithStatus extends User {
  hasDeposited: boolean;
}

interface AffiliateFunnelProps {
  user: User;
  referrals?: ReferralWithStatus[];
  dailyMission?: DailyMission;
  onToggleAutomation: (id: string) => void;
}

const AffiliateFunnel: React.FC<AffiliateFunnelProps> = ({ user, referrals = [], dailyMission, onToggleAutomation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReferrals = referrals.filter(ref => 
    ref.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ref.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDepositors = referrals.filter(r => r.hasDeposited).length;

  const funnelSteps = [
    { label: 'Indicações', icon: '👥', desc: 'Usuários cadastrados', value: referrals.length },
    { label: 'Ativos', icon: '⚡', desc: 'Com primeiro depósito', value: totalDepositors },
    { label: 'Ganhos', icon: '💰', desc: 'Comissões totais', value: `R$ ${(totalDepositors * 5).toFixed(2)}` } // Exemplo de cálculo
  ];

  const defaultAutomations: AffiliateAutomation[] = [
    { id: '1', name: 'Sequência de Boas-vindas', type: 'email', status: 'active', description: 'Envia 3 e-mails automáticos após o cadastro.' },
    { id: '2', name: 'Recuperação de Pix', type: 'whatsapp', status: 'inactive', description: 'Mensagem automática se o lead gerar Pix e não pagar.' },
    { id: '3', name: 'Alerta de Escassez', type: 'push', status: 'active', description: 'Notifica quando o sorteio atinge 90% das vendas.' }
  ];

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?ref=${user.affiliateCode}`;
    navigator.clipboard.writeText(link);
    alert('Seu link de afiliado foi copiado!');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
      
      {/* Widget do Link de Afiliado */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-8 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="text-xl font-black text-emerald-900 uppercase italic tracking-tight mb-2">Seu Link de Convite</h4>
            <p className="text-emerald-700/70 text-sm font-medium">Compartilhe e ganhe bônus por cada novo usuário ativo.</p>
          </div>
          <div className="flex w-full md:w-auto gap-3">
             <div className="bg-white border border-emerald-200 px-6 py-4 rounded-2xl font-mono text-emerald-600 font-black text-sm flex-1 md:flex-none">
               ...{user.affiliateCode}
             </div>
             <button 
              onClick={handleCopyLink}
              className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
             >
               Copiar Link
             </button>
          </div>
        </div>
      </section>

      {/* Visualização do Funil */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Painel de Performance</h4>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic">Seus Resultados</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 p-6 text-4xl opacity-10 group-hover:scale-125 transition-transform">{step.icon}</div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{step.label}</p>
              <p className="text-4xl font-black text-slate-900 mb-2">{step.value}</p>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">{step.desc}</p>
              <div className="mt-6 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (Number(step.value) || 0) * 10)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LISTA DETALHADA DE INDICADOS */}
      <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden">
         <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h4 className="text-xl font-black text-slate-900 uppercase italic mb-1">Minha Rede de Indicados</h4>
               <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Acompanhe quem já entrou pelo seu link</p>
            </div>
            <div className="relative w-full md:w-64">
               <input 
                type="text" 
                placeholder="Buscar por nome..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl text-xs font-bold focus:border-emerald-500 outline-none transition-all"
               />
               <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50">
                  <tr>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">INDICADO</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">CADASTRO EM</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">STATUS DEPÓSITO</th>
                     <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">POTENCIAL</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredReferrals.length > 0 ? filteredReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                       <td className="p-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                                <img src={ref.avatarUrl} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="font-black text-slate-800 text-xs uppercase">{ref.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{ref.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-6 text-center">
                          <span className="text-[10px] font-bold text-slate-500">{new Date(ref.createdAt).toLocaleDateString('pt-BR')}</span>
                       </td>
                       <td className="p-6 text-center">
                          {ref.hasDeposited ? (
                            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-emerald-100">
                               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                               Primeiro Depósito OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-slate-100">
                               Aguardando Depósito
                            </span>
                          )}
                       </td>
                       <td className="p-6 text-right">
                          <p className={`font-black text-xs ${ref.hasDeposited ? 'text-emerald-600' : 'text-slate-300'}`}>
                             {ref.hasDeposited ? '+ R$ 5,00' : 'R$ 0,00'}
                          </p>
                       </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={4} className="p-20 text-center">
                          <div className="flex flex-col items-center opacity-30">
                             <span className="text-6xl mb-6">🏜️</span>
                             <p className="text-xs font-black uppercase tracking-widest italic">Nenhum indicado encontrado</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>

      {/* Missões Diárias (Engagement) - AGORA DINÂMICA */}
      {dailyMission && (
        <section className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-8 animate-in zoom-in duration-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🚀</div>
            <div>
              <h4 className="text-lg font-black text-slate-900 leading-tight">{dailyMission.title}</h4>
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Bônus: {dailyMission.reward} ao completar</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-600 font-medium text-sm">"{dailyMission.description}"</p>
            <button className="whitespace-nowrap bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all">
              Já Completei!
            </button>
          </div>
        </section>
      )}

      {/* Gestão de Automações */}
      <section className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-2xl font-black mb-1">Automações Inteligentes</h4>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Deixe a tecnologia vender por você</p>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-emerald-500/20">
              Módulo Pro Ativado
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {defaultAutomations.map(auto => (
              <div key={auto.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${auto.type === 'email' ? 'bg-blue-500/20 text-blue-400' : auto.type === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {auto.type === 'email' ? '📧' : auto.type === 'whatsapp' ? '💬' : '🔔'}
                  </div>
                  <div>
                    <h5 className="font-black text-lg">{auto.name}</h5>
                    <p className="text-slate-500 text-xs font-medium">{auto.description}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => onToggleAutomation(auto.id)}
                  className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${auto.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-400'}`}
                >
                  {auto.status === 'active' ? '● Ativo' : '○ Pausado'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AffiliateFunnel;