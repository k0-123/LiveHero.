import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ExternalLink, Loader2, ShieldCheck, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPendingComponents, approveComponent } from '../lib/api';

interface PendingComponent {
  _id: string;
  title: string;
  category: string;
  videoUrl: string;
  codePrompt: string;
  creator: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminPage = () => {
  const { isLoggedIn, isAdmin, showToast } = useAuth();
  const navigate = useNavigate();
  const [components, setComponents] = useState<PendingComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin && !loading) {
      navigate('/');
      return;
    }

    const fetchPending = async () => {
      try {
        const data = await getPendingComponents();
        setComponents(data.data);
      } catch (err) {
        console.error('Failed to fetch pending components:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) fetchPending();
  }, [isAdmin, navigate, loading]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      await approveComponent(id, status);
      setComponents(prev => prev.filter(c => c._id !== id));
      showToast(`Component ${status} successfully!`);
    } catch (err) {
      showToast('Failed to update status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredComponents = components.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-white/20" />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="bg-[#050505] min-h-screen flex flex-col items-center justify-center text-center px-6">
        <ShieldCheck className="w-20 h-20 text-red-500/20 mb-8" />
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Access Restricted</h1>
        <p className="text-white/40 max-w-md mb-10 text-lg">
          This portal is reserved for authorized LiveHero curators. Please sign in with an admin account to continue.
        </p>
        <div className="flex gap-4">
          <Link to="/auth">
            <button className="bg-white text-black font-black px-10 py-4 rounded-full text-sm uppercase tracking-wider hover:scale-105 transition-all">
              Sign In
            </button>
          </Link>
          <Link to="/">
            <button className="bg-white/5 border border-white/10 text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-white/10 transition-all">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-white/20">
      {/* Navbar */}
      <div className="fixed top-0 inset-x-0 h-20 bg-black/40 backdrop-blur-3xl border-b border-white/5 z-50 flex items-center justify-between px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold tracking-tighter text-white text-xl">
             livehero<span className="text-white/30">.</span>admin
          </span>
          <div className="bg-amber-400/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-amber-400/20">
            Internal
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search components..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-all w-64"
            />
          </div>
          <Link to="/" className="text-[12px] uppercase tracking-widest font-bold text-white/50 hover:text-white transition-colors">
            Exit Portal
          </Link>
        </div>
      </div>

      <main className="pt-32 pb-20 px-10 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Curation Queue</h1>
            <p className="text-white/40 font-medium">Review and approve new submissions from the community.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4">
            <Clock className="w-5 h-5 text-white/20" />
            <div>
              <div className="text-2xl font-bold">{components.length}</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-white/20">Pending Reviews</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-white/20" />
            <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center bg-white/[0.01] border border-white/5 rounded-[48px]">
            <ShieldCheck className="w-16 h-16 text-white/10 mb-6" />
            <h3 className="text-2xl font-bold text-white/40">Queue is Clear</h3>
            <p className="text-white/20 max-w-sm mt-2">All community submissions have been reviewed. Good work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode='popLayout'>
            {filteredComponents.map((comp) => (
              <motion.div 
                key={comp._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden flex flex-col lg:flex-row p-6 gap-8 group hover:border-white/15 transition-all duration-500"
              >
                {/* Video Preview Section */}
                <div className="lg:w-[400px] h-[225px] flex-shrink-0 bg-black rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl">
                  <video 
                    src={comp.videoUrl} 
                    autoPlay loop muted playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-white/10">
                      {comp.category}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{comp.title}</h2>
                        <p className="text-white/30 text-sm flex items-center gap-2">
                          Submitted by <span className="text-white font-medium">{comp.creator.name}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          {new Date(comp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a 
                        href={comp.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white/40" />
                      </a>
                    </div>
                    
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-5 mb-4 group/code relative">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Source Snippet</span>
                         <button onClick={() => {
                           navigator.clipboard.writeText(comp.codePrompt);
                           showToast('Prompt copied!');
                         }} className="text-[10px] font-bold text-white/30 hover:text-white transition-colors">Copy Prompt</button>
                      </div>
                      <div className="text-xs font-mono text-white/40 h-24 overflow-hidden mask-fade-bottom">
                         {comp.codePrompt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleStatusUpdate(comp._id, 'approved')}
                      disabled={!!actionLoading}
                      className="flex-1 bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {actionLoading === comp._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Approve Submission
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(comp._id, 'rejected')}
                      disabled={!!actionLoading}
                      className="px-8 py-4 bg-red-500/10 text-red-400 border border-red-500/20 font-black rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === comp._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
