import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Maximize2, Minimize2, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  structured?: {
    answer: string;
    confidence: string;
    evidence?: string[];
    dataLimitations?: string[];
    recommendation?: string;
  };
}

export function ChatSidebar() {
  const { biContext, aiAnalysis } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset chat if dataset changes
  useEffect(() => {
    setMessages([]);
  }, [biContext?.metadata?.totalRows]);

  if (!biContext) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Build minimal history payload (just text)
      const history = messages.map(m => ({
        role: m.role,
        content: m.role === 'assistant' && m.structured ? m.structured.answer : m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          biContext,
          aiAnalysis,
          history
        })
      });

      const data = await res.json();
      
      if (data.success && data.answer) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer.answer,
          structured: data.answer 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, şu an yanıt oluşturulamadı. Lütfen tekrar deneyin.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Bağlantı hatası oluştu.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl shadow-indigo-500/50 transition-all z-50 flex items-center gap-3"
      >
        <Bot className="w-6 h-6" />
        <span className="font-medium pr-2">AI Analist</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-indigo-900/50 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">AI Business Analyst</h3>
            <p className="text-xs text-emerald-400">Online - Hazır</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
            <Bot className="w-12 h-12 opacity-50" />
            <p className="text-sm">Veri seti ile ilgili sormak istediğiniz soruları yazın.</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <button onClick={() => setInput("En kârlı ürünümüz hangisi?")} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full">En kârlı ürünümüz hangisi?</button>
              <button onClick={() => setInput("Toplam gelirimiz nedir?")} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full">Toplam gelirimiz nedir?</button>
              <button onClick={() => setInput("En büyük riskimiz nedir?")} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full">En büyük riskimiz nedir?</button>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className={`flex flex-col gap-2 max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
                
                {msg.structured && (
                  <div className="w-full space-y-2">
                    {msg.structured.evidence && msg.structured.evidence.length > 0 && (
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Kanıt</span>
                        <ul className="text-xs text-slate-400 list-disc list-inside">
                          {msg.structured.evidence.map((ev, idx) => <li key={idx}>{ev}</li>)}
                        </ul>
                      </div>
                    )}
                    {msg.structured.recommendation && (
                      <div className="bg-indigo-950/30 p-2 rounded-lg border border-indigo-900/30">
                        <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">Öneri</span>
                        <p className="text-xs text-indigo-200">{msg.structured.recommendation}</p>
                      </div>
                    )}
                    {msg.structured.dataLimitations && msg.structured.dataLimitations.length > 0 && (
                      <div className="flex items-start gap-1.5 text-[10px] text-amber-500/80 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Kısıtlama: {msg.structured.dataLimitations.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-slate-700 flex items-center gap-2">
                 <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                 <span className="text-xs text-slate-400">Analiz ediliyor...</span>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Veri hakkında bir soru sorun..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
