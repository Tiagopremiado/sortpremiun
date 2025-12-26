
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
      alert("Manutenção em andamento.");
      return;
    }

    if (userBalance < betAmount) {
      setShowLowBalance(true);
      return;
    }

    const positions: number[] = [];
    while (positions.length < minesCount) {
      const pos = Math.floor(Math.random() * GRID_SIZE);
      if (!positions.includes(pos)) positions.push(pos);
    }

    onUpdateBalance(userBalance - betAmount);
    setMinesPositions(positions);
    setGrid(Array(GRID_SIZE).fill('hidden'));
    setRevealedIndices([]);
    setCurrentMultiplier(1);
    setPotentialWin(betAmount);
    setRoundHash(generateSecureHash());
    setGameState('playing');
    setLastAction(null);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing' || revealedIndices.includes(index)) return;

    if (minesPositions.includes(index)) {
      const newGrid = [...grid];
      minesPositions.forEach(pos => { newGrid[pos] = 'mine'; });
      setGrid(newGrid);
      setGameState('ended');
      setLastAction('loss');
      onUpdateLiquidity(betAmount, 'add');
    } else {
      const newRevealed = [...revealedIndices, index];
      const newMultiplier = calculateMultiplier(newRevealed.length, minesCount);
      const nextPotentialWin = betAmount * newMultiplier;

      if (nextPotentialWin >= minesMaxPayout) {
        setPotentialWin(minesMaxPayout);
        handleCashOut(minesMaxPayout);
        return;
      }

      setRevealedIndices(newRevealed);
      setCurrentMultiplier(newMultiplier);
      setPotentialWin(nextPotentialWin);

      const newGrid = [...grid];
      newGrid[index] = 'gem';
      setGrid(newGrid);
    }
  };

  const handleCashOut = (forcedWin?: number) => {
    if (gameState !== 'playing') return;
    const winValue = forcedWin || potentialWin;
    onWin(winValue);
    onUpdateLiquidity(winValue, 'remove');
    setGameState('ended');
    setLastAction('win');
  };

  return (
    <div className="bg-[#0b1121] rounded-[3rem] p-6 md:p-10 text-white shadow-2xl border border-slate-800 relative">
      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-white/5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">VALOR DA APOSTA</label>
            <input 
              type="number" 
              value={betAmount}
              disabled={gameState === 'playing'}
              onChange={e => setBetAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-white/5 px-6 py-4 rounded-xl font-black text-2xl text-amber-500 outline-none"
            />
          </div>

          <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-white/5">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">NÍVEL DE MINAS ({minesCount})</label>
             <div className="grid grid-cols-4 gap-2 mb-4">
                {[3, 5, 10, 24].map(num => (
                  <button 
                    key={num}
                    onClick={() => setMinesCount(num)}
                    disabled={gameState === 'playing'}
                    className={`py-3 rounded-lg text-xs font-black border transition-all ${minesCount === num ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}
                  >
                    {num}
                  </button>
                ))}
             </div>
             <input 
               type="range" min="1" max="24" value={minesCount}
               disabled={gameState === 'playing'}
               onChange={e => setMinesCount(Number(e.target.value))}
               className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
             />
          </div>

          {gameState === 'playing' ? (
            <button onClick={() => handleCashOut()} className="w-full bg-gradient-to-b from-amber-400 to-amber-600 text-slate-900 py-6 rounded-[2rem] font-black text-xl uppercase shadow-xl active:scale-95 border-b-4 border-amber-800">
              COLETAR R$ {potentialWin.toFixed(2)}
            </button>
          ) : (
            <button onClick={startGame} className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl uppercase shadow-xl active:scale-95 border-b-4 border-emerald-800">
              APOSTAR
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center">
          <div className="mb-6 bg-slate-900/40 px-10 py-4 rounded-full border border-white/5">
             <p className="text-4xl font-black text-emerald-400">{currentMultiplier.toFixed(2)}x</p>
          </div>

          <div className="grid grid-cols-5 gap-3 w-full max-w-md aspect-square bg-slate-950 p-6 rounded-[3rem] border-4 border-slate-900">
            {grid.map((tile, i) => (
              <button
                key={i}
                onClick={() => handleTileClick(i)}
                disabled={gameState !== 'playing' || revealedIndices.includes(i)}
                className={`rounded-2xl transition-all aspect-square flex items-center justify-center text-4xl ${tile === 'hidden' ? 'bg-slate-800 hover:bg-slate-700' : tile === 'gem' ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-red-600'}`}
              >
                {tile === 'gem' && '💎'}
                {tile === 'mine' && '💣'}
                {tile === 'hidden' && gameState === 'playing' && <div className="w-2 h-2 bg-white/10 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {gameState === 'ended' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
           <div className={`p-12 rounded-[3.5rem] text-center border-t-8 shadow-2xl max-w-md w-full ${lastAction === 'win' ? 'bg-white border-emerald-500 text-slate-900' : 'bg-slate-900 border-red-500 text-white'}`}>
              <div className="text-7xl mb-6">{lastAction === 'win' ? '🏆' : '💣'}</div>
              <h2 className="text-4xl font-black uppercase italic mb-2">{lastAction === 'win' ? 'VOCÊ VENCEU!' : 'EXPLODIU!'}</h2>
              <p className="text-sm font-bold opacity-60 mb-10">{lastAction === 'win' ? `Prêmio de R$ ${potentialWin.toFixed(2)} creditado.` : 'Tente outra rodada com cautela.'}</p>
              <button onClick={() => { setGameState('betting'); setGrid(Array(GRID_SIZE).fill('hidden')); }} className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase">NOVA RODADA</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MinesGame;
