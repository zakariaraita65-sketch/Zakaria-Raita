import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Check, Lock } from 'lucide-react';
import { AVAILABLE_TITLES } from '../constants';

interface TitleSelectorProps {
  onClose: () => void;
  onSelect: (title: string) => void;
  earnedTitles: string[];
  activeTitle: string;
}

export default function TitleSelector({ onClose, onSelect, earnedTitles, activeTitle }: TitleSelectorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-system-bg border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-system-neon/20 rounded-lg text-system-neon">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-black italic uppercase tracking-tight">Hall of Titles</h2>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Select your recognized designation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AVAILABLE_TITLES.map((title) => {
              const isEarned = earnedTitles.includes(title.name);
              const isActive = activeTitle === title.name;

              return (
                <div 
                  key={title.id}
                  onClick={() => isEarned && onSelect(title.name)}
                  className={`
                    relative p-4 rounded-xl border transition-all group flex flex-col gap-2
                    ${isEarned 
                      ? 'cursor-pointer border-white/10 hover:border-system-neon/50 bg-white/5 hover:bg-white/10' 
                      : 'opacity-50 border-white/5 bg-black/20 cursor-not-allowed'}
                    ${isActive ? 'border-system-neon bg-system-neon/10' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-display font-bold uppercase ${isActive ? 'text-system-neon' : 'text-white'}`}>
                      {title.name}
                    </span>
                    {isActive ? (
                      <Check size={16} className="text-system-neon" />
                    ) : !isEarned && (
                      <Lock size={16} className="text-white/20" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Condition</span>
                    <span className="text-xs text-white/70 italic">{title.condition}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      title.difficulty === 'Hard' ? 'text-system-danger border-system-danger/30' :
                      title.difficulty === 'Medium' ? 'text-purple-400 border-purple-400/30' :
                      'text-system-neon border-system-neon/30'
                    }`}>
                      {title.difficulty}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute top-0 right-0 p-1">
                      <div className="w-1.5 h-1.5 bg-system-neon rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.8)]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20 text-center">
           <p className="text-[10px] font-mono text-white/20 uppercase">Titles are earned through high-intensity missions and consistency.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
