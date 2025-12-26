
import React, { useState, useCallback, useEffect } from 'react';

const generateSecureHash = () => {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

interface MinesGameProps {
  userBalance: number;
  onUpdateBalance: (newBalance: number) => void;
  onWin: (amount: number) => void;
  onOpenDeposit: () => void;
  isCasinoPayoutEnabled: boolean;
  casinoLiquidity: number;
  onUpdateLiquidity: (amount: number, type: 'add' | 'remove') => void;
  minesMaxPayout: number;
}

const GRID_SIZE = 25;

const MinesGame: React.FC<MinesGameProps> = ({ 
  userBalance, 
  onUpdateBalance, 
  onWin, 
  onOpenDeposit,
  isCasinoPayoutEnabled,
  casinoLiquidity = 0,
  onUpdateLiquidity,
  minesMaxPayout = 500
}) => {
  const [betAmount, setBetAmount] = useState<number>(1.00);
  const [minesCount, setMinesCount] = useState<number>(3);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [grid, setGrid] = useState<( 'hidden' | 'gem' | 'mine' )[]>(Array(GRID_SIZE).fill('hidden'));
  const [minesPositions, setMinesPositions] = useState<number[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [potentialWin, setPotentialWin] = useState<number>(0);
  const [lastAction, setLastAction] = useState<'win' | 'loss' | null>(null);
  const [showLowBalance, setShowLowBalance] = useState(false);
  const [roundHash, setRoundHash] = useState<string>('');
  const [serverSeed, setServerSeed] = useState<string>('');
  const [explodedIndex, setExplodedIndex] = useState<number | null>(null);

  const combinations = (n: number, k: number): number => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k;
    let res = 1;
    for (let i = 1; i <= k; i++) res = res * (n - i + 1) / i;
    return res;
  };

  const calculateMultiplier = (revealed: number, mines: number) => {
    const houseEdge = 0.94; 
    const prob = combinations(GRID_SIZE - mines, revealed) / combinations(GRID_SIZE, revealed);
    return parseFloat((houseEdge / prob).toFixed(2));
  };

  const startGame = () => {
    if (gameState === 'playing') return;
    
    if (!isCasinoPayoutEnabled) {
      alert("A Arena de Jogos está em manutenção para auditoria. Tente novamente em breve.");
      return;
    }

    if ((casinoLiquidity || 0) < betAmount * 1.5) {
      alert("O limite de prêmios instantâneos para esta rodada foi atingido. Tente reduzir o valor da aposta.");
      return;
    }

    const currentBet = Number(betAmount);
    if (isNaN(currentBet) || currentBet <= 0) return;

    if (currentBet > userBalance) {
      setShowLowBalance(true);
      return;
    }

    const newServerSeed = generateSecureHash();
    const newRoundHash = generateSecureHash();
    setServerSeed(newServerSeed);
    setRoundHash(newRoundHash);
    setExplodedIndex(null);

    const positions: number[] = [];
    while (positions.length < minesCount) {
      const pos = Math.floor(Math.random() * GRID_SIZE);
      if (!positions.includes(pos)) positions.push(pos);
    }

    onUpdateBalance(userBalance - currentBet);
    setMinesPositions(positions);
    setGrid(Array(GRID_SIZE).fill('hidden'));
    setRevealedIndices([]);
    setCurrentMultiplier(1);
    setPotentialWin(currentBet);
    setGameState('playing');
    setLastAction(null);
    setShowLowBalance(false);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || revealedIndices.includes(index)) return;

    if (minesPositions.includes(index)) {
      const newGrid = [...grid];
      minesPositions.forEach(pos => { newGrid[pos] = 'mine'; });
      setGrid(newGrid);
      setExplodedIndex(index);
      setGameState('ended');
      setLastAction('loss');
      onUpdateLiquidity(betAmount, 'add');
    } else {
      const newRevealed = [...revealedIndices, index];
      const newMultiplier = calculateMultiplier(newRevealed.length, minesCount);
      const nextPotentialWin = betAmount * newMultiplier;

      if (nextPotentialWin >= minesMaxPayout) {
        setRevealedIndices(newRevealed);
        setCurrentMultiplier(newMultiplier);
        setPotentialWin(minesMaxPayout); 
        
        const newGrid = [...grid];
        newGrid[index] = 'gem';
        setGrid(newGrid);

        setTimeout(() => {
          alert(`TETO ATINGIDO! Você alcançou o limite máximo de R$ ${minesMaxPayout.toFixed(2)} permitido para esta rodada.`);
          handleCashOut(minesMaxPayout);
        }, 300);
        return;
      }

      if (nextPotentialWin > (casinoLiquidity || 0)) {
        alert("O prêmio atingiu o limite de banca disponível para esta rodada! Realize o Cash Out.");
        handleCashOut();
        return;
      }

      setRevealedIndices(newRevealed);
      setCurrentMultiplier(newMultiplier);
      setPotentialWin(nextPotentialWin);

      const newGrid = [...grid];
      newGrid[index] = 'gem';
      setGrid(newGrid);

      if (newRevealed.length === GRID_SIZE - minesCount) {
        handleCashOut(nextPotentialWin);
      }
    }
  };

  const handleCashOut = (forcedWin?: number) => {
    if (gameState !== 'playing') return;
    const winValue = forcedWin || potentialWin;
    
    onWin(winValue);
    onUpdateLiquidity(winValue, 'remove');
    
    const newGrid = [...grid];
    minesPositions.forEach(pos => { newGrid[pos] = 'mine'; });
    setGrid(newGrid);
    setGameState('ended');
    setLastAction('win');
  };

  const isLowBalance = userBalance < betAmount && gameState !== 'playing';

  return (
    <div className="bg-[#0b1121] rounded-[3rem] p-4 md:p-10 text-white shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-slate-800/60 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 relative z-10 items-start">
        
        {/* Painel de Controles */}
        <div className="w-full lg:w-96 space-y-5">
          <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_#fbbf24]" />
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">VALOR DA APOSTA</label>
            </div>
            
            <div className="relative mb-4">
              <div className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl ${isLowBalance ? 'text-red-500' : 'text-amber-500'}`}>R$</div>
              <input 
                type="number" 
                value={betAmount}
                disabled={gameState === 'playing'}
                onChange={e => setBetAmount(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-white/5 px-14 py-5 rounded-2xl font-black text-3xl text-white outline-none focus:border-amber-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setBetAmount(prev => Math.max(1, prev / 2))} 
                disabled={gameState === 'playing'} 
                className="bg-white/5 py-3.5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-colors border border-white/5"
              >
                Metade
              </button>
              <button 
                onClick={() => setBetAmount(prev => prev * 2)} 
                disabled={gameState === 'playing'} 
                className="bg-white/5 py-3.5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-colors border border-white/5"
              >
                Dobrar
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
             <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">QUANTIDADE DE MINAS</label>
             </div>
             
             <div className="grid grid-cols-4 gap-2 mb-5">
                {[3, 5, 10, 24].map(num => (
                  <button 
                    key={num}
                    onClick={() => setMinesCount(num)}
                    disabled={gameState === 'playing'}
                    className={`py-3 rounded-xl text-[10px] font-black transition-all border ${minesCount === num ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                  >
                    {num}
                  </button>
                ))}
             </div>
             
             <div className="relative px-2">
                <input 
                  type="range" 
                  min="1" 
                  max="24" 
                  value={minesCount}
                  disabled={gameState === 'playing'}
                  onChange={e => setMinesCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mb-3"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                   <span>1 MINA</span>
                   <span className="text-emerald-500 font-black">{minesCount} SELECIONADAS</span>
                   <span>24 MINAS</span>
                </div>
             </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3">
             <span className="text-slate-600 text-[16px]">🛡️</span>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Teto Máximo: <span className="text-slate-300">R$ {minesMaxPayout.toFixed(2)}</span></p>
          </div>

          {gameState === 'playing' ? (
            <button 
              onClick={() => handleCashOut()} 
              className="w-full bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 py-7 rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.2)] active:scale-95 border-b-[8px] border-amber-800 transition-all"
            >
              COLETAR AGORA <br/>
              <span className="text-sm opacity-80 font-black">RECEBER R$ {potentialWin.toFixed(2)}</span>
            </button>
          ) : (
            <button 
              onClick={startGame} 
              className={`w-full py-7 rounded-[2.5rem] font-black text-xl uppercase tracking-widest transition-all active:scale-95 border-b-[8px] shadow-2xl ${isLowBalance ? 'bg-red-600 border-red-900 text-white' : 'bg-emerald-600 border-emerald-900 text-white hover:bg-emerald-500'}`}
            >
              {isLowBalance ? 'SALDO INSUFICIENTE' : 'APOSTAR AGORA'}
            </button>
          )}
        </div>

        {/* Campo de Jogo */}
        <div className="flex-1 w-full flex flex-col items-center">
          
          {/* Visor de Multiplicador Compacto */}
          <div className="mb-8 bg-slate-900/40 px-10 py-5 rounded-[2rem] border border-white/5 flex flex-col items-center min-w-[240px] shadow-inner">
             <p className="text-[10px] font-black text-slate-500 uppercase mb-1 italic tracking-widest">Multiplicador Atual</p>
             <p className={`text-4xl font-black tracking-tighter ${revealedIndices.length > 0 ? 'text-emerald-400 animate-pulse drop-shadow-[0_0_10px_#10b981]' : 'text-slate-700'}`}>
               {currentMultiplier.toFixed(2)}<span className="text-lg ml-0.5">x</span>
             </p>
          </div>

          {/* Grid Ajustado para não esticar */}
          <div className="relative w-full max-w-md aspect-square bg-slate-950/80 p-4 md:p-6 rounded-[3.5rem] border-4 border-slate-900 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            
            {showLowBalance && (
              <div className="absolute inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl rounded-[3rem] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                  <div className="text-5xl mb-4">💰</div>
                  <h3 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">Ops! Sem Saldo</h3>
                  <button 
                    onClick={() => { setShowLowBalance(false); onOpenDeposit(); }} 
                    className="bg-emerald-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg uppercase shadow-xl hover:bg-emerald-500 transition-all border-b-4 border-emerald-800"
                  >
                    RECARREGAR
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 gap-2.5 md:gap-4 w-full h-full">
              {grid.map((tile, i) => (
                <button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  disabled={gameState !== 'playing' || revealedIndices.includes(i) || showLowBalance}
                  className={`relative rounded-xl md:rounded-[1.8rem] transition-all duration-300 transform aspect-square flex items-center justify-center text-3xl md:text-5xl border shadow-lg ${
                    tile === 'hidden' 
                      ? 'bg-slate-800 border-white/5 hover:bg-slate-700 hover:scale-[1.05] active:scale-95' 
                      : tile === 'gem' 
                        ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.5)]' 
                        : 'bg-gradient-to-br from-red-600 to-red-900 border-red-500'
                  }`}
                >
                  {tile === 'hidden' && gameState === 'playing' && (
                    <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse" />
                  )}
                  {tile === 'gem' && <div className="animate-in zoom-in duration-300 drop-shadow-md">💎</div>}
                  {tile === 'mine' && <div className="animate-in zoom-in duration-300 drop-shadow-md">💣</div>}
                  
                  {/* Efeito de brilho em gems */}
                  {tile === 'gem' && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-[1.8rem] opacity-0 hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Hash da Rodada para Transparência */}
          <div className="mt-8 flex items-center gap-2 opacity-20 hover:opacity-60 transition-opacity cursor-help" title="Esta é a prova criptográfica de que a rodada foi justa.">
             <span className="text-[10px] font-black text-slate-500">HASH:</span>
             <span className="text-[8px] font-mono font-bold truncate max-w-[150px]">{roundHash || 'Aguardando início...'}</span>
          </div>
        </div>
      </div>
      
      {/* Modal de Fim de Jogo */}
      {gameState === 'ended' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-500">
           <div className={`p-10 md:p-14 rounded-[4rem] text-center border-t-[10px] shadow-[0_50px_100px_rgba(0,0,0,0.6)] animate-in zoom-in duration-500 max-w-[450px] w-full ${lastAction === 'win' ? 'bg-white border-emerald-500' : 'bg-slate-900 border-red-600'}`}>
              <div className="text-8xl mb-8 transform hover:rotate-12 transition-transform cursor-default">
                {lastAction === 'win' ? '👑' : '💥'}
              </div>
              <h2 className={`text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none ${lastAction === 'win' ? 'text-slate-900' : 'text-white'}`}>
                {lastAction === 'win' ? 'LUCRO REAL!' : 'QUE PENA!'}
              </h2>

              {lastAction === 'win' ? (
                <div className="mb-10 bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Valor Creditado</p>
                   <p className="text-5xl font-black text-emerald-600 mb-4 tracking-tighter">R$ {potentialWin.toFixed(2)}</p>
                   <div className="bg-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full inline-block font-black text-xs uppercase tracking-widest">
                       Multiplicador Final: {currentMultiplier.toFixed(2)}x
                   </div>
                </div>
              ) : (
                <div className="mb-10 bg-slate-950 rounded-[2rem] p-6 border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                       Mina detonada na posição <span className="text-white font-bold ml-1">#{explodedIndex !== null ? explodedIndex + 1 : '?'}</span>
                   </p>
                   <p className="text-3xl font-black text-red-500 tracking-tighter">
                       - R$ {betAmount.toFixed(2)}
                   </p>
                   <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">Valor da aposta deduzido</p>
                </div>
              )}

              <button 
                onClick={() => { setGameState('betting'); setGrid(Array(GRID_SIZE).fill('hidden')); setLastAction(null); }} 
                className={`w-full px-12 py-6 rounded-[2rem] font-black uppercase text-lg tracking-widest shadow-2xl transition-all active:scale-95 ${lastAction === 'win' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                NOVA RODADA
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MinesGame;
