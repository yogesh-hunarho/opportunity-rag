"use client";

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLogin: (email: string, apiKey: string) => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { scrollY } = useScroll();

  // Parallax effects for background
  const y1 = useTransform(scrollY, [0, 800], [0, 200]);
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email, apiKey);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans">
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0 opacity-60"
        >
          <Image
            src="/landing-bg.png"
            alt="Cinematic Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [-100, 100], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-0 w-96 h-64 bg-white/20 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{ x: [100, -100], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-0 w-[500px] h-80 bg-blue-500/10 blur-[120px] rounded-full"
          />
        </div>

        <div className="absolute inset-0 z-20 bg-linear-to-b from-black/40 via-transparent to-black" />
        <div className="relative z-30 max-w-6xl w-full text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-8xl font-black text-white mb-6 tracking-tight"
          >
            AI That Thinks <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-white to-purple-400">
              With You, Not For You
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
          >
            Market Analyze helps teams turn scattered data into confident decisions using adaptive AI workflows built for speed and scale.
          </motion.p>

          {/* Login Form Card - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full max-w-md p-8 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-left">
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

              {email.trim() && email.trim().toLowerCase() !== 'yogesh.singh@hunarho.com' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-left"
                >
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                Analyze Opportunities
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
