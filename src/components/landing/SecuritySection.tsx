'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, FileCheck, CheckSquare, Server } from 'lucide-react';

export function SecuritySection() {
  const cards = [
    {
      title: 'Secure Authentication',
      desc: 'Protected user sessions. We never expose your workspace to unauthorized access.',
      icon: <Lock className="w-5 h-5 text-indigo-400" />
    },
    {
      title: 'Data Validation',
      desc: 'Uploaded datasets are validated before analysis, ensuring integrity from day one.',
      icon: <FileCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Structured AI',
      desc: 'AI responses are validated against strict structured schemas. No unconstrained hallucinations.',
      icon: <CheckSquare className="w-5 h-5 text-violet-400" />
    },
    {
      title: 'Server-Side Secrets',
      desc: 'Private API credentials remain server-side. Your keys are never exposed to the client browser.',
      icon: <Server className="w-5 h-5 text-indigo-300" />
    }
  ];

  return (
    <section id="security" className="py-24 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Enterprise Grade Security.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We don't make exaggerated claims. We just implement industry-standard security boundaries so you can analyze your data with peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 hover:border-indigo-500/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
