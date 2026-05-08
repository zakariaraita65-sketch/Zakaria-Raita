import React from "react";
import { RANK_ORDER, RANK_TITLES } from "../constants";
import { motion } from "motion/react";
import { Shield, Zap, TrendingUp, Award, Coins } from "lucide-react";

interface UserHUDProps {
  stats: any;
  rankIndex: number;
  userId: string;
  onOpenTitles?: () => void;
}

export default function UserHUD({ stats, rankIndex, userId, questCount = 0, onOpenTitles }: UserHUDProps & { questCount?: number }) {
  if (!stats) return null;

  const currentRank = RANK_ORDER[rankIndex] || "E";
  const rankTitle = RANK_TITLES[currentRank] || "ROOKIE";
  const activeTitle = stats.activeTitle || rankTitle;
  const level = stats.level || 1;
  const exp = stats.exp || 0;
  const maxExp = stats.maxExp || 1000;
  const streak = stats.streak || 0;
  const focusTime = stats.totalFocusTime || 0;
  const gold = stats.gold || 0;

  return (
    <div className="flex flex-col gap-6 p-6 system-border bg-system-card/50 backdrop-blur-md rounded-xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-system-neon/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-system-neon/50 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-system-neon rounded-full" />
            <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">
              {stats.displayName || "GUEST_HUNTER"}
            </h2>
          </div>
          <h1 className="text-5xl font-display font-black italic tracking-tighter mt-1 leading-none">
            LVL <span className="text-system-neon">{level}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6 self-end md:self-center">
          <div className="flex flex-col items-end">
             <button 
                onClick={onOpenTitles}
                className="flex items-center gap-2 mb-1 group/title hover:brightness-125 transition-all"
             >
               <span className="w-1 h-1 bg-system-neon/50 rounded-full animate-pulse" />
               <span className="text-[10px] font-mono text-system-neon/70 uppercase tracking-[0.3em] font-bold">
                 {activeTitle}
               </span>
               <Award size={12} className="text-system-neon/50 group-hover/title:text-system-neon" />
             </button>
             <div className="text-7xl font-display font-black italic text-system-neon neon-text-strong group-hover:scale-110 transition-all duration-500 leading-none tracking-tighter">
                {currentRank}
             </div>
          </div>
        </div>
      </div>

      {/* EXP BAR */}
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-widest text-white/40">
          <span className="text-system-neon brightness-125 font-bold">Experience Sync</span>
          <div className="flex items-center gap-2">
            <span className="text-white/60">{exp}</span>
            <span className="opacity-20 text-[8px]">/</span>
            <span className="text-white/30">{maxExp}</span>
          </div>
        </div>
        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, (exp / Math.max(1, maxExp)) * 100)}%` }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="h-full bg-gradient-to-r from-system-accent via-system-neon to-system-purple relative"
          >
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* MINI STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 relative z-10">
        <StatItem icon={<TrendingUp size={14} />} label="STREAK" value={`${streak} DAYS`} />
        <StatItem icon={<Zap size={14} />} label="FOCUS" value={`${focusTime} MIN`} />
        <StatItem icon={<Award size={14} />} label="ACTIVE MISSIONS" value={questCount} />
        <StatItem icon={<Coins size={14} />} label="GOLD" value={`${gold}`} color="text-yellow-400" />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, color = "text-system-neon" }: { icon: React.ReactNode, label: string, value: any, color?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all hover:translate-y-[-2px]">
      <div className={`${color} opacity-60`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter leading-none mb-1">{label}</span>
        <span className="text-sm font-display font-bold leading-none">{value}</span>
      </div>
    </div>
  );
}
