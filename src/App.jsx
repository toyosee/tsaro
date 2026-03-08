import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, Users, MapPin, Bell, Smartphone, 
  ChevronRight, ArrowRight, AlertTriangle, CheckCircle, 
  X, Loader2, ShieldCheck 
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                      {/* <ShieldCheck className="text-[#FF9F1C]" size={32} /> */}
                      {/* Properly add the logo exactly below the shild icon*/}
                      <img src="/tsaro_logo.png" alt="Tsaro Logo" className="w-30 h-10 mx-auto mt-2" />
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
      {/* 2. Fixed Header with dynamic styling */}
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-5 ${
      isScrolled 
      ? "bg-[#1B1B3A]/90 backdrop-blur-md shadow-xl border-b border-white/5" 
      : "bg-[#1B1B3A]"
    }`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter text-white">TSARO</h1>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs font-bold opacity-60 uppercase tracking-widest text-white">
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
      
      <div className="h-[76px] bg-[#1B1B3A]" />

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

      {/* --- CORE SOLUTION (Step-by-Step Progression) --- */}
      <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-16">
            <motion.h4 
              variants={fadeInUp}
              className="text-[#1B1B3A] text-4xl md:text-5xl font-black tracking-tight"
            >
              Tsaro works <span className="text-[#FF9F1C] italic">differently.</span>
            </motion.h4>
            <div className="h-1.5 w-24 bg-[#FF9F1C] mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              { 
                i: <Eye />, 
                t: "Silent Monitor", 
                d: "The app runs as a hidden system service. If a criminal takes your phone, they won't even see Tsaro is active." 
              },
              { 
                i: <Bell />, 
                t: "Instant Detection", 
                d: "If you deviate from your route or your phone detects high-stress keywords, the silent countdown begins." 
              },
              { 
                i: <Users />, 
                t: "Safety Mesh", 
                d: "If you don't cancel, your trusted circle and nearby users are instantly alerted with live audio and GPS." 
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-50 transition-all relative group"
              >
                {/* 1, 2, 3 Count Indicator */}
                <div className="absolute top-8 right-10 text-6xl font-black text-slate-50 group-hover:text-amber-50 transition-colors pointer-events-none">
                  0{i + 1}
                </div>

                {/* Icon Wrapper */}
                <div className="w-16 h-16 bg-[#1B1B3A] rounded-2xl flex items-center justify-center text-[#FF9F1C] mb-8 shadow-lg shadow-indigo-900/10">
                  {f.i}
                </div>

                <h4 className="text-2xl font-black mb-4 text-[#1B1B3A] flex items-center gap-3">
                  <span className="text-xs bg-[#FF9F1C] text-[#1B1B3A] w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {f.t}
                </h4>
                
                <p className="text-slate-500 leading-relaxed font-medium">
                  {f.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NIGERIAN ROADS FACE-LIFT --- */}
      <section className="py-32 px-6 bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          
          <div className="relative">
            {/* Subtle background accent */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-60 -z-10" />
            
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
              <h3 className="text-5xl md:text-6xl font-black mb-8 text-[#1B1B3A] leading-[0.95] tracking-tighter">
                Built for the <br />
                <span className="text-[#E63946] relative">
                  Nigerian Commute.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 350 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 9.5C80 -1.5 267 -1.5 346.5 9.5" stroke="#FF9F1C" strokeWidth="5" strokeLinecap="round"/>
                  </svg>
                </span>
              </h3>
              
              <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg">
                From the 2-hour crawl on <span className="text-[#1B1B3A] font-bold">Third Mainland Bridge</span> to the high-speed stretches of <span className="text-[#1B1B3A] font-bold">Abuja-Kaduna express</span>, Tsaro is calibrated for our reality.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Smartphone className="text-[#FF9F1C]" />, title: "Ghost Mode", desc: "App stays hidden from 'stop and search' or snatch-and-run scenarios." },
                  { icon: <MapPin className="text-[#FF9F1C]" />, title: "Traffic-Aware AI", desc: "Recognizes the difference between 'Gidi' traffic and a dangerous diversion." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="mt-1 w-10 h-10 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-[#FF9F1C]/10 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="font-black text-[#1B1B3A] text-lg uppercase tracking-tight">{item.title}</h5>
                      <p className="text-slate-500 text-sm leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* The "Privacy Vault" Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Decorative "Nigerian Green" badge */}
            <div className="absolute -top-4 -right-4 bg-[#008751] text-white text-[10px] font-black px-4 py-1.5 rounded-full z-20 shadow-xl border-2 border-white rotate-12">
              LOCAL DATA PROTECTION
            </div>

            <div className="bg-[#1B1B3A] rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-indigo-400/20">
              {/* Abstract Security Pattern Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />
              
              <div className="relative z-10">
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                  <ShieldCheck size={40} className="text-[#FF9F1C]" />
                </div>
                
                <h4 className="text-3xl font-black mb-4 tracking-tight">Your data is protected.</h4>
                <p className="text-indigo-200/70 mb-10 leading-relaxed text-lg">
                  We don't track you. Period. Our proprietary <span className="text-white font-bold underline decoration-[#FF9F1C]">On-Device Intelligence</span> ensures your location is only shared when you are in verified danger.
                </p>
                
                <button 
                  onClick={openModal} 
                  className="group relative w-full bg-white text-[#1B1B3A] px-8 py-5 rounded-2xl font-black text-lg hover:bg-[#FF9F1C] hover:text-[#1B1B3A] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  JOIN THE RESISTANCE
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

{/* --- STREAMLINED FOOTER --- */}
      <footer className="bg-[#1B1B3A] text-white pt-20 pb-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            
            {/* Brand & Purpose */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-[#FF9F1C]" size={28} />
                <span className="text-xl font-black tracking-tighter uppercase">TSARO</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
                A sovereign privacy protocol for personal safety. 
                Built to detect emergencies silently and alert your mesh network instantly.
              </p>
              
              {/* System Status - Moved up for visibility during dev */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Development Phase: v0.1.0-alpha
                </span>
              </div>
            </div>

            {/* Direct Action */}
            <div className="md:text-right flex flex-col md:items-end justify-start">
              <h5 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-6">Next Steps</h5>
              <ul className="space-y-4 text-sm font-bold">
                <li 
                  onClick={openModal} 
                  className="text-[#FF9F1C] hover:text-white cursor-pointer transition-colors flex items-center md:justify-end gap-2"
                >
                  Join Waitlist <ArrowRight size={16} />
                </li>
                <li className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                  {/* Privacy Protocol */}
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1">
                © {new Date().getFullYear()} Barterverse Technologies Ltd. 🇳🇬
              </p>
              <p className="text-[9px] text-slate-600 font-medium">
                Designed for Nigerian Roads. Engineered in Kaduna.
              </p>
            </div>
            
            {/* Socials - Simplified */}
            {/* <div className="flex gap-6 opacity-40 hover:opacity-100 transition-opacity">
               <a href="#" className="text-xs font-black uppercase tracking-widest hover:text-[#FF9F1C]">Twitter</a>
               <a href="#" className="text-xs font-black uppercase tracking-widest hover:text-[#FF9F1C]">LinkedIn</a>
            </div> */}
          </div>
        </div>
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