
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Raffle, Order } from '../types';

interface GrowthAIComponentProps {
  raffles: Raffle[];
  orders: Order[];
}

const GrowthAIComponent: React.FC<GrowthAIComponentProps> = ({ raffles, orders }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'mentor' | 'creative' | 'bootstrap'>('mentor');

  const cleanJsonString = (str: string) => {
    // Remove possíveis blocos de código markdown que a IA possa enviar
    return str.replace(/```json/g, '').replace(/```/g, '').trim();
  };

  const askAI = async (customPrompt?: string) => {
    setLoading(true);
    setResponse(null); // Limpa resposta anterior para evitar conflitos de tipo na renderização
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentStats = `Temos ${raffles.length} sorteios ativos. Receita total de R$ ${orders.reduce((a, b) => a + b.totalValue, 0)}.`;
      
      let systemInstruction = "";
      if (activeMode === 'mentor') systemInstruction = "Você é um CMO (Chief Marketing Officer) especialista em rifas digitais. Analise os dados e dê estratégias agressivas e legais de crescimento. Responda estritamente em formato JSON conforme o schema.";
      if (activeMode === 'bootstrap') systemInstruction = "Você é um consultor financeiro de startups. Dê estratégias para criar sorteios com ZERO real no bolso, focando em parcerias e pré-vendas validadas.";
      if (activeMode === 'creative') systemInstruction = "Você é um Copywriter de alta conversão. Crie roteiros de vídeo para Reels, legendas e scripts de WhatsApp que vendem cota.";

      const finalPrompt = customPrompt || prompt;

      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Contexto: ${currentStats}. Pergunta/Tarefa: ${finalPrompt}`,
        config: {
          systemInstruction,
          responseMimeType: activeMode === 'mentor' ? "application/json" : "text/plain",
          responseSchema: activeMode === 'mentor' ? {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              actions: { type: Type.ARRAY, items: { type: Type.STRING } },
              prediction: { type: Type.STRING }
            },
            required: ["summary", "actions", "prediction"]
          } : undefined
        }
      });

      const textOutput = result.text || "";

      if (activeMode === 'mentor') {
        try {
          const cleaned = cleanJsonString(textOutput);
          setResponse(JSON.parse(cleaned));
        } catch (parseError) {
          console.error("Falha ao parsear JSON da IA:", parseError);
          // Fallback caso o JSON venha malformado para não quebrar a tela
          setResponse({
            summary: textOutput,
            actions: ["Tente refazer a pergunta de forma mais específica"],
            prediction: "Erro de processamento de dados"
          });
        }
      } else {
        setResponse(textOutput);
      }
    } catch (e) {
      console.error("Erro na Growth Engine:", e);
      alert("Houve um erro na comunicação com a IA. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Sidebar de Ferramentas */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <span className="text-emerald-400">⚡</span> Growth Engine
          </h3>
          <div className="space-y-2">
            {[
              { id: 'mentor', label: 'Mentor de Estratégia', desc: 'Análise de dados e metas' },
              { id: 'creative', label: 'Estúdio Criativo', desc: 'Copy e Roteiros de Venda' },
              { id: 'bootstrap', label: 'Manual Custo Zero', desc: 'Como começar sem dinheiro' }
            ].map(tool => (
              <button 
                key={tool.id}
                onClick={() => { setActiveMode(tool.id as any); setResponse(null); }}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${activeMode === tool.id ? 'bg-emerald-600 border-emerald-500 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              >
                <p className="font-black text-xs uppercase tracking-widest">{tool.label}</p>
                <p className="text-[10px] text-white/50 font-medium">{tool.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem]">
          <p className="text-[10px] font-black text-amber-600 uppercase mb-2">💡 Dica de IA</p>
          <p className="text-xs text-amber-800 font-medium leading-relaxed">
            "Sorteios de itens de desejo imediato (ex: PIX de R$ 1.000) tendem a vender 3x mais rápido que prêmios físicos para quem está começando agora."
          </p>
        </div>
      </div>

      {/* Área Principal de Trabalho */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 min-h-[500px] flex flex-col">
          
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">
              {activeMode === 'mentor' && 'Analista de Performance AI'}
              {activeMode === 'creative' && 'Copywriter Pro'}
              {activeMode === 'bootstrap' && 'Estrategista de Bootstrap'}
            </h2>
            <p className="text-slate-400 text-sm font-medium">IA Gemini 3 Pro treinada para o seu sucesso.</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Inteligência Processando...</p>
              </div>
            ) : response ? (
              <div className="animate-in fade-in duration-700">
                {activeMode === 'mentor' && typeof response === 'object' ? (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                      <p className="text-sm text-emerald-800 font-medium leading-relaxed">{response.summary || "Sem resumo disponível"}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Próximos Passos</p>
                        <ul className="space-y-3">
                          {Array.isArray(response.actions) ? response.actions.map((act: string, i: number) => (
                            <li key={i} className="flex gap-2 text-xs font-bold text-slate-700">
                              <span className="text-emerald-500">✓</span> {act}
                            </li>
                          )) : <li>Nenhuma ação sugerida.</li>}
                        </ul>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-3xl text-white">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Previsão</p>
                        <p className="text-xs font-medium leading-relaxed italic">"{response.prediction || "Previsão indisponível"}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 whitespace-pre-line text-sm text-slate-700 leading-relaxed font-medium">
                    {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="text-5xl mb-6">🤖</div>
                <h4 className="text-lg font-black text-slate-800 mb-2">Como posso te ajudar a lucrar hoje?</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Selecione uma categoria ao lado ou digite sua dúvida abaixo.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder={
                activeMode === 'mentor' ? "Como aumentar minhas vendas de hoje?" :
                activeMode === 'creative' ? "Crie um roteiro de Reels para um iPhone 15" :
                "Como faço meu primeiro sorteio sem ter o prêmio comprado?"
              }
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 font-bold text-slate-700"
              onKeyDown={e => e.key === 'Enter' && prompt && askAI()}
            />
            <button 
              onClick={() => askAI()}
              disabled={loading || !prompt}
              className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
            >
              Consultar
            </button>
          </div>

          {activeMode === 'bootstrap' && !response && !loading && (
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={() => askAI("Me dê 3 modelos de sorteios com parcerias locais onde eu não gasto nada")}
                className="text-[10px] font-black text-emerald-600 uppercase border border-emerald-100 p-3 rounded-xl hover:bg-emerald-50 transition-all"
              >
                Modelos de Parceria
              </button>
              <button 
                onClick={() => askAI("Como usar o sistema de 'Reserva Antecipada' para validar prêmios?")}
                className="text-[10px] font-black text-emerald-600 uppercase border border-emerald-100 p-3 rounded-xl hover:bg-emerald-50 transition-all"
              >
                Reserva Antecipada
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default GrowthAIComponent;