import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ToastContainer = () => {
  const { toast } = useAuth();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-[20px] bg-black/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3"
        >
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-500'} animate-pulse`} />
          <span className="text-sm font-bold uppercase tracking-widest text-white/90">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastContainer;
