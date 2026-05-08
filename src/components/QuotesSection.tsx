import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { SCIENTIFIC_QUOTES } from "../constants";
import { useState, useEffect } from "react";

export default function QuotesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SCIENTIFIC_QUOTES.length);
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const quote = SCIENTIFIC_QUOTES[currentIndex];

  return (
    <div className="p-6 system-border bg-system-card/30 backdrop-blur-sm rounded-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-system-neon/20 to-transparent" />
      
      <div className="flex gap-4">
        <div className="text-system-neon opacity-50 shrink-0">
          <Quote size={32} />
        </div>
        
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono text-system-neon/50 uppercase tracking-[0.2em] font-bold">
            System Message: Ancient Scholar Wisdom
          </span>
          
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-2"
          >
            <p className="text-lg font-display font-medium italic leading-relaxed text-white/90">
              "{quote.text}"
            </p>
            <span className="text-right text-xs font-mono text-system-neon italic">
              — {quote.author}
            </span>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {SCIENTIFIC_QUOTES.map((_, i) => (
          <div 
            key={i}
            className={`w-1 h-1 rounded-full transition-all ${
              i === currentIndex ? "w-4 bg-system-neon" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
