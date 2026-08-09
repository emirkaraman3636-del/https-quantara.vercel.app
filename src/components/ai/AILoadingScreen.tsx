import React, { useEffect, useState } from 'react';
import { Sparkles, Database, Code, ShieldCheck, LineChart, Cpu } from 'lucide-react';

interface AILoadingScreenProps {
  isLoading: boolean;
}

const steps = [
  { text: 'Initializing neural parser...', icon: <Cpu className="w-5 h-5 text-indigo-400" /> },
  { text: 'Extracting data vectors...', icon: <Database className="w-5 h-5 text-emerald-400" /> },
  { text: 'Mapping semantic schemas...', icon: <Code className="w-5 h-5 text-amber-400" /> },
  { text: 'Running behavioral clustering...', icon: <LineChart className="w-5 h-5 text-rose-400" /> },
  { text: 'Validating data integrity...', icon: <ShieldCheck className="w-5 h-5 text-cyan-400" /> },
];

export function AILoadingScreen({ isLoading }: AILoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 800); // Progress every 800ms
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 relative">
          <Sparkles className="w-8 h-8 animate-spin-slow" />
          <div className="absolute inset-0 rounded-2xl border border-indigo-500/50 animate-ping opacity-20" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-100 mb-2">AI Engine Working</h3>
        
        <div className="h-6 overflow-hidden mb-6">
          <div className="transition-transform duration-300" style={{ transform: `translateY(-${currentStep * 24}px)` }}>
            {steps.map((step, idx) => (
              <div key={idx} className="h-6 flex items-center justify-center gap-2 text-sm text-slate-400">
                {step.icon}
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
