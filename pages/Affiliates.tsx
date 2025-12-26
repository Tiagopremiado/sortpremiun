
import React from 'react';
import { User } from '../types';

interface AffiliatesProps {
  onJoin: () => void;
  user?: User | null;
}

const Affiliates: React.FC<AffiliatesProps> = ({ onJoin, user }) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Foco em Renda */}
      <section className="relative py-24 overflow-hidden bg-slate-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            💸 TRABALHE DE ONDE QUISER
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            Transforme seus seguidores em <br/>
            <span className="text-emerald-500 italic">LUCRO REAL.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Seja um parceiro oficial do <strong>SORTEIO FÁCIL</strong>. Ganhe 10% de comissão em dinheiro e cotas grátis por cada venda realizada.
          </p>
          <button 
            onClick={onJoin}
            className="bg-emerald-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95"
          >
            {user?.isAffiliate ? 'VER MEU PAINEL DE AFILIADO' : 'QUERO COMEÇAR AGORA'}
          </button>
        </div>
      </section>

      {/* Por que ser afiliado? */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: 'Comissão Imbatível', 
              desc: 'Pagamos 10% de comissão direta em todas as compras. Vendou R$ 1.000,00, ganhou R$ 100,00 na hora.',
              icon: '💰'
            },
            { 
              title: 'Saques Rápidos via PIX', 
              desc: 'Não espere 30 dias. Solicite seu saque e receba o valor em sua conta em até 24h úteis.',
              icon: '⚡'
            },
            { 
              title: 'Suporte VIP', 
              desc: 'Materiais de divulgação prontos: vídeos, criativos e banners para você apenas postar e vender.',
              icon: '🤝'
            }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof do Sistema de Afiliados */}
      <section className="bg-slate-900 py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-16 tracking-tight">Nossos Top Afiliados deste mês</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '@influencer_x', sales: 'R$ 15.420', earned: 'R$ 1.542' },
              { name: '@sorteios_br', sales: 'R$ 8.900', earned: 'R$ 890' },
              { name: 'Marcos Almeida', sales: 'R$ 5.100', earned: 'R$ 510' },
              { name: 'Ana Silva', sales: 'R$ 4.850', earned: 'R$ 485' },
            ].map((aff, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                  {aff.name[1].toUpperCase()}
                </div>
                <p className="text-white font-black mb-1">{aff.name}</p>
                <p className="text-emerald-400 font-bold text-xl">{aff.earned}</p>
                <p className="text-slate-500 text-[10px] font-black uppercase mt-2">Ganhos em 30 dias</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter">Pronto para sua liberdade financeira?</h2>
        <p className="text-slate-500 mb-12 max-w-md mx-auto">Junte-se a mais de 500 parceiros que já lucram diariamente com o SORTEIO FÁCIL.</p>
        <button 
          onClick={onJoin}
          className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl"
        >
          {user?.isAffiliate ? 'ACESSAR MINHA CONTA' : 'CADASTRE-SE GRÁTIS'}
        </button>
      </section>
    </div>
  );
};

export default Affiliates;