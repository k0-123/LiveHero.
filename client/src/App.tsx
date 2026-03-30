import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Copy, LogOut, User as UserIcon, Trash2, Menu, X, Loader2 } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getComponents, deleteComponent, unlockComponent } from './lib/api';

// Lazy load page components for better initial loading performance
const AffiliatePage = lazy(() => import('./pages/AffiliatePage'));
const EarnPage = lazy(() => import('./pages/EarnPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
import ToastContainer from './components/ToastContainer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const headlineWords = "Design exactly as you envisioned.".split(" ");

interface ComponentItem {
  _id: string;
  title: string;
  category: string;
  videoUrl: string;
  codePrompt: string | null;
  isPremium: boolean;
  heightClass: string;
  downloads: number;
}

const Navbar = () => {
  const { isLoggedIn, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Guide', to: '#', isExternal: false },
    { label: 'Pricing', to: '/pricing', isExternal: false },
    { label: 'Earn', to: '/earn', isExternal: false },
    { label: 'Affiliates', to: '/affiliates', isExternal: false },
  ];

  return (
    <>
      {/* Dynamic Floating Logo - Top Left */}
      <div className="fixed top-6 left-8 z-[60] flex justify-start">
        <Link to="/" className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2 flex items-center justify-center shadow-lg transition-all duration-300 hover:border-white/20">
          <div className="font-sans font-extrabold tracking-tighter text-white text-xl flex items-center gap-1">
            livehero<span className="text-white/40">.</span>
          </div>
        </Link>
      </div>

      {/* Navbar Desktop */}
      <div className="fixed top-6 right-8 z-[60] flex justify-end">
        <nav className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full pl-8 pr-2 py-1.5 flex flex-row items-center gap-8 transition-all duration-300 shadow-lg">
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.to.startsWith('#') ? (
                <a key={link.label} href={link.to} className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">{link.label}</a>
              ) : (
                <Link key={link.label} to={link.to} className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">{link.label}</Link>
              )
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-[12px] uppercase tracking-[0.1em] font-medium text-amber-400/80 hover:text-amber-300 transition-colors">Admin</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <UserIcon className="w-3.5 h-3.5 text-white/50" />
                  <span className="text-[12px] font-bold text-white/70">{user?.name?.split(' ')[0]}</span>
                  {user?.isPremium && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">Pro</span>
                  )}
                </div>
                <button onClick={handleLogout} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors hidden md:flex">
                  <LogOut className="w-3.5 h-3.5 text-white/50" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-[12px] uppercase tracking-wide font-bold bg-white text-black px-6 py-2.5 rounded-full"
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 md:hidden bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-3xl md:hidden pt-32 px-10"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                link.to.startsWith('#') ? (
                  <a 
                    key={link.label} 
                    href={link.to} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-bold tracking-tighter text-white"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.label} 
                    to={link.to} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-bold tracking-tighter text-white"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-bold tracking-tighter text-amber-400">Admin</Link>
              )}
              
              <div className="mt-12 h-[1px] bg-white/10 w-full" />
              
              {isLoggedIn ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <UserIcon className="w-6 h-6 text-white/50" />
                    <span className="text-xl font-bold text-white">{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-4 text-white/50 text-xl font-semibold">
                    <LogOut className="w-6 h-6" /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-white text-black font-black py-5 rounded-2xl text-lg uppercase tracking-tight">Sign In / Register</button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Home = () => {
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(true);
  const { isPremium, isLoggedIn, isAdmin, showToast } = useAuth();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.6 } });
    tl.fromTo(subtextRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5 }, 0.9)
      .fromTo(buttonRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5 }, 1.1);
  }, []);

  // Fetch components from API
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await getComponents();
        setComponents(data.data);
      } catch (err) {
        console.error('Failed to fetch components:', err);
        // Fallback to empty — the grid will just be empty
      } finally {
        setLoadingComponents(false);
      }
    };
    fetchComponents();
  }, []);

  const handleCopy = async (item: ComponentItem) => {
    if (item.codePrompt) {
      navigator.clipboard.writeText(item.codePrompt);
      showToast('Prompt copied to clipboard!');
      return;
    }

    if (!isLoggedIn) {
      showToast('Sign in to unlock this component', 'error');
      return;
    }

    // If it's premium and we don't have the prompt yet, try to unlock
    if (window.confirm(`Unlock "${item.title}"? This will use 1 of your download slots.`)) {
      try {
        const res = await unlockComponent(item._id);
        if (res.success) {
          showToast(res.message);
          // Re-fetch to get the unlocked prompt
          const data = await getComponents();
          setComponents(data.data);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to unlock', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await deleteComponent(id);
        setComponents(prev => prev.filter(c => c._id !== id));
        showToast('Component deleted successfully');
      } catch (err) {
        showToast('Failed to delete component', 'error');
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white/20">
      <Navbar />

      {/* Hero Section Container */}
      <div className="relative w-full h-[100vh] hero-u-shape overflow-hidden bg-black flex flex-col items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 brightness-75 scale-105">
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mt-[-5vh]">
          <h1 className="font-sans font-bold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white leading-[1.05] mb-6 flex flex-wrap justify-center gap-x-[1rem]">
            {headlineWords.map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + i * 0.1 }} className="inline-block">
                {word}
              </motion.span>
            ))}
            <motion.span key="in-seconds" initial={{ opacity: 0, filter: "blur(8px)", y: 15 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }} className="inline-block text-white/40">
              In seconds.
            </motion.span>
          </h1>
          <p ref={subtextRef} className="max-w-2xl text-[16px] md:text-[18px] text-white/70 font-sans leading-relaxed tracking-wide shadow-black drop-shadow-md" style={{ textWrap: 'balance' }}>
            Stop building from scratch. Drop incredibly designed, highly-interactive React sections straight into your codebase and ship world-class frontends today.
          </p>
          <div ref={buttonRef} className="mt-12 flex flex-col md:flex-row items-center justify-center gap-5 w-full">
            <Link to={isLoggedIn ? "#explore" : "/auth"} className="w-full md:w-auto">
              <motion.button whileHover={{ scale: 1.03, backgroundColor: '#ffffff', color: '#000000' }} whileTap={{ scale: 0.97 }} className="w-full px-7 py-3 rounded-full border border-white bg-white text-black text-sm font-semibold flex items-center justify-center transition-colors shadow-lg shadow-white/20">
                Get Started
              </motion.button>
            </Link>
            <motion.button 
              onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }} 
              whileTap={{ scale: 0.97 }} 
              className="w-full md:w-auto px-7 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-sm font-semibold flex items-center justify-center transition-colors"
            >
              Explore Components
            </motion.button>
          </div>
        </main>
      </div>

      {/* Masonry Components Grid Section */}
      <section id="explore" className="relative z-20 w-full max-w-[1400px] mx-auto px-6 pb-32 bg-transparent mt-[-2vh] pt-12">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-white/[0.02] rounded-[100%] blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="relative mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 pt-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Explore the Engine</h2>
            <p className="text-white/50 text-lg max-w-xl">Browse premium modules or copy free cinematic layouts directly to your clipboard.</p>
          </div>
          <div className="flex gap-4">
            <button className="text-[13px] uppercase tracking-wider font-semibold text-white/70 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-[inset_0_1px_rgba(255,255,255,0.1)]">All Components</button>
            <button className="text-[13px] uppercase tracking-wider font-semibold text-white/50 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5">Free Only</button>
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        {loadingComponents && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="break-inside-avoid bg-white/[0.02] rounded-[32px] overflow-hidden border border-white/5 h-[300px] animate-pulse" />
            ))}
          </div>
        )}

        {/* Live Component Grid */}
        {!loadingComponents && (
          <div className="relative z-10 columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {components.map((item, index) => (
              <motion.div key={item._id} initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: (index % 3) * 0.15 }} className="break-inside-avoid bg-[rgba(255,255,255,0.015)] backdrop-blur-2xl rounded-[32px] overflow-hidden border border-white/5 group hover:border-white/15 transition-all duration-500 ease-out flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_48px_rgba(255,255,255,0.03)] relative">
                <div className={`w-full ${item.heightClass} relative overflow-hidden bg-black/40`}>
                  <video src={item.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.08] transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] opacity-70 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="p-7 flex flex-row items-center justify-between relative bg-gradient-to-t from-black/90 to-black/20 mt-[-60px] pb-8">
                  <div className="flex flex-col gap-1.5 z-10">
                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight drop-shadow-md">{item.title}</h3>
                    <p className="text-sm text-white/50 font-medium tracking-wide uppercase">{item.category}</p>
                  </div>
                  <div className="z-10 flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                        className="p-2.5 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {item.isPremium && !isPremium ? (
                      <Link to="/pricing">
                        <button className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all border border-white/10 px-5 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-bold text-white/70 shadow-[inset_0_1px_rgba(255,255,255,0.1)]">
                          <Lock className="w-3.5 h-3.5" /> Premium
                        </button>
                      </Link>
                    ) : (
                      <button onClick={() => handleCopy(item)} className="flex items-center gap-2.5 bg-white/10 hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 border border-white/20 px-5 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-bold text-white shadow-[inset_0_1px_rgba(255,255,255,0.2)] group/btn">
                        {(item.isPremium && !item.codePrompt && !isAdmin) ? (
                          <><Lock className="w-3.5 h-3.5 group-hover/btn:text-black" /> Unlock</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 group-hover/btn:text-black" /> Copy</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loadingComponents && components.length === 0 && (
          <div className="text-center py-32">
            <p className="text-white/30 text-lg">No components yet. Be the first creator to submit one.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={
          <div className="bg-black min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/10" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/earn" element={<EarnPage />} />
            <Route path="/affiliates" element={<AffiliatePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
        <Footer />
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
};

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (textRef.current && footerRef.current) {
      // Rise and light sweep animation
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 0.25, // Increased visibility
          y: 0,
          duration: 2.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
          }
        }
      );
    }
  }, []);

  return (
    <footer ref={footerRef} className="relative pt-48 pb-0 px-12 overflow-hidden bg-[#000000] select-none border-t border-white/[0.02] group/footer min-h-[90vh] flex flex-col justify-end">
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-white/[0.01] blur-[220px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1600px] h-[600px] bg-white/[0.04] blur-[180px] rounded-full pointer-events-none transition-all duration-1000 group-hover/footer:bg-white/[0.08]" />

      {/* Floating Essential Links - Now Above Branding */}
      <div className="relative z-30 max-w-[1800px] mx-auto w-full pb-32 flex flex-col md:flex-row justify-between items-center gap-12 px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-32">
          <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.6em] leading-none">
            © {new Date().getFullYear()} LIVEHERO INC
          </p>
          <div className="flex gap-16">
            <Link to="/" className="text-[11px] font-bold text-white/20 hover:text-white uppercase tracking-[0.5em] transition-all">Components</Link>
            <Link to="/pricing" className="text-[11px] font-bold text-white/20 hover:text-white uppercase tracking-[0.5em] transition-all">Pricing</Link>
            <Link to="/earn" className="text-[11px] font-bold text-white/20 hover:text-white uppercase tracking-[0.5em] transition-all">Earn</Link>
          </div>
        </div>

        <div className="flex items-center gap-16">
          <a href="#" className="text-[10px] font-bold text-white/10 hover:text-white uppercase tracking-[0.6em] transition-all">Privacy Policy</a>
          <a href="#" className="text-[10px] font-bold text-white/10 hover:text-white uppercase tracking-[0.6em] transition-all">Terms of Service</a>
          <span className="text-white/5 text-[10px] font-bold tracking-[0.5em]">STABLE v1.0</span>
        </div>
      </div>

      {/* Massive Full-Width Faded Architectural Branding - ABSOLUTE BOTTOM */}
      <div className="relative z-10 w-full overflow-hidden translate-y-[2%]">
        <h2 
          ref={textRef}
          className="text-[18vw] md:text-[22vw] font-black leading-none text-white select-none pointer-events-none text-center transition-all duration-1000 group-hover/footer:opacity-30 group-hover/footer:scale-[1.01]"
          style={{
            fontFamily: '"Inter", "Outfit", system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.04em',
            maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 85%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 85%, black 100%)',
            opacity: 0.15,
            filter: 'drop-shadow(0 0 140px rgba(255,255,255,0.05)) blur(0.5px)'
          }}
        >
          LIVEHERO
        </h2>
        
        {/* Animated Light Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full animate-[sweep_12s_infinite] pointer-events-none mix-blend-overlay" />
      </div>

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%) skewX(-20deg); }
          12% { transform: translateX(200%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </footer>
  );
};

export default App;
