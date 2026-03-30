import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createCheckout, verifyPayment } from '../lib/api';

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PricingPage = () => {
  const { isLoggedIn, user, showToast } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }

    setLoadingPlan(plan);
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        showToast('Razorpay SDK failed to load. Are you online?', 'error');
        setLoadingPlan(null);
        return;
      }

      const orderData = await createCheckout(plan);
      
      if (orderData.free) {
        window.location.reload();
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LiveHero',
        description: `Lifetime ${plan} access`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            showToast('Payment successful!', 'success');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          } catch (err: any) {
            showToast('Payment verification failed', 'error');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#09090b',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        showToast('Payment failed: ' + response.error.description, 'error');
      });
      paymentObject.open();

    } catch (err: any) {
      showToast(err.message || 'Failed to initialize payment', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="bg-[#09090b] min-h-screen text-white selection:bg-white/20">
      
      {/* Navbar Logo */}
      <div className="fixed top-6 left-8 z-[60]">
        <Link to="/" className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full px-5 py-2 flex items-center justify-center shadow-lg transition-all hover:border-white/20">
          <span className="font-sans font-extrabold tracking-tighter text-white text-xl flex items-center gap-1">
            livehero<span className="text-white/40">.</span>
          </span>
        </Link>
      </div>

      <div className="fixed top-6 right-8 z-[60] flex items-center gap-4">
        <nav className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full pl-8 pr-2 py-1.5 flex flex-row items-center gap-8 shadow-lg">
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[12px] uppercase tracking-[0.1em] font-medium text-white/60 hover:text-white transition-colors">Home</Link>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-[12px] font-bold text-white/70">{user?.name?.split(' ')[0]}</span>
                {user?.isPremium && (
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                    {user.plan}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <Link to="/auth" className="text-[12px] uppercase tracking-wide font-bold bg-white text-black px-6 py-2.5 rounded-full">
              Sign In
            </Link>
          )}
          {/* Mobile Home Link */}
          <Link to="/" className="md:hidden p-2.5 bg-white/5 border border-white/10 rounded-full text-white/70">
            <Zap className="w-4 h-4" />
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-white/10 to-transparent" 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] contrast-150 brightness-150" />
        </div>
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="relative z-10 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
            <Shield className="w-3 h-3 text-white/40" /> Lifetime Ownership
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-2 leading-[0.85] uppercase">
            Unlimited Prompts,<br/>
            <span className="text-white/40">Unlimited</span> <span className="text-white/20 italic">Access</span>
          </h1>
          
          <p className="mt-8 text-xl text-white/50 max-w-2xl font-medium leading-relaxed">
            Since subscription plans can be unreliable, we offer only lifetime deals — ideal for freelancers, solo designers, and small teams.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 relative z-10 w-full">
          
          <PricingCard 
            title="Go Unlimited"
            desc="Kickstart your projects with instant access to our hand-picked free library."
            price="₹0"
            priceLabel="Forever Free"
            plan="unlimited"
            btnText="Get Free Access"
            loading={loadingPlan === 'unlimited'}
            currentPlan={user?.plan}
            onCheckout={handleCheckout}
            features={[
              'Instant Access to Free Components',
              'Standard Commercial License',
              'Lifetime Free Updates',
              'Basic Community Support'
            ]}
          />

          <PricingCard 
            title="Power"
            desc="Instantly unlock our entire premium library with zero recurring fees."
            price="₹99"
            priceLabel="Lifetime — One-time"
            plan="power"
            btnText="Get Power Access"
            isPopular={true}
            loading={loadingPlan === 'power'}
            currentPlan={user?.plan}
            onCheckout={handleCheckout}
            features={[
              '100% Access to all Premium Assets',
              'Original Source Code & Video Files',
              'Zero Monthly Fees — Yours Forever',
              'VIP Priority for Custom Requests'
            ]}
          />

          <PricingCard 
            title="Creator"
            desc="Launch your digital agency. Resell assets & earn industry-leading commissions."
            price="₹129"
            priceLabel="Lifetime — One-time"
            plan="creator"
            btnText="Get Creator Access"
            loading={loadingPlan === 'creator'}
            currentPlan={user?.plan}
            onCheckout={handleCheckout}
            features={[
              'Includes Everything in Power Plan',
              'Unrestricted Commercial Resale Rights',
              'Monetize via your Creator Dashboard',
              'Keep an Industry-Leading 70% Cut'
            ]}
          />

        </div>
      </section>
    </div>
  );
};

const PricingCard = ({ title, desc, price, priceLabel, plan, btnText, features, isPopular = false, loading, currentPlan, onCheckout }: any) => {
  const isCurrentPlan = currentPlan === plan;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className={`relative p-10 rounded-[40px] border flex flex-col text-left transition-all duration-500 overflow-hidden ${
        isPopular ? 'bg-white/[0.04] border-white/20 shadow-2xl' : 'bg-white/[0.02] border-white/5'
      }`}
    >
      {isPopular && (
         <div className="absolute top-8 right-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-black text-[10px] font-bold uppercase tracking-wider">
           <Zap className="w-3 h-3 fill-black" /> Most Popular
         </div>
      )}

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/40 text-sm mb-12 font-medium leading-relaxed">{desc}</p>
      
      <div className="mb-4 flex items-center gap-2">
        <div className="w-full h-[1px] bg-white/5" />
      </div>

      <div className="mb-10">
        <div className="text-5xl font-bold tracking-tighter mb-2">{price}</div>
        <p className="text-white/40 text-[12px] font-bold uppercase tracking-widest">{priceLabel}</p>
      </div>

      <button 
        onClick={() => onCheckout(plan)}
        disabled={loading || isCurrentPlan}
        className={`w-full py-5 rounded-2xl font-extrabold text-[12px] uppercase tracking-wider transition-all mb-10 flex items-center justify-center gap-2 disabled:opacity-50 ${
          isCurrentPlan 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
            : isPopular 
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-black hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-white text-black hover:bg-white/90'
        }`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isCurrentPlan ? (
          <><Check className="w-4 h-4" /> Current Plan</>
        ) : (
          btnText
        )}
      </button>

      <div className="space-y-4">
        {features.map((feature: string, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-white/40" />
            </div>
            <span className="text-[13px] font-medium text-white/50">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PricingPage;
