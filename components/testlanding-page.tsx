import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextType from "./typewriter";

interface LandingPageProps {
  onLogin: (name: string, email: string) => void;
}

const NovaraHero = ({ onLogin }:LandingPageProps) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('')

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && name.trim()) {
            onLogin(name, email);
        }
    };
    
  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden">
      {/* Background Video Container */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <video 
          src="/demo.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          // poster="/poster.png"
        />
        {/* <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 z-0 opacity-60"
        >
            <img src="/poster.png" alt="poster" className="object-fit" />
        </motion.div> */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-36">
        <h1 className="text-4xl md:text-7xl font-medium tracking-tight leading-[1.05] max-w-5xl mb-4">
          AI That Thinks With <span className="text-gray-400 italic ">You</span>, <br className="hidden md:block" /> 
          <TextType 
            text={["Think Smarter About Markets", "From Idea to Opportunity", "Build Smarter Businesses" ,"Market Competitive Insight","Turn Uncertainty Into Market"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            className="text-primary"
          />
          {/* <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-900 via-white to-purple-900 font-sans">Not For You</span> */}
        </h1>

        <p className="text-sm md:text-lg max-w-4xl leading-relaxed mb-10 font-light">
          MehtaQuest is an advanced AI-powered business intelligence platform designed for aspiring entrepreneurs and innovation-driven R&D teams to turn ideas into actionable business plans. It analyzes market gaps, identifying high-potential opportunities, market risks, first mover score and evaluate competitive landscapes.
        </p>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-md p-5 rounded-xl backdrop-blur-lg border border-white/10 shadow-2xl"
        >
            <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 px-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="mb-2 w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />

                  <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2 px-1">Professional Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <button
                type="submit"
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                Analyze Opportunities
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </motion.div>

        {/* <button className="group relative px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all rounded-full overflow-hidden">
          <div className="relative z-10 flex items-center text-sm font-semibold tracking-widest uppercase">
            Request Demo
            <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">→</span>
          </div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button> */}
      </main>
    </div>
  );
};

export default NovaraHero;