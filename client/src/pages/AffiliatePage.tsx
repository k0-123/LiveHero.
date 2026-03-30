import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Copy, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAffiliateStats } from '../lib/api';

const AffiliatePage = () => {
  const { isLoggedIn, user, showToast } = useAuth();
  const [stats, setStats] = useState({
    referralCode: '',
    referralsCount: 0,
    totalEarned: 0,
    pendingBalance: 0,
    commissionRate: 40
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (isLoggedIn) {
        try {
          const res = await getAffiliateStats();
          if (res.success) setStats(res.data);
        } catch (err) {
          console.error('Failed to fetch stats:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isLoggedIn]);

  const referralLink = `${window.location.origin}/auth?ref=${stats.referralCode || user?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-white/20" />
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white/20 p-8 md:p-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-20">
        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </Link>
        <div className="font-black text-2xl tracking-tighter">livehero.</div>
      </div>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-none italic opacity-80">Affiliate Center</h1>
        <p className="text-white/40 text-lg mb-16 max-w-xl">Earn {stats.commissionRate}% commission on every lifetime plan referral.</p>

        {!isLoggedIn ? (
          <div className="p-12 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
            <h2 className="text-2xl font-bold mb-4">Start earning today.</h2>
            <p className="text-white/40 mb-8 max-w-sm mx-auto">Join our partnership program and get a {stats.commissionRate}% cut for life.</p>
            <Link to="/auth">
              <button className="bg-white text-black font-black px-10 py-4 rounded-full text-[12px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all">
                Join Program
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Referrals</p>
                <div className="text-4xl font-bold">{stats.referralsCount}</div>
              </div>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Total Earned</p>
                <div className="text-4xl font-bold">₹{stats.totalEarned / 100}</div>
              </div>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Pending Balance</p>
                <div className="text-4xl font-bold text-amber-500/80">₹{stats.pendingBalance / 100}</div>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="p-10 rounded-[40px] bg-white/[0.03] border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Your Referral Link</h3>
                  <p className="text-white/30 text-sm mb-6">Users who sign up via this link will be credited to you.</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black p-4 rounded-2xl border border-white/5 font-mono text-xs text-white/50 overflow-hidden truncate">
                      {referralLink}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-transform"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                    <button className="w-full md:w-auto bg-white/5 border border-white/10 px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 cursor-not-allowed">
                      Request Payout
                    </button>
                    <p className="text-[10px] text-center mt-3 text-white/20 font-bold uppercase tracking-wide">Min. ₹500 required</p>
                </div>
              </div>
            </div>

            {/* Fast Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20"><Users className="w-5 h-5" /></div>
                 <div>
                    <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Referral Window</h4>
                    <p className="text-xs text-white/30 leading-relaxed">Cookies are tracked for 60 days. Even if they browse and buy later, you get the credit.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20"><CreditCard className="w-5 h-5" /></div>
                 <div>
                    <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Payment Cycle</h4>
                    <p className="text-xs text-white/30 leading-relaxed">Payouts are processed manually every Sunday for accounts over ₹500.</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AffiliatePage;
