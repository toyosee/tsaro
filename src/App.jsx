import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, Eye, Users,MapPin, Bell, Smartphone, ChevronRight, ArrowRight,AlertTriangle, CheckCircle, Heart } from 'lucide-react';
import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        { 
          email,
          source: 'landing-page',
          timestamp: new Date().toISOString()
        }
      );
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[--color-tsaro-cream]">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-tsaro-indigo text-white py-4 px-6 sticky top-0 z-50 shadow-lg"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.h1 
            whileHover={{ scale: 1.02 }}
            className="text-2xl font-bold tracking-tight"
          >
            TSARO
          </motion.h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-75 hidden sm:block">Lagos • Abuja • PH</span>
            <span className="text-sm bg-tsaro-amber px-4 py-1.5 rounded-full font-medium shadow-lg">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tsaro-indigo to-tsaro-indigo/95 text-white relative overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-tsaro-amber rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 text-tsaro-amber mb-4 bg-tsaro-amber/10 px-4 py-2 rounded-full w-fit">
              <Shield size={18} />
              <span className="text-sm font-semibold tracking-wider">SILENT GUARDIAN</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Security that works
              <span className="text-tsaro-amber block">when you can't.</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Tsaro detects emergencies automatically and alerts your loved ones.
              <span className="text-tsaro-amber block mt-2 font-semibold">No button to press. No panic. No delay.</span>
            </motion.p>

            {/* Stats Row */}
            <motion.div variants={fadeInUp} className="flex gap-8 mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">2,000+</div>
                <div className="text-xs sm:text-sm text-gray-300">Incidents monthly</div>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">₦200k+</div>
                <div className="text-xs sm:text-sm text-gray-300">Average ransom</div>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">3-5s</div>
                <div className="text-xs sm:text-sm text-gray-300">To react</div>
              </div>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-400 text-white p-4 rounded-xl text-sm mb-4 backdrop-blur flex items-center gap-2"
              >
                <AlertTriangle size={18} />
                {error}
              </motion.div>
            )}
            
            {/* Waitlist Form */}
            {!submitted ? (
              <motion.form 
                variants={fadeInUp}
                onSubmit={handleSubmit} 
                className="flex flex-col sm:flex-row gap-4 max-w-xl"
              >
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-5 py-4 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-tsaro-amber] shadow-lg"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="bg-tsaro-amber hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                  <ArrowRight size={18} />
                </motion.button>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-500/20 border border-green-400 text-white p-5 rounded-xl max-w-md backdrop-blur flex items-start gap-3"
              >
                <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-lg">You're on the list!</p>
                  <p className="text-sm opacity-90">We'll notify you when Tsaro launches.</p>
                </div>
              </motion.div>
            )}
            
            <motion.p variants={fadeInUp} className="text-sm text-gray-300 mt-6 flex items-center gap-1">
              <span className="text-xl">🇳🇬</span> Built in Nigeria, for Nigerians.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="text-center mb-16"
          >
            <motion.h3 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 text-tsaro-indigo">
              One Chance happens in <span className="text-tsaro-amber">seconds</span>.
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          <p>
            Most safety apps fail because they require you to press a button or launch an app. 
            <span className="block font-semibold text-tsaro-indigo mt-2">
              In a life‑threatening moment, you don’t get that chance.
            </span>
          </p>
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "3-5", label: "Seconds to react", desc: "Before your phone is gone", color: "red" },
              { value: "15-30", label: "Minutes for police", desc: "Too late for active kidnapping", color: "red" },
              { value: "₦200k+", label: "Average ransom", desc: "Plus trauma that lasts", color: "red" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all"
              >
                <div className="bg-red-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3 hover:rotate-0 transition-transform">
                  <span className="text-3xl font-bold text-red-600">{item.value}</span>
                </div>
                <h4 className="font-bold text-xl mb-2 text-gray-800">{item.label}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-tsaro-indigo to-tsaro-indigo/95 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtMjAgMjAgMjAgMjAgMCAwIDEtMjAtMjAgMjAgMjAgMCAwIDEgMjAtMjB6IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="text-center mb-16"
          >
            <motion.h3 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4">
              Tsaro works <span className="text-tsaro-amber">differently</span>.
            </motion.h3>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Eye size={32} />, title: "Silent Monitoring", desc: "Tsaro watches in the background. You forget it's there." },
              { icon: <Bell size={32} />, title: "Automatic Detection", desc: "Route deviation or threat words recognition triggers a 60-second countdown." },
              { icon: <Users size={32} />, title: "Instant Alert", desc: "No response? Your emergency contact gets your location." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl text-center border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="bg-tsaro-amber/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <div className="absolute -top-2 -right-2 bg-tsaro-amber text-white w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <div className="text-tsaro-amber">
                    {item.icon}
                  </div>
                </div>
                <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="bg-tsaro-amber/10 border border-tsaro-amber/30 p-6 rounded-2xl inline-block">
              <p className="text-2xl font-semibold text-tsaro-amber">
                No button to press. No panic. No delay.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="text-center mb-12"
          >
            <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4 text-tsaro-indigo">
              Built for <span className="text-tsaro-amber">Nigerian roads</span>
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tsaro understands Lagos traffic, Abuja highways, and the unique challenges of urban Nigeria.
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Smartphone size={24} />, title: "Undetectable", desc: "No app icon. Disguised as system service. Criminals can't find it." },
              { icon: <MapPin size={24} />, title: "Real-time tracking", desc: "Your contact sees your exact location during an emergency." },
              { icon: <Shield size={24} />, title: "Privacy first", desc: "All processing on-device. We never see your data." },
              { icon: <Heart size={24} />, title: "Community powered", desc: "Future mesh network turns users into witnesses." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                <div className="text-tsaro-amber flex-shrink-0 bg-tsaro-amber/10 w-12 h-12 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-gray-800">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-tsaro-indigo to-tsaro-indigo/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Shield size={48} className="mx-auto text-tsaro-amber" />
            <h3 className="text-3xl md:text-4xl font-bold">
              Ready to stay safe?
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of Nigerians who'll never face danger alone.
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-5 py-4 rounded-xl text-gray-100"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="bg-tsaro-amber hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl whitespace-nowrap shadow-lg"
                >
                  {loading ? 'Joining...' : 'Join Waitlist'}
                </motion.button>
              </form>
            ) : (
              <div className="bg-green-500/20 text-white p-6 rounded-xl inline-block border border-green-400">
                <CheckCircle className="inline mb-2 mr-2" size={20} />
                <span className="text-lg font-semibold">Thanks for joining! We'll be in touch.</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tsaro-indigo text-white py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <Shield size={24} className="text-tsaro-amber" />
          </motion.div>
          <p className="text-2xl font-bold mb-2">TSARO</p>
          <p className="text-sm text-gray-300 mb-6 max-w-md mx-auto">
            Security that watches when you can't.
          </p>
          <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
            <span>Lagos</span>
            <span>•</span>
            <span>Abuja</span>
            <span>•</span>
            <span>Port Harcourt</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Barterverse Technologies Ltd. <span className="text-xl">🇳🇬</span>
          </p>
        </div>
      </footer>
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 }
// };

// Back to top
// Back to Top Button Component
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.2 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-tsaro-amber hover:bg-amber-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center group"
      aria-label="Back to top"
    >
      <ChevronRight 
        size={24} 
        className="transform -rotate-90 group-hover:-translate-y-1 transition-transform" 
      />
    </motion.button>
  );
};

export default App;