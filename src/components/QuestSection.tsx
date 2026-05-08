import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, Trash2, Calendar, Swords, ScrollText, Volume2, Clock, VolumeX, Upload, Play, Pause, AlertCircle, PlayCircle, PauseCircle } from "lucide-react";
import { Quest } from "../types";
import { speak } from "../lib/voice";

const AMBIENT_SOUNDS = [
  { id: 'rain', name: 'Rain', url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
  { id: 'ocean', name: 'Ocean Waves', url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg' },
  { id: 'wind', name: 'Wind', url: 'https://actions.google.com/sounds/v1/weather/wind.ogg' },
  { id: 'thunder', name: 'Thunderstorm', url: 'https://actions.google.com/sounds/v1/weather/thunderstorm.ogg' },
  { id: 'cafe', name: 'Coffee Shop', url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg' },
];

interface QuestSectionProps {
  quests: Quest[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onStart: (id: string) => void;
  onFail: (id: string, title: string) => void;
}

export default function QuestSection({ quests = [], onToggle, onDelete, onAdd, onStart, onFail }: QuestSectionProps) {
  console.log(`[RENDER] QuestSection received ${quests?.length || 0} quests`);
  const dailyQuests = (quests || []).filter(q => q.type === "daily" || !q.type);
  const mainQuests = (quests || []).filter(q => q.type === "main");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/5">
        <div className="flex flex-col">
          <h2 className="text-xl font-display font-bold italic tracking-tight flex items-center gap-2">
            <Swords className="text-system-neon" size={20} /> MISSIONS
          </h2>
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Tracking mission objectives in real-time</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const pendingQuests = quests.filter(q => q.status === 'pending');
              if (pendingQuests.length > 0) {
                const randomQuest = pendingQuests[Math.floor(Math.random() * pendingQuests.length)];
                onStart(randomQuest.id);
                speak(`SYSTEM HAS CHOSEN: ${randomQuest.title}`);
              } else {
                speak("NO PENDING MISSIONS AVAILABLE.");
              }
            }}
            className="flex items-center gap-2 text-[10px] font-bold bg-white/10 text-white px-4 py-2 rounded uppercase hover:bg-white/20 transition-all transform active:scale-95"
          >
            Auto Assign
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 text-[10px] font-bold bg-system-neon text-black px-4 py-2 rounded uppercase hover:bg-white transition-all transform active:scale-95"
          >
            <Plus size={14} /> Add Mission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAILY QUESTS */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              Daily Missions
            </h3>
            <span className="text-[10px] font-mono text-system-neon bg-system-neon/10 px-2 rounded">{dailyQuests.length}</span>
          </div>
          <div className="flex flex-col gap-3 min-h-[100px]">
            {dailyQuests.length === 0 ? (
              <EmptyQuest type="daily" />
            ) : (
                dailyQuests.map((quest) => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  onToggle={() => onToggle(quest.id)} 
                  onDelete={() => onDelete(quest.id)} 
                  onStart={() => onStart(quest.id)}
                  onFail={() => onFail(quest.id, quest.title)}
                />
              ))
            )}
          </div>
        </div>

        {/* MAIN QUESTS */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
              Main Campaigns
            </h3>
            <span className="text-[10px] font-mono text-system-purple bg-system-purple/10 px-2 rounded">{mainQuests.length}</span>
          </div>
          <div className="flex flex-col gap-3 min-h-[100px]">
            {mainQuests.length === 0 ? (
              <EmptyQuest type="main" />
            ) : (
                mainQuests.map((quest) => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  onToggle={() => onToggle(quest.id)} 
                  onDelete={() => onDelete(quest.id)} 
                  onStart={() => onStart(quest.id)}
                  onFail={() => onFail(quest.id, quest.title)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
  onToggle: () => void;
  onDelete: () => void;
  onStart: () => void;
  onFail: () => void;
  key?: any;
}

function QuestCard({ quest, onToggle, onDelete, onStart, onFail }: QuestCardProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSound, setSelectedSound] = useState(AMBIENT_SOUNDS[0]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (quest.status === 'active' && quest.startedAt && quest.duration) {
      const endTime = new Date(quest.startedAt).getTime() + quest.duration * 60 * 1000;
      
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          onFail();
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [quest.status, quest.startedAt, quest.duration, onFail]);

  useEffect(() => {
    if (audioRef.current && isPlaying && quest.status === 'active') {
      audioRef.current.play().catch(e => console.error("Audio block:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, quest.status, selectedSound]);

  const handleToggleClick = () => {
    if (!quest.completed && quest.status !== 'failed') {
      setShowVerification(true);
    } else if (quest.completed) {
      onToggle(); // un-complete
    }
  };

  const handleVerify = () => {
    setShowVerification(false);
    setIsPlaying(false);
    onToggle();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        layout
        className={`group relative flex items-center gap-4 p-4 rounded-lg system-border transition-all ${
          quest.completed ? "bg-white/5 border-white/5" : "bg-system-card hover:bg-slate-800/80"
        }`}
      >
        <button
          onClick={handleToggleClick}
          className={`w-6 h-6 shrink-0 rounded border flex items-center justify-center transition-all ${
            quest.completed 
              ? "bg-system-neon border-system-neon text-system-bg" 
              : "border-white/20 hover:border-system-neon hover:bg-system-neon/10"
          }`}
        >
          {quest.completed && <Check size={14} strokeWidth={4} />}
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium truncate ${quest.completed ? "line-through text-white/30" : "text-white"}`}>
              {quest.title}
            </h4>
            {!quest.completed && (
              <button 
                onClick={(e) => { e.stopPropagation(); speak(quest.title); }}
                className="text-white/20 hover:text-system-neon transition-colors shrink-0"
                title="Read Objective"
              >
                <Volume2 size={12} />
              </button>
            )}
          </div>
          
          {quest.description && (
            <p className="text-xs text-white/50 mt-1 mb-1 line-clamp-2">
              {quest.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 mt-1 flex-wrap">
            <span className="flex items-center gap-1 uppercase">
              <ScrollText size={10} /> {quest.category}
            </span>
            <span className="flex items-center gap-1 text-system-neon uppercase">
               +{quest.expReward} EXP
            </span>
            {quest.status === 'failed' && (
              <span className="flex items-center gap-1 text-system-danger uppercase font-bold ml-auto">
                 FAILED
              </span>
            )}
            {quest.duration !== undefined && quest.status === 'pending' && (
              <span className="flex items-center gap-1 text-white/50 uppercase ml-auto">
                <Calendar size={10} /> {Math.floor(quest.duration / 60)}h {quest.duration % 60}m needed
                <button 
                  onClick={() => onStart()}
                  className="ml-2 px-2 py-1 bg-white/10 hover:bg-system-neon hover:text-black rounded transition-colors text-[9px] font-bold"
                >
                  START NOW
                </button>
              </span>
            )}
            {quest.status === 'active' && timeLeft !== null && (
              <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
                {/* Audio Controls */}
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded border border-white/10">
                  <select
                    className="text-[9px] bg-transparent outline-none text-white/70"
                    value={selectedSound.id}
                    onChange={(e) => {
                      const sd = AMBIENT_SOUNDS.find(s => s.id === e.target.value);
                      if (sd) setSelectedSound(sd);
                    }}
                  >
                    {AMBIENT_SOUNDS.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
                  </select>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="text-system-neon hover:text-white transition-colors">
                    {isPlaying ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                  </button>
                </div>
                {/* Timer */}
                <span className="flex items-center gap-1 text-system-neon uppercase font-bold animate-pulse">
                  <Clock size={10} /> {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-2 text-white/30 hover:text-system-danger transition-all shrink-0"
        >
          <Trash2 size={16} />
        </button>
      </motion.div>

      {/* Hidden audio element for ambient sounds */}
      <audio ref={audioRef} src={selectedSound.url} loop className="hidden" />

      {/* Verification Modal overlay */}
      <AnimatePresence>
        {showVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowVerification(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-system-card system-border rounded-xl p-6"
            >
              <h3 className="text-lg font-display font-bold mb-2 flex items-center gap-2 text-system-neon">
                <AlertCircle size={18} /> VERIFY COMPLETION
              </h3>
              <p className="text-xs text-white/60 mb-6 uppercase tracking-widest font-mono">
                Provide photographic evidence of your completed mission to gain EXP.
              </p>

              <div className="w-full aspect-video border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center mb-6 bg-black/30 hover:border-system-neon/50 hover:bg-system-neon/5 transition-all cursor-pointer overflow-hidden relative group">
                <Upload size={32} className="text-white/30 mb-2 group-hover:text-system-neon transition-colors" />
                <span className="text-[10px] font-mono text-white/50 group-hover:text-white transition-colors uppercase">Click to upload photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    // Pretentious "uploading" effect simply verifies it directly
                    if (e.target.files && e.target.files.length > 0) {
                      handleVerify();
                    }
                  }}
                />
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setShowVerification(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded uppercase text-[10px] font-bold tracking-widest text-white/70">Cancel</button>
                 <button onClick={handleVerify} className="flex-1 py-3 bg-system-neon hover:bg-white text-black rounded uppercase text-[10px] font-bold tracking-widest transition-all shadow-lg shadow-system-neon/20">Bypass / Verify</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function EmptyQuest({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-lg opacity-40">
      <ScrollText size={24} className="mb-2" />
      <span className="text-xs font-mono uppercase tracking-widest">No {type} quests active</span>
    </div>
  );
}
