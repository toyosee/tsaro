import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, Users, MapPin, Bell, Smartphone, 
  ChevronRight, ArrowRight, AlertTriangle, CheckCircle, 
  Heart, X, Loader2, ShieldCheck 
} from 'lucide-react';
import { Client, Databases, ID, Query } from 'appwrite';

// --- APPWRITE CONFIG ---
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // 1. Popup Triggers: Exit Intent & 30s Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!submitted) setShowPopup(true);
    }, 30000);

    const handleExitIntent = (e) => {
      if (e.clientY <= 0 && !submitted) setShowPopup(true);
    };

    document.addEventListener('mouseleave', handleExitIntent);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleExitIntent);
    };
  }, [submitted]);

  // 2. Open Modal Utility (Resets state for a clean experience)
  const openModal = () => {
    setError('');
    setSubmitted(false);
    setEmail('');
    setShowPopup(true);
  };

  // 3. Submission Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check for existing email to avoid raw 409 errors
      const existing = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        [Query.equal('email', email.toLowerCase().trim())]
      );

      if (existing.total > 0) {
        setError('You are already on the waitlist! We will be in touch.');
        setLoading(false);
        return;
      }

      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        { 
          email: email.toLowerCase().trim(),
          source: 'landing-page',
          timestamp: new Date().toISOString()
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting email:', err);
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-slate-900 overflow-x-hidden font-sans">
      
      {/* --- THE POPUP MODAL --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full relative z-10 shadow-2xl border border-slate-100"
            >
              <button onClick={() => setShowPopup(false)} className="absolute top-6 right-6 text-slate-400 hover:text-indigo-900 transition-colors">
                <X size={24} />
              </button>

              <div className="text-center">
                {!submitted ? (
                  <>
                    <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="text-[#FF9F1C]" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-[#1B1B3A] mb-3 tracking-tight">Join the Waitlist</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed text-sm">Be the first to know when the silent guardian launches in your city.</p>
                    
                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-semibold">
                        <AlertTriangle size={14} className="shrink-0" /> {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email" placeholder="Enter your email" value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                        className="w-full px-6 py-4 border border-slate-100 bg-slate-50 rounded-xl focus:ring-2 focus:ring-[#FF9F1C] outline-none transition-all"
                      />
                      <button disabled={loading} className="w-full bg-[#1B1B3A] text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Secure My Spot'} <ArrowRight size={18} />
                      </button>
                    </form>
                  </>
                ) : (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-4">
                    <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="text-emerald-600" size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-[#1B1B3A] mb-2">You're In!!!</h3>
                    <p className="text-slate-500 mb-8 text-sm">We've added you to the priority list. Watch your inbox closely.</p>
                    <button onClick={() => setShowPopup(false)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">
                      Close
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HEADER  --- */}
      <header className="bg-[#1B1B3A] text-white py-5 px-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter">TSARO</h1>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold opacity-60 uppercase tracking-widest">
              <MapPin size={14} className="text-[#FF9F1C]" />
              <span>Lagos • Abuja • Port Harcourt</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openModal}
              className="text-xs bg-[#FF9F1C] text-[#1B1B3A] px-6 py-2.5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-orange-500/20"
            >
              Join Waitlist
            </motion.button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="bg-[#1B1B3A] text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeInUp} className="text-[#FF9F1C] font-black tracking-widest text-xs mb-6 bg-[#FF9F1C]/10 w-fit px-4 py-2 rounded-full border border-[#FF9F1C]/20 flex items-center gap-2">
              <Shield size={14} /> THE SILENT GUARDIAN
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
              Security that works <span className="text-[#FF9F1C] italic block mt-2">when you can't.</span>
            </motion.h2>
            <motion.div variants={fadeInUp} className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 leading-relaxed">
              Tsaro detects emergencies instantly, creates a safety mesh with people around you, and notifies your loved ones.
              <span className="block text-[#FF9F1C] mt-4 font-bold">No button. No hesitation. No wasted time.</span>
            </motion.div>
            <motion.button 
              onClick={openModal} 
              variants={fadeInUp} 
              className="bg-[#FF9F1C] text-[#1B1B3A] px-12 py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 flex items-center gap-3"
            >
              SECURE YOUR SPOT <ArrowRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="text-center mb-16 px-4">
        {/* Urgency Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 text-[#E63946] font-black tracking-widest text-[10px] uppercase mb-4 bg-red-50 px-4 py-2 rounded-full border border-red-100"
        >
          <AlertTriangle size={14} className="animate-pulse" /> Speed is Survival
        </motion.div>

        {/* Main Header with Attention-Grabbing Red */}
        <motion.h3 
          variants={fadeInUp} 
          className="text-5xl md:text-7xl font-black mb-6 text-[#1B1B3A] tracking-tighter leading-[0.95]"
        >
          One Chance happens in 
          <span className="relative inline-block ml-2 text-[#E63946] italic">
            seconds.
            {/* Decorative underline/strike for emphasis */}
            <motion.span 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-1 left-0 h-1.5 bg-[#FF9F1C]/30 -z-10"
            />
          </span>
        </motion.h3>

        {/* The "Danger" Explanation */}
        <motion.p 
          variants={fadeInUp} 
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
        >
          Traditional safety apps fails in a real crisis. By the time you reach for a 
          <span className="text-[#E63946] font-bold"> "Panic Button,"</span> your phone is already gone, or your hands are tied. 
          <span className="block mt-4 text-[#1B1B3A] font-black">
            In Nigeria today, speed and swift response isn't a feature, it's survival.
          </span>
        </motion.p>
      </div>
          {/* <p className="text-slate-500 text-xl max-w-2xl mx-auto">Most safety apps fail because they require a manual trigger. In a crisis, you don't have that luxury.</p> */}
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { v: "3-5s", l: "To React", d: "Before your phone is snatched." },
            { v: "20mins+", l: "Police Response", d: "Too late for active kidnapping attempts." },
            { v: "₦200k+", l: "Avg. Ransom", d: "The high price of urban insecurity." }
          ].map((s, i) => (
            <div key={i} className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl font-black text-red-600 mb-2">{s.v}</div>
              <div className="font-bold text-slate-800 mb-2">{s.l}</div>
              <div className="text-sm text-slate-500">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CORE SOLUTION --- */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { i: <Eye />, t: "Undetectable", d: "Disguised as a system service. Criminals can't disable what they can't find." },
            { i: <Bell />, t: "Auto-Detection", d: "Route deviation or threat keywords trigger an automatic alert countdown." },
            { i: <Users />, t: "Safety Mesh", d: "Instantly alerts your trusted circle with live GPS and audio context." }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
              <div className="text-[#FF9F1C] mb-6">{f.i}</div>
              <h4 className="text-2xl font-black mb-4 text-[#1B1B3A]">{f.t}</h4>
              <p className="text-slate-500 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- NIGERIAN ROADS --- */}
      <section className="py-24 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black mb-6 text-[#1B1B3A] leading-[1.1]">
              Built for <span className="text-[#FF9F1C] italic">Nigerian roads.</span>
            </h3>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Tsaro understands Lagos traffic, Abuja highways, and the unique security landscape of urban Nigeria.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Smartphone className="text-[#FF9F1C] shrink-0" />
                <p className="text-sm font-bold text-slate-700">iOS & Android Hidden Mode</p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-[#FF9F1C] shrink-0" />
                <p className="text-sm font-bold text-slate-700">Community Safety Mesh</p>
              </div>
            </div>
          </div>
          <div className="bg-[#1B1B3A] rounded-[3rem] p-12 text-white text-center">
            <ShieldCheck size={60} className="mx-auto text-[#FF9F1C] mb-6" />
            <h4 className="text-2xl font-black mb-4">Privacy First.</h4>
            <p className="text-slate-400 mb-8">All data is processed on-device. We never see your location unless an alert is active.</p>
            <button onClick={openModal} className="bg-[#FF9F1C] text-[#1B1B3A] px-8 py-4 rounded-xl font-black w-full">Join Thousands</button>
          </div>
        </div>
      </section>

      <footer className="bg-[#1B1B3A] text-white py-20 px-6 text-center">
        <Shield className="mx-auto mb-1 text-[#FF9F1C]" size={40} />
        <strong className='mx-auto mb-4 text-[#FF9F1C]'>TSARO</strong>
        <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.4em]">© {new Date().getFullYear()} Barterverse Technologies Ltd. 🇳🇬</p>
      </footer>

      <BackToTop />
    </div>
  );
}

const BackToTop = () => {
  const [v, setV] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => setV(window.scrollY > 500));
  }, []);
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: v ? 1 : 0 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 bg-[#FF9F1C] text-[#1B1B3A] p-4 rounded-2xl shadow-2xl z-50"
    >
      <ChevronRight className="-rotate-90" />
    </motion.button>
  );
};

export default App;