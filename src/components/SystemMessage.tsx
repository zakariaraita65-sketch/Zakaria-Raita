import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, ReactNode } from "react";

interface SystemMessageProps {
  message: string;
  type?: "info" | "success" | "warning" | "danger";
  onClose: () => void;
  key?: any;
}

export default function SystemMessage({ message, type = "info", onClose }: SystemMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    info: "text-system-neon border-system-neon/50 bg-system-neon/10",
    success: "text-green-400 border-green-500/50 bg-green-500/10",
    warning: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
    danger: "text-system-danger border-system-danger/50 bg-system-danger/10",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          className={`fixed top-8 right-8 z-50 px-6 py-4 border-l-4 rounded-r shadow-2xl backdrop-blur-md ${colors[type]}`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
              System Notification
            </span>
            <div className="text-lg font-display font-medium tracking-wide italic">
              {message}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-[4300ms] w-0 animate-[progress_4.3s_linear]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
