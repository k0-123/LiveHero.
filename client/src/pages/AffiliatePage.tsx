import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Share2, Users, CreditCard, TrendingUp, Copy, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAffiliateStats } from '../lib/api';

const AffiliatePage = () => {
  const { isLoggedIn, user } = useAuth();
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeSubscribers: 0,
    totalEarnings: 0,
    pendingPayout: 0
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (isLoggedIn) {
        try {
          const data = await getAffiliateStats();
          setStats(data);
        } catch (err) {
          console.error('Failed to fetch affiliate stats:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isLoggedIn]);

  const referralLink = `${window.location.origin}/auth?ref=${user?._id || 'login'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white/20">
      {/* Navbar */}
      <div className="fixed top-6 left-8 z-50">
        <Link to="/" className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2 flex items-center justify-center shadow-lg transition-all hover:border-white/20">
          <span className="font-bold tracking-tighter text-white text-xl">
            livehero<span className="text-white/30">.</span>
          </span>
        </Link>
      </div>

      <div className="fixed top-6 right-8 z-50">
        <nav className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full pl-8 pr-2 py-1.5 flex flex-row items-center gap-8 shadow-lg">
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">Home</Link>
            <Link to="/earn" className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">Earn</Link>
            <span className="text-[12px] uppercase tracking-[0.1em] font-bold text-white">Affiliates</span>
          </div>
          {!isLoggedIn && (
            <Link to="/auth" className="text-[12px] uppercase tracking-wide font-bold bg-white text-black px-6 py-2.5 rounded-full hidden md:block">
              Join Program
            </Link>
          )}
        </nav>
      </div>

      <main className="pt-32 pb-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-white/40"
          >
            <Share2 className="w-3 h-3" /> Partnership Program
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Share the <span className="text-white/40 italic">Engine.</span><br />
            Earn <span className="text-white/20">40% Monthly.</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Invite fellow developers to LiveHero. For every person who upgrades to a lifetime plan through your link, you get a 40% commission.
          </p>
        </div>

        {isLoggedIn ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Referral Stats */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-8">Your Performance</h2>
              {loading ? (
                <div className="flex items-center justify-center p-20 bg-white/[0.02] rounded-[40px] border border-white/5">
                  <Loader2 className="w-8 h-8 animate-spin text-white/20" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <StatCard icon={<Users />} label="Total Referrals" value={stats.totalReferrals} />
                  <StatCard icon={<TrendingUp />} label="Conversions" value={stats.activeSubscribers} />
                  <StatCard icon={<CreditCard />} label="Total Earned" value={`$${(stats?.totalEarnings || 0).toFixed(2)}`} />
                  <StatCard icon={<TrendingUp />} label="Pending Payout" value={`$${(stats?.pendingPayout || 0).toFixed(2)}`} />
                </div>
              )}
            </div>

            {/* Link & Invite */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-8">Your Referral Link</h2>
              <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Share2 className="w-24 h-24" />
                </div>
                <p className="text-white/40 text-sm font-medium mb-4">Share this link to start earning</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 font-mono text-sm text-white/70 overflow-hidden text-ellipsis whitespace-nowrap">
                    {referralLink}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-4 rounded-2xl bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-8 flex items-center gap-4 text-white/30 text-xs font-bold uppercase tracking-widest">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-white/10" />
                    ))}
                  </div>
                  1,200+ Partners joined this week
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-amber-400/5 border border-amber-400/10">
                <h3 className="text-amber-400 font-bold mb-2">Pro Tip</h3>
                <p className="text-amber-400/60 text-sm leading-relaxed">
                  Referrals are tracked via cookies for 60 days. Even if they don't buy today, you'll still get credited if they return later.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-12 rounded-[48px] bg-white/[0.02] border border-white/10 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to partner?</h2>
            <p className="text-white/40 mb-10">Create an account to get your unique referral link and start tracking earnings.</p>
            <Link to="/auth">
              <button className="bg-white text-black font-black px-12 py-5 rounded-full text-sm uppercase tracking-wider hover:scale-105 transition-all">
                Get Started Now
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/30 group-hover:text-white/60 transition-colors">
      {icon}
    </div>
    <p className="text-white/30 text-[10px] uppercase tracking-widest font-black mb-1">{label}</p>
    <div className="text-3xl font-bold tracking-tight">{value}</div>
  </div>
);

export default AffiliatePage;
