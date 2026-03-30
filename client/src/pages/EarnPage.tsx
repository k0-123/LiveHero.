import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createComponent, getMyComponents } from '../lib/api';

const CATEGORIES = ['Landing Page', 'SaaS', 'Portfolio', 'E-Commerce', 'Web App', 'Dashboard', 'Blog', 'Agency'];
const HEIGHT_OPTIONS = ['h-[240px]', 'h-[260px]', 'h-[320px]', 'h-[340px]', 'h-[400px]', 'h-[450px]'];

const EarnPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Landing Page');
  const [codePrompt, setCodePrompt] = useState('');
  const [isPremium] = useState(true);
  const [heightClass, setHeightClass] = useState('h-[320px]');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [myComponents, setMyComponents] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchHistory = async () => {
        try {
          const res = await getMyComponents();
          setMyComponents(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    } else {
      setLoadingHistory(false);
    }
  }, [isLoggedIn, success]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Video must be under 10MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please upload a 5-second showcase video');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('codePrompt', codePrompt);
      formData.append('isPremium', String(isPremium));
      formData.append('heightClass', heightClass);
      formData.append('video', videoFile);

      await createComponent(formData);
      setSuccess(true);
      setTitle('');
      setCodePrompt('');
      setVideoFile(null);
      setVideoPreview('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white/20">
      <div className="fixed top-6 left-8 z-50">
        <Link to="/" className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2 flex items-center justify-center shadow-lg transition-all hover:border-white/20">
          <span className="font-bold tracking-tighter text-white text-xl">livehero.</span>
        </Link>
      </div>

      <div className="fixed top-6 right-8 z-50">
        <nav className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full pl-8 pr-2 py-1.5 flex flex-row items-center gap-8 shadow-lg">
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">Home</Link>
            <span className="text-[12px] uppercase tracking-[0.1em] font-bold text-white">Earn</span>
            <Link to="/affiliates" className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">Affiliates</Link>
          </div>
          {isLoggedIn ? (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="text-[12px] uppercase tracking-wide font-bold bg-white text-black px-6 py-2.5 rounded-full"
            >
              {showForm ? 'View Submissions' : 'Submit Now'}
            </button>
          ) : (
            <Link to="/auth" className="text-[12px] uppercase tracking-wide font-bold bg-white text-black px-6 py-2.5 rounded-full">Sign In</Link>
          )}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {showForm && isLoggedIn && !success ? (
          <motion.section key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-32 pb-32 px-6 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <h1 className="text-4xl font-bold mb-3">Upload Component</h1>
              <p className="text-white/40 mb-10">Admin-submitted items go live immediately.</p>
              {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/20" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-4 text-white appearance-none">{CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}</select>
                  <select value={heightClass} onChange={(e) => setHeightClass(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl p-4 text-white appearance-none">{HEIGHT_OPTIONS.map(h => <option key={h} value={h} className="bg-black">{h}</option>)}</select>
                </div>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:bg-white/5">
                  {videoPreview ? <video src={videoPreview} autoPlay loop muted className="w-full max-h-40 object-cover rounded-xl" /> : <p className="text-white/30 text-sm">Upload Video (Max 10MB)</p>}
                  <input ref={fileInputRef} type="file" onChange={handleVideoChange} className="hidden" />
                </div>
                <textarea value={codePrompt} onChange={(e) => setCodePrompt(e.target.value)} placeholder="Paste whole code or prompt here..." required rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-mono text-sm resize-none focus:outline-none" />
                <button type="submit" disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]">{loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Submit Template'}</button>
              </form>
            </div>
          </motion.section>
        ) : success ? (
          <motion.section key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 mb-6" />
            <h1 className="text-3xl font-bold mb-8">Submission Received!</h1>
            <button onClick={() => { setSuccess(false); setShowForm(false); }} className="px-10 py-3 bg-white/10 rounded-full font-bold uppercase tracking-widest text-xs">View My Dashboard</button>
          </motion.section>
        ) : (
          <motion.section key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-32 px-6 flex flex-col items-center">
            <div className="max-w-4xl text-center mb-24">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">Monetize your <span className="text-white/40 italic">craft.</span></h1>
              <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">Get paid royalties for every premium template purchase you generate.</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => setShowForm(isLoggedIn)} className="bg-white text-black font-black px-10 py-5 rounded-full uppercase tracking-tighter text-sm">Submit Project</button>
                {isAdmin && <Link to="/admin" className="bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold px-10 py-5 rounded-full uppercase tracking-tighter text-sm">Review Queue</Link>}
              </div>
            </div>

            <div className="w-full max-w-6xl">
               <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><Play className="w-5 h-5 text-white/20" /> My Submission History</h2>
               {loadingHistory ? <Loader2 className="animate-spin text-white/10 mx-auto w-10 h-10" /> : myComponents.length === 0 ? (
                 <div className="p-20 text-center border border-dashed border-white/5 rounded-[40px] text-white/10 font-black uppercase tracking-widest">No Projects Yet</div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {myComponents.map(c => (
                     <div key={c._id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all">
                       <div className="h-40 bg-black relative">
                         <video src={c.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                         <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${c.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{c.status}</span>
                       </div>
                       <div className="p-6">
                         <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                         <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">{c.category}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EarnPage;
