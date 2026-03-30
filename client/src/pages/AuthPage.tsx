import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser, loginUser } from '../lib/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(name, email, password);
      }

      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen flex items-center justify-center px-6 overflow-hidden relative selection:bg-white/20">
      
      {/* ─── Cinematic Background ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[100vw] h-[100vw] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[160px]"
        />
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-[180px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-150" />
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-[60px] border border-white/[0.05] rounded-[48px] p-12 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden relative">
          
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="text-center mb-12">
            <Link to="/" className="inline-block mb-10 transition-transform hover:scale-110 active:scale-95 duration-500">
              <span className="font-bold tracking-tighter text-white text-4xl">
                livehero<span className="text-white/30">.</span>
              </span>
            </Link>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-white/40 font-medium text-sm">
              {isLogin ? 'Enter your details to continue' : 'Join the elite creator network'}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode='wait'>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 block ml-5">Full Name</label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-white transition-colors duration-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[24px] py-4.5 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-500 font-medium placeholder:text-white/10" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 block ml-5">Email Address</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-white transition-colors duration-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[24px] py-4.5 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-500 font-medium placeholder:text-white/10" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 block ml-5">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-white transition-colors duration-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-[24px] py-4.5 pl-14 pr-6 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-500 font-medium placeholder:text-white/10" 
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right px-2">
                <button type="button" className="text-[11px] font-bold text-white/30 hover:text-white transition-colors duration-300">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden group/btn bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 mt-6 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{isLogin ? 'Sign In' : 'Sign Up'}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-white/30 text-sm font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-white font-bold hover:text-white/70 transition-colors ml-1"
              >
                {isLogin ? 'Join now' : 'Log in instead'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
