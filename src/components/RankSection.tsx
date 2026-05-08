import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { Rank } from '../types';
import { RANK_ORDER } from '../constants';

interface RankSectionProps {
  level: number;
  rank: Rank;
  exp: number;
  maxExp: number;
}

export default function RankSection({ level, rank, exp, maxExp }: RankSectionProps) {
  const [activeTab, setActiveTab] = useState<'levels' | 'leaderboard'>('levels');

  // Let's generate a list of levels around the current level.
  // Standard is to show a window of levels, e.g., level - 2 to level + 5.
  
  const startLevel = Math.max(1, level - 2);
  const endLevel = startLevel + 6;
  
  const visibleLevels = Array.from({ length: endLevel - startLevel + 1 }, (_, i) => startLevel + i);

  const getRankForLevel = (l: number): Rank => {
    const idx = Math.min(Math.floor((l - 1) / 5), RANK_ORDER.length - 1);
    return RANK_ORDER[idx];
  };

  const getRankColor = (r: Rank) => {
    switch (r) {
      case Rank.E: return "text-gray-400 border-gray-400 bg-gray-400/10";
      case Rank.E_PLUS: return "text-gray-300 border-gray-300 bg-gray-300/10";
      case Rank.D: return "text-green-500 border-green-500 bg-green-500/10";
      case Rank.D_PLUS: return "text-green-400 border-green-400 bg-green-400/10";
      case Rank.C: return "text-blue-500 border-blue-500 bg-blue-500/10";
      case Rank.C_PLUS: return "text-blue-400 border-blue-400 bg-blue-400/10";
      case Rank.B: return "text-purple-500 border-purple-500 bg-purple-500/10";
      case Rank.B_PLUS: return "text-purple-400 border-purple-400 bg-purple-400/10";
      case Rank.A: return "text-orange-500 border-orange-500 bg-orange-500/10";
      case Rank.A_PLUS: return "text-orange-400 border-orange-400 bg-orange-400/10";
      case Rank.S: return "text-red-500 border-red-500 bg-red-500/10";
      case Rank.S_PLUS: return "text-red-400 border-red-400 bg-red-400/10";
      case Rank.SS: return "text-yellow-500 border-yellow-500 bg-yellow-500/10";
      case Rank.SS_PLUS: return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case Rank.SSS: return "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 border-system-neon/50 bg-system-neon/10";
      default: return "text-white border-white";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 tracking-wide pt-4">
      
      {/* Title */}
      <h2 className="text-3xl font-display font-bold text-center">Rank & Leaderboard</h2>

      {/* HEADER TABS */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mx-auto w-full max-w-sm">
        <button
          onClick={() => setActiveTab('levels')}
          className={`flex-1 py-3 text-sm font-display rounded-xl transition-all ${
            activeTab === 'levels' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
          }`}
        >
          Levels & Ranks
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 text-sm font-display rounded-xl transition-all ${
            activeTab === 'leaderboard' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'levels' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-10"
        >
          {/* CURRENT STATUS */}
          <div className="bg-system-card/40 system-border rounded-[2rem] p-8 flex items-center gap-8 shadow-xl relative overflow-hidden">
             {/* Glow effect */}
             <div className="absolute top-1/2 left-10 w-24 h-24 bg-system-accent/10 blur-[40px] rounded-full transform -translate-y-1/2" />
             
             <div className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl font-display font-bold shadow-lg z-10 ${getRankColor(rank)}`}>
               {rank}
             </div>
             <div className="flex flex-col z-10">
               <span className="text-[10px] font-mono text-system-neon tracking-widest uppercase mb-1">Current Status</span>
               <h2 className="text-4xl font-display font-bold text-white tracking-tight">{rank} Rank</h2>
               <span className="text-sm font-mono text-white/50 mt-1">Level {level}</span>
             </div>
          </div>

          {/* LEVEL PATHWAY */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">Level Pathway</span>
                <Info size={14} className="text-white/40" />
             </div>

             <div className="flex flex-col gap-4">
               {visibleLevels.map(l => {
                 const isConquered = l < level;
                 const isCurrent = l === level;
                 const r = getRankForLevel(l);
                 const rankColor = getRankColor(r);

                 if (isConquered) {
                   return (
                     <div key={l} className="bg-system-card/20 border border-white/5 rounded-3xl p-5 flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-system-card border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
                            <Check size={24} />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-white text-lg">Level {l}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rankColor}`}>
                                {r}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-white/40 mt-1">Total: {(l * 1000).toLocaleString()} XP</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase">Conquered</span>
                     </div>
                   );
                 }

                 if (isCurrent) {
                   return (
                     <div key={l} className="bg-system-card border border-system-accent/40 rounded-3xl p-5 flex items-center justify-between shadow-[0_0_30px_rgba(var(--color-system-accent),0.1)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-system-accent/5 to-transparent pointer-events-none" />
                        <div className="flex items-center gap-5 relative z-10">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-lg border-2 ${rankColor}`}>
                            {l}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-white text-xl">Level {l}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${rankColor}`}>
                                {r}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-white/60 mt-1">Total: {(l * 1000).toLocaleString()} XP</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end relative z-10">
                          <span className="text-xs font-mono font-bold text-system-accent tracking-widest">+{(exp / 1000).toFixed(1)}K XP</span>
                          <span className="text-[9px] font-mono text-white/40 uppercase mt-1">Progress</span>
                        </div>
                     </div>
                   );
                 }

                 // Locked Levels
                 return (
                    <div key={l} className="bg-system-card/20 border border-white/5 rounded-3xl p-5 flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center font-display font-bold text-white/30 text-lg">
                            {l}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-white/70 text-lg">Level {l}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border opacity-50 ${rankColor}`}>
                                {r}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-white/30 mt-1">Total: {(l * 1000).toLocaleString()} XP</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-white/30">Requires {maxExp - exp} XP</span>
                     </div>
                 );
               })}
             </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'leaderboard' && (
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-10 system-border bg-system-card/40 rounded-3xl flex flex-col items-center justify-center gap-4 text-center mt-10"
        >
           <Info className="text-system-neon opacity-50" size={32} />
           <h3 className="text-xl font-display font-bold text-white">Leaderboard Offline</h3>
           <p className="text-white/40 text-sm max-w-sm">
              The Hunter Guild's global ranking system is currently synchronizing. Reach a higher rank to participate in regional leaderboards.
           </p>
        </motion.div>
      )}
    </div>
  );
}
