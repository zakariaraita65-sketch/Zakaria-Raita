import { motion } from "motion/react";
import { SUBJECTS } from "../constants";
import * as LucideIcons from "lucide-react";

interface SkillTreeProps {
  skills: any; // mapping of subject id to level/exp
}

export default function SkillTree({ skills }: SkillTreeProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <LucideIcons.Sparkles className="text-system-purple" />
        <h2 className="text-2xl font-display font-bold italic tracking-tight">Skill Matrix</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map((subject) => {
          const Icon = (LucideIcons as any)[subject.icon] || LucideIcons.Sparkles;
          const skillData = skills[subject.id] || { level: 1, exp: 0, maxExp: 100 };
          const progress = (skillData.exp / skillData.maxExp) * 100;

          return (
            <motion.div
              key={subject.id}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl system-border bg-system-card/40 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[2] group-hover:opacity-10">
                <Icon size={64} />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-system-purple/20 flex items-center justify-center text-system-purple border border-system-purple/30">
                  <Icon size={24} />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display font-bold text-lg leading-none">{subject.name}</h3>
                  <span className="text-[10px] font-mono text-system-purple uppercase tracking-widest font-bold">
                    Lv. {skillData.level} Professional
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono opacity-60">
                  <span>PROFICIENCY</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-system-purple purple-glow"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
