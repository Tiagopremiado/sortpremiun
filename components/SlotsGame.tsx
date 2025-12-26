import React, { useState, useEffect, useRef } from 'react';
import { SlotSymbol } from '../types';

interface SlotsGameProps {
  userBalance: number;
  onUpdateBalance: (newBalance: number) => void;
  onWin: (amount: number) => void;
  onRecordTransaction?: (type: 'slot_bet' | 'slot_win', amount: number) => void;
  onOpenDeposit: () => void;
  symbols: SlotSymbol[];
  isCasinoPayoutEnabled: boolean;
  casinoLiquidity: number;
  onUpdateLiquidity: (amount: number, type: 'add' | 'remove') => void;
}

const SlotsGame: React.FC<SlotsGameProps> = ({
  userBalance,
  onUpdateBalance,
  onWin,
  onRecordTransaction,
  onOpenDeposit,
  symbols,
  isCasinoPayoutEnabled,
  casinoLiquidity,
  onUpdateLiquidity
}) => {
  const [betAmount, setBetAmount] = useState(1.00);
  const [isSpinning, setIsSpinning] = useState(false);
  const [grid, setGrid] = useState<SlotSymbol[][]>([]);
  const [winLines, setWinLines] = useState<number[]>([]); // Índices das linhas vencedoras (0,1,2 ou diagonais)
  const [lastWinAmount, setLastWinAmount] = useState(0);
  const [isTurbo, setIsTurbo] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const autoSpinRef = useRef<any>(null);

  // Inicializa o grid
  useEffect(() => {
    generateRandomGrid();
  }, []);

  const generateRandomGrid = () => {
    const newGrid: SlotSymbol[][] = [];
    for (let i = 0; i < 3; i++) {
      const row: SlotSymbol[] = [];
      for (let j = 0; j < 3; j++) {
        row.push(getRandomSymbol());
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  const getRandomSymbol = () => {
    // Lógica ponderada simples: expande o array baseado na frequência (inverso do multiplicador ou manual)
    // Aqui usaremos uma lógica simples: Símbolos com menor multiplicador aparecem mais
    const weightedSymbols: SlotSymbol[] = [];
    symbols.forEach(s => {
      // Quanto menor o multi, mais chance. Ex: Multi 2x -> peso 50. Multi 100x -> peso 1.
      const weight = Math.max(1, Math.round(100 / s.multiplier));
      for(let i=0; i<weight; i++) weightedSymbols.push(s);
    });
    return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
  };

  const handleSpin = async () => {
    if (isSpinning) return;
    if (!isCasinoPayoutEnabled) {
      alert("Manutenção: Jogos pausados temporariamente.");
      setIsAuto(false);
      return;
    }
    if (userBalance < betAmount) {
      setIsAuto(false);
      onOpenDeposit();
      return;
    }

    // Deduzir aposta
    const newBalance = userBalance - betAmount;
    onUpdateBalance(newBalance);
    if (onRecordTransaction) onRecordTransaction('slot_bet', betAmount);
    onUpdateLiquidity(betAmount, 'add'); // Aposta vai para a liquidez da casa

    setIsSpinning(true);
    setWinLines([]);
    setLastWinAmount(0);

    // Tempo de giro (Turbo = mais rápido)
    const spinDuration = isTurbo ? 300 : 2000;

    // Simulação visual do giro (CSS handles animation, we just wait)
    await new Promise(resolve => setTimeout(resolve, spinDuration));

    // Gerar resultado final
    const finalGrid: SlotSymbol[][] = [];
    for (let i = 0; i < 3; i++) {
      const row: SlotSymbol[] = [];
      for (let j = 0; j < 3; j++) {
        row.push(getRandomSymbol());
      }
      finalGrid.push(row);
    }
    setGrid(finalGrid);
    
    checkWin(finalGrid);
    setIsSpinning(false);
  };

  const checkWin = (currentGrid: SlotSymbol[][]) => {
    let totalWin = 0;
    const linesWon: number[] = [];

    // Verificações: 3 Linhas Horizontais
    for (let row = 0; row < 3; row++) {
      if (currentGrid[row][0].id === currentGrid[row][1].id && currentGrid[row][1].id === currentGrid[row][2].id) {
        const symbol = currentGrid[row][0];
        totalWin += betAmount * symbol.multiplier;
        linesWon.push(row); // 0, 1, 2 para linhas
      }
    }

    // Diagonais
    // Diagonal 1: 0,0 - 1,1 - 2,2
    if (currentGrid[0][0].id === currentGrid[1][1].id && currentGrid[1][1].id === currentGrid[2][2].id) {
       const symbol = currentGrid[0][0];
       totalWin += betAmount * symbol.multiplier;
       linesWon.push(3); // 3 para diagonal principal
    }
    // Diagonal 2: 0,2 - 1,1 - 2,0
    if (currentGrid[0][2].id === currentGrid[1][1].id && currentGrid[1][1].id === currentGrid[2][0].id) {
       const symbol = currentGrid[0][2];
       totalWin += betAmount * symbol.multiplier;
       linesWon.push(4); // 4 para diagonal secundária
    }

    if (totalWin > 0) {
      // Verificar liquidez da casa
      if (totalWin > casinoLiquidity) {
         // Fallback de segurança: se a casa não pode pagar, força perda (raríssimo se configurado corretamente)
         // Em produção real, o RNG deve ser validado antes de mostrar o spin.
         // Aqui, apenas limitamos o ganho ao teto se necessário ou assumimos o risco.
         // Vamos apenas pagar e deixar a liquidez negativa para o Admin resolver (transparência).
      }
      
      setLastWinAmount(totalWin);
      setWinLines(linesWon);
      onWin(totalWin);
      if (onRecordTransaction) onRecordTransaction('slot_win', totalWin);
      onUpdateLiquidity(totalWin, 'remove');
    }
  };

  // Efeito Auto Spin
  useEffect(() => {
    if (isAuto && !isSpinning && userBalance >= betAmount) {
      autoSpinRef.current = setTimeout(() => {
        handleSpin();
      }, 1000); // Delay entre giros
    } else if (userBalance < betAmount) {
      setIsAuto(false);
    }
    return () => {
      if (autoSpinRef.current) clearTimeout(autoSpinRef.current);
    };
  }, [isAuto, isSpinning, userBalance, betAmount]);

  return (
    <div className="flex flex-col items-center justify-center relative min-h-[600px] w-full max-w-lg mx-auto">
      
      {/* Decoração Topo */}
      <div className="w-full bg-[#9f111b] rounded-t-[3rem] p-4 border-4 border-amber-400 border-b-0 shadow-2xl relative z-10 flex flex-col items-center">
        <div className="bg-amber-500 text-[#500a0f] px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg border-2 border-amber-200 mb-2">
          ROYAL FORTUNE
        </div>
        <div className="flex items-center gap-4 w-full justify-between px-4">
          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/10">
             <p className="text-[9px] text-amber-200 uppercase font-bold">MULTIPLICADOR</p>
             <p className="text-white font-black text-sm">ATÉ 500x</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full flex items-center justify-center border-4 border-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse">
             <span className="text-3xl">🐯</span>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/10 text-right">
             <p className="text-[9px] text-amber-200 uppercase font-bold">GANHO ÚLTIMO</p>
             <p className="text-emerald-400 font-black text-sm">R$ {lastWinAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Área dos Reels (Rolos) */}
      <div className="relative bg-[#500a0f] p-4 pb-8 border-x-4 border-amber-500 w-full shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
         {/* Grid 3x3 */}
         <div className="grid grid-cols-3 gap-2 bg-[#2a0406] p-3 rounded-2xl border-2 border-amber-600/50 relative">
            
            {/* Linhas de Pagamento (Visualização) */}
            {winLines.includes(0) && <div className="absolute top-[16%] left-0 w-full h-1 bg-white shadow-[0_0_10px_#fff] z-20 animate-pulse" />}
            {winLines.includes(1) && <div className="absolute top-[50%] left-0 w-full h-1 bg-white shadow-[0_0_10px_#fff] z-20 animate-pulse" />}
            {winLines.includes(2) && <div className="absolute bottom-[16%] left-0 w-full h-1 bg-white shadow-[0_0_10px_#fff] z-20 animate-pulse" />}
            {winLines.includes(3) && <div className="absolute top-0 left-0 w-[140%] h-1 bg-white shadow-[0_0_10px_#fff] z-20 animate-pulse origin-top-left rotate-[45deg]" />}
            {winLines.includes(4) && <div className="absolute top-0 right-0 w-[140%] h-1 bg-white shadow-[0_0_10px_#fff] z-20 animate-pulse origin-top-right -rotate-[45deg]" />}

            {grid.map((row, rowIndex) => (
               row.map((symbol, colIndex) => (
                 <div 
                   key={`${rowIndex}-${colIndex}`} 
                   className={`
                      aspect-[3/4] bg-gradient-to-b from-[#fff5d0] to-[#e6c880] rounded-xl flex flex-col items-center justify-center border border-amber-200 shadow-inner relative overflow-hidden
                      ${isSpinning ? 'blur-sm scale-95 opacity-80 transition-all duration-300' : 'scale-100 opacity-100'}
                      ${winLines.length > 0 && !winLines.some(line => {
                         // Lógica visual para destacar apenas os vencedores (simplificada: se ganhou, brilha tudo que participou)
                         if (line === 0 && rowIndex === 0) return true;
                         if (line === 1 && rowIndex === 1) return true;
                         if (line === 2 && rowIndex === 2) return true;
                         if (line === 3 && rowIndex === colIndex) return true;
                         if (line === 4 && rowIndex + colIndex === 2) return true;
                         return false;
                      }) ? 'brightness-50' : ''}
                   `}
                 >
                    {/* Efeito de Rolo Girando */}
                    {isSpinning && (
                       <div className="absolute inset-0 flex flex-col items-center animate-slot-spin opacity-50">
                          <span className="text-4xl my-2">💎</span>
                          <span className="text-4xl my-2">🍊</span>
                          <span className="text-4xl my-2">🐯</span>
                       </div>
                    )}

                    {!isSpinning && (
                       <>
                         <span className="text-5xl drop-shadow-md filter">{symbol.icon}</span>
                         {/* Multiplicador pequeno no canto */}
                         <span className="absolute bottom-1 right-1 text-[8px] font-black text-amber-900 bg-amber-300/50 px-1 rounded">{symbol.multiplier}x</span>
                       </>
                    )}
                 </div>
               ))
            ))}
         </div>
      </div>

      {/* Controles Inferiores */}
      <div className="w-full bg-[#9f111b] rounded-b-[3rem] p-6 border-4 border-t-0 border-amber-400 shadow-2xl relative z-10">
         
         <div className="flex justify-between items-center mb-6 px-2">
            <div className="text-center">
               <p className="text-[9px] font-black text-amber-200 uppercase mb-1">APOSTA</p>
               <div className="flex items-center gap-2 bg-black/30 rounded-full px-1 py-1">
                  <button onClick={() => setBetAmount(Math.max(0.5, betAmount - 0.5))} disabled={isSpinning || isAuto} className="w-8 h-8 bg-amber-600 rounded-full text-white font-black hover:bg-amber-500 disabled:opacity-50">-</button>
                  <span className="w-20 text-center font-black text-white text-lg">R$ {betAmount.toFixed(2)}</span>
                  <button onClick={() => setBetAmount(betAmount + 0.5)} disabled={isSpinning || isAuto} className="w-8 h-8 bg-emerald-600 rounded-full text-white font-black hover:bg-emerald-500 disabled:opacity-50">+</button>
               </div>
            </div>
            <div className="flex gap-2">
               <button 
                  onClick={() => setIsTurbo(!isTurbo)} 
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all ${isTurbo ? 'bg-amber-500 border-amber-200 text-amber-900' : 'bg-black/30 border-white/10 text-white/50'}`}
               >
                  <span className="text-xl">⚡</span>
                  <span className="text-[8px] font-black uppercase">TURBO</span>
               </button>
               <button 
                  onClick={() => setIsAuto(!isAuto)} 
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all ${isAuto ? 'bg-emerald-500 border-emerald-200 text-emerald-900' : 'bg-black/30 border-white/10 text-white/50'}`}
               >
                  <span className="text-xl">🔄</span>
                  <span className="text-[8px] font-black uppercase">AUTO</span>
               </button>
            </div>
         </div>

         <button 
            onClick={handleSpin}
            disabled={isSpinning || (isAuto && isSpinning)}
            className="w-full py-6 rounded-[2rem] bg-gradient-to-b from-amber-300 to-amber-600 border-b-[6px] border-amber-800 text-amber-950 font-black text-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95 transition-transform hover:brightness-110 disabled:opacity-80 disabled:cursor-not-allowed relative overflow-hidden group"
         >
            {isAuto ? 'MODO AUTOMÁTICO' : isSpinning ? 'GIRANDO...' : 'GIRAR'}
            <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shine" />
         </button>
      </div>

      {/* BIG WIN POPUP */}
      {lastWinAmount >= betAmount * 10 && (
         <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="animate-in zoom-in duration-500 flex flex-col items-center">
               <h2 className="text-6xl md:text-8xl font-black text-amber-300 drop-shadow-[0_5px_0_#b45309] animate-bounce mb-4 text-center stroke-black stroke-2">BIG WIN!</h2>
               <div className="bg-red-600 text-white px-8 py-4 rounded-[2rem] border-4 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.8)]">
                  <p className="text-3xl font-black">R$ {lastWinAmount.toFixed(2)}</p>
               </div>
            </div>
            {/* Confetes CSS */}
            <div className="absolute inset-0 overflow-hidden">
               {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="absolute w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDuration: '1s' }} />
               ))}
            </div>
         </div>
      )}

      <style>{`
        @keyframes slot-spin {
          0% { transform: translateY(-20%); }
          100% { transform: translateY(20%); }
        }
        .animate-slot-spin {
          animation: slot-spin 0.1s linear infinite;
        }
        @keyframes shine {
          100% { transform: translateX(200%) skewX(12deg); }
        }
        .animate-shine {
           animation: shine 1s;
        }
      `}</style>
    </div>
  );
};

export default SlotsGame;